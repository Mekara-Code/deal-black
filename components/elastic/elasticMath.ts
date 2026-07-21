/** Geometry and interpolation helpers used by the SVG elastic button. */

export type ElasticNode = {
  baseX: number;
  baseY: number;
  normalX: number;
  normalY: number;
  x: number;
  y: number;
  displacement: number;
  velocity: number;
};

const STRAIGHT_EDGE_SAMPLES = 5;
const ARC_SAMPLES = 6;
const CATMULL_ROM_TENSION = 0.86;

/** Keeps a scalar inside an inclusive range without creating temporary objects. */
export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Creates evenly distributed points for a capsule. Each point has an outward
 * normal so the spring simulation can deform the perimeter without breaking it.
 */
export function createCapsuleNodes(width: number, height: number): ElasticNode[] {
  const radius = height / 2;
  const straightLength = Math.max(0, width - radius * 2);
  const nodes: ElasticNode[] = [];

  const addNode = (x: number, y: number, normalX: number, normalY: number) => {
    nodes.push({ baseX: x, baseY: y, normalX, normalY, x, y, displacement: 0, velocity: 0 });
  };

  for (let index = 0; index < STRAIGHT_EDGE_SAMPLES; index += 1) {
    const progress = index / (STRAIGHT_EDGE_SAMPLES - 1);
    addNode(radius + straightLength * progress, 0, 0, -1);
  }

  for (let index = 1; index <= ARC_SAMPLES; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI * index) / (ARC_SAMPLES + 1);
    addNode(width - radius + Math.cos(angle) * radius, radius + Math.sin(angle) * radius, Math.cos(angle), Math.sin(angle));
  }

  for (let index = 0; index < STRAIGHT_EDGE_SAMPLES; index += 1) {
    const progress = index / (STRAIGHT_EDGE_SAMPLES - 1);
    addNode(width - radius - straightLength * progress, height, 0, 1);
  }

  for (let index = 1; index <= ARC_SAMPLES; index += 1) {
    const angle = Math.PI / 2 + (Math.PI * index) / (ARC_SAMPLES + 1);
    addNode(radius + Math.cos(angle) * radius, radius + Math.sin(angle) * radius, Math.cos(angle), Math.sin(angle));
  }

  return nodes;
}

/** Returns the squared distance from a point to a finite perimeter segment. */
function pointToSegmentDistanceSquared(pointX: number, pointY: number, start: ElasticNode, end: ElasticNode) {
  const segmentX = end.baseX - start.baseX;
  const segmentY = end.baseY - start.baseY;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  const projection = segmentLengthSquared === 0
    ? 0
    : clamp(((pointX - start.baseX) * segmentX + (pointY - start.baseY) * segmentY) / segmentLengthSquared, 0, 1);
  const closestX = start.baseX + segmentX * projection;
  const closestY = start.baseY + segmentY * projection;
  const deltaX = pointX - closestX;
  const deltaY = pointY - closestY;

  return deltaX * deltaX + deltaY * deltaY;
}

/** Finds the perimeter segment nearest to the cursor for localized deformation. */
export function findNearestSegment(nodes: ElasticNode[], pointX: number, pointY: number) {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < nodes.length; index += 1) {
    const distance = pointToSegmentDistanceSquared(pointX, pointY, nodes[index], nodes[(index + 1) % nodes.length]);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}

/** Measures the shortest index distance around the closed perimeter. */
export function circularIndexDistance(first: number, second: number, count: number) {
  const directDistance = Math.abs(first - second);
  return Math.min(directDistance, count - directDistance);
}

/**
 * Converts the moving perimeter nodes into a continuously smooth cubic Bézier path.
 * Catmull–Rom-derived handles keep neighboring segments tangent-continuous.
 */
export function createMorphPath(nodes: ElasticNode[]) {
  const count = nodes.length;
  const controlFactor = CATMULL_ROM_TENSION / 6;
  let path = `M${nodes[0].x.toFixed(2)},${nodes[0].y.toFixed(2)}`;

  for (let index = 0; index < count; index += 1) {
    const previous = nodes[(index - 1 + count) % count];
    const current = nodes[index];
    const next = nodes[(index + 1) % count];
    const afterNext = nodes[(index + 2) % count];
    const firstControlX = current.x + (next.x - previous.x) * controlFactor;
    const firstControlY = current.y + (next.y - previous.y) * controlFactor;
    const secondControlX = next.x - (afterNext.x - current.x) * controlFactor;
    const secondControlY = next.y - (afterNext.y - current.y) * controlFactor;

    path += `C${firstControlX.toFixed(2)},${firstControlY.toFixed(2)} ${secondControlX.toFixed(2)},${secondControlY.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }

  return `${path}Z`;
}
