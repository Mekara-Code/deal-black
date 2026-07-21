import { AtSign, MapPin, MessageCircle, PhoneCall, Save } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { requireAdmin } from "@/lib/adminAuth";
import { getContactSettings } from "@/lib/contactSettingsStore";
import { updateContactSettingsAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
const fieldClass = "min-h-10 w-full rounded-sm border border-[#8c8f94] bg-white px-3 text-sm text-[#1d2327] outline-none transition placeholder:text-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]";

const messengers = [
  { name: "whatsapp", label: "WhatsApp", hint: "https://wa.me/989101114844" },
  { name: "telegram", label: "Telegram", hint: "https://t.me/username" },
  { name: "instagram", label: "Instagram", hint: "https://instagram.com/username" },
  { name: "linkedin", label: "LinkedIn", hint: "https://linkedin.com/company/name" },
] as const;

export default async function ContactSettingsPage() {
  await requireAdmin();
  const settings = await getContactSettings();

  return (
    <AdminShell active="contact" title="راه‌های ارتباطی" eyebrow="Site settings / Contact channels">
      <form action={updateContactSettingsAction} className="grid max-w-5xl gap-5 pb-20 md:pb-0">
        <section className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#fdf7ed] text-[#d8a75c]"><AtSign size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">اطلاعات اصلی شرکت</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">ایمیل در نوار بالای سایت نمایش داده می‌شود؛ نشانی‌ها متناسب با زبان فارسی، انگلیسی و عربی استفاده می‌شوند.</p>
            </div>
          </div>
          <div className="grid gap-4 p-4">
            <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
              ایمیل شرکت
              <input className={fieldClass} name="email" defaultValue={settings.email} dir="ltr" placeholder="info@dealfdi.com" type="email" />
            </label>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[#d8a75c]" /> نشانی فارسی</span>
                <textarea className={`${fieldClass} min-h-28 resize-y py-2.5`} name="addressFa" defaultValue={settings.addressFa} dir="rtl" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[#d8a75c]" /> English address</span>
                <textarea className={`${fieldClass} min-h-28 resize-y py-2.5`} name="addressEn" defaultValue={settings.addressEn} dir="ltr" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[#d8a75c]" /> العنوان العربي</span>
                <textarea className={`${fieldClass} min-h-28 resize-y py-2.5`} name="addressAr" defaultValue={settings.addressAr} dir="rtl" />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#f0f6fc] text-[#2271b1]"><PhoneCall size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">شماره‌های تماس</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">شماره‌ها در مودال تماس و ایمیل شرکت در نوار بالای سایت نمایش داده می‌شوند.</p>
            </div>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
              شماره اصلی
              <input className={fieldClass} name="phonePrimary" defaultValue={settings.phonePrimary} dir="ltr" placeholder="+989101114844" type="tel" />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
              شماره دوم (اختیاری)
              <input className={fieldClass} name="phoneSecondary" defaultValue={settings.phoneSecondary} dir="ltr" placeholder="Optional" type="tel" />
            </label>
          </div>
        </section>

        <section className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#fdf7ed] text-[#d8a75c]"><MessageCircle size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">پیام‌رسان‌ها و شبکه‌های اجتماعی</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">هر لینکِ پرشده، به‌صورت آیکون طلایی در نوار بالای سایت نمایش داده می‌شود.</p>
            </div>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {messengers.map(({ name, label, hint }) => (
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]" key={name}>
                <span className="flex items-center gap-2"><SocialBrandIcon network={name} className="h-4 w-4 text-[#d8a75c]" aria-hidden="true" /> {label}</span>
                <input className={fieldClass} name={name} defaultValue={settings[name]} dir="ltr" placeholder={hint} type="url" />
              </label>
            ))}
          </div>
        </section>

        <button className={`${focusRing} inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-5 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit">
          <Save size={17} /> ذخیره راه‌های ارتباطی
        </button>
      </form>
    </AdminShell>
  );
}
