/** Browser event used by any public call-to-action to open the collaboration form. */
export const COLLABORATION_REQUEST_OPEN_EVENT = "deal:open-collaboration-request";

/** Opens the collaboration request dialog without coupling page sections to its UI component. */
export function openCollaborationRequest() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(COLLABORATION_REQUEST_OPEN_EVENT));
}
