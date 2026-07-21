import { Save } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { SectorEditorClient } from "./SectorEditorClient";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
const wpButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border border-[#8c8f94] bg-[#f6f7f7] px-3 text-xs font-semibold text-[#1d2327] hover:bg-[#f0f0f1]`;
const primaryButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-3 text-xs font-semibold text-white hover:bg-[#135e96]`;

type NewSectorPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewSectorPage({ searchParams }: NewSectorPageProps) {
  await requireAdmin();
  const params = await searchParams;

  return (
    <AdminShell
      active="sectors"
      title="افزودن Sector"
      eyebrow="WordPress Gutenberg editor"
      actions={
        <>
          <button className={wpButton} form="sector-editor-form" name="status" type="submit" value="draft">
            <Save size={15} />
            ذخیره پیش‌نویس
          </button>
          <button className={primaryButton} form="sector-editor-form" name="status" type="submit" value="published">
            انتشار
          </button>
        </>
      }
    >
      <SectorEditorClient error={params?.error} />
    </AdminShell>
  );
}
