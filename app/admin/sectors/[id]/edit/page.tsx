import { notFound } from "next/navigation";
import { Save } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { getSectorById } from "@/lib/sectorStore";
import { SectorEditorClient } from "../../new/SectorEditorClient";
import { updateSectorAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
const wpButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border border-[#8c8f94] bg-[#f6f7f7] px-3 text-xs font-semibold text-[#1d2327] hover:bg-[#f0f0f1]`;
const primaryButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-3 text-xs font-semibold text-white hover:bg-[#135e96]`;

type EditSectorPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditSectorPage({ params, searchParams }: EditSectorPageProps) {
  await requireAdmin();

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const sector = await getSectorById(decodeURIComponent(id));

  if (!sector) {
    notFound();
  }

  return (
    <AdminShell
      active="sectors"
      title={`ویرایش ${sector.title}`}
      eyebrow="Sector media-aware editor"
      actions={
        <>
          <button className={wpButton} form="sector-editor-form" name="status" type="submit" value="draft">
            <Save size={15} />
            ذخیره پیش‌نویس
          </button>
          <button className={primaryButton} form="sector-editor-form" name="status" type="submit" value="published">
            ذخیره و انتشار
          </button>
        </>
      }
    >
      <SectorEditorClient action={updateSectorAction.bind(null, sector.id)} error={query?.error} initialSector={sector} />
    </AdminShell>
  );
}
