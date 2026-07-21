import { ImagePlus, MessageSquareQuote, PlusCircle, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { PartnerStoryFields } from "@/components/admin/PartnerStoryFields";
import { requireAdmin } from "@/lib/adminAuth";
import { listPartnerStories } from "@/lib/partnerStoryStore";
import { createPartnerStoryAction, deletePartnerStoryAction, updatePartnerStoryAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";

export default async function PartnerStoriesAdminPage() {
  await requireAdmin();
  const stories = await listPartnerStories();

  return (
    <AdminShell
      active="partners"
      title="مدیریت داستان‌های شرکا"
      eyebrow="Home / Partner testimonials"
      actions={
        <a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} href="#new-partner-story">
          <PlusCircle size={17} />
          افزودن داستان
        </a>
      }
    >
      <div className="grid gap-5 pb-20 md:pb-0">
        <section id="new-partner-story" className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#f0f6fc] text-[#2271b1]"><ImagePlus size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">افزودن داستان شریک جدید</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">هر داستان یک تصویر و وضعیت مشترک دارد و متن آن برای فارسی، عربی و انگلیسی در یک کارت ثبت می‌شود.</p>
            </div>
          </div>
          <form action={createPartnerStoryAction} className="grid gap-4 p-4">
            <PartnerStoryFields />
            <button className={`${focusRing} inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit">
              <PlusCircle size={17} />
              انتشار داستان
            </button>
          </form>
        </section>

        <section className="grid gap-4" aria-label="Partner stories">
          {stories.map((story) => {
            const displayName = story.translations.fa.name || story.translations.en.name || story.translations.ar.name || "داستان بدون عنوان";

            return (
              <article key={story.id} className="overflow-hidden rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdcde] bg-[#f6f7f7] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="text-[#d8a75c]" size={19} />
                    <strong className="text-sm text-[#1d2327]">{displayName}</strong>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${story.status === "published" ? "bg-[#edfaef] text-[#008a20]" : "bg-[#f0f6fc] text-[#2271b1]"}`}>{story.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
                  </div>
                  {story.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="h-10 w-10 rounded-sm border border-[#dcdcde] object-cover" src={story.imageUrl} alt="" />
                  ) : null}
                </div>
                <form action={updatePartnerStoryAction} className="grid gap-4 p-4">
                  <input name="id" type="hidden" value={story.id} />
                  <PartnerStoryFields story={story} />
                  <div className="flex flex-wrap items-center gap-2">
                    <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit">
                      <Save size={16} />
                      ذخیره تغییرات
                    </button>
                    <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#d63638] px-4 text-sm font-semibold text-[#b32d2e] hover:bg-[#fcf0f1]`} formAction={deletePartnerStoryAction} formNoValidate type="submit">
                      <Trash2 size={16} />
                      حذف
                    </button>
                  </div>
                </form>
              </article>
            );
          })}
        </section>
      </div>
    </AdminShell>
  );
}
