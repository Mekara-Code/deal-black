import { Building2, ImagePlus, PlusCircle, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { listPartnerLogos, type PartnerLogo } from "@/lib/partnerLogoStore";
import { createPartnerLogoAction, deletePartnerLogoAction, updatePartnerLogoAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
const fieldClass = "min-h-10 w-full rounded-sm border border-[#8c8f94] bg-white px-3 text-sm text-[#1d2327] outline-none transition placeholder:text-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]";

function LogoFields({ logo, requireImage = false }: { logo?: PartnerLogo; requireImage?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
        نام شریک
        <input className={fieldClass} defaultValue={logo?.name} maxLength={160} name="name" placeholder="نام شرکت یا شریک" required type="text" />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]" dir="ltr">
        Website URL (optional)
        <input className={fieldClass} defaultValue={logo?.websiteUrl} name="websiteUrl" placeholder="https://partner.example" type="url" />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
        ترتیب نمایش
        <input className={fieldClass} defaultValue={logo?.order ?? 1} min="0" name="order" type="number" />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
        وضعیت
        <select className={fieldClass} defaultValue={logo?.status ?? "published"} name="status">
          <option value="published">منتشرشده</option>
          <option value="draft">پیش‌نویس</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-[#50575e] sm:col-span-2">
        <span className="flex items-center gap-2"><ImagePlus size={16} /> فایل لوگو (PNG، JPG، WebP یا AVIF — حداکثر ۳ مگابایت)</span>
        <input className={`${fieldClass} cursor-pointer py-2`} accept="image/avif,image/jpeg,image/png,image/webp" name="image" required={requireImage} type="file" />
      </label>
    </div>
  );
}

export default async function PartnerLogosAdminPage() {
  await requireAdmin();
  const logos = await listPartnerLogos();

  return (
    <AdminShell
      active="logos"
      title="لوگوهای شرکا"
      eyebrow="Partners / Brand assets"
      actions={<a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} href="#new-partner-logo"><PlusCircle size={17} /> افزودن لوگو</a>}
    >
      <div className="grid gap-5 pb-20 md:pb-0">
        <section id="new-partner-logo" className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#f0f6fc] text-[#2271b1]"><Building2 size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">افزودن لوگوی شریک</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">فقط فایل‌های تصویری معتبر پذیرفته می‌شوند. لینک وب‌سایت نیز در صورت نیاز باید HTTPS باشد.</p>
            </div>
          </div>
          <form action={createPartnerLogoAction} className="grid gap-4 p-4">
            <LogoFields requireImage />
            <button className={`${focusRing} inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit"><PlusCircle size={17} /> ذخیره لوگو</button>
          </form>
        </section>

        <section className="grid gap-4" aria-label="Partner logos">
          {logos.map((logo) => (
            <article key={logo.id} className="overflow-hidden rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdcde] bg-[#f6f7f7] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-sm border border-[#dcdcde] bg-white p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="max-h-full max-w-full object-contain" src={logo.imageUrl} alt="" />
                  </div>
                  <div className="min-w-0"><strong className="block truncate text-sm text-[#1d2327]">{logo.name}</strong><span className="text-xs text-[#646970]">اولویت نمایش: {logo.order}</span></div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${logo.status === "published" ? "bg-[#edfaef] text-[#008a20]" : "bg-[#f0f6fc] text-[#2271b1]"}`}>{logo.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
                </div>
              </div>
              <form action={updatePartnerLogoAction} className="grid gap-4 p-4">
                <input name="id" type="hidden" value={logo.id} />
                <LogoFields logo={logo} />
                <div className="flex flex-wrap items-center gap-2">
                  <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit"><Save size={16} /> ذخیره تغییرات</button>
                  <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#d63638] px-4 text-sm font-semibold text-[#b32d2e] hover:bg-[#fcf0f1]`} formAction={deletePartnerLogoAction} formNoValidate type="submit"><Trash2 size={16} /> حذف</button>
                </div>
              </form>
            </article>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
