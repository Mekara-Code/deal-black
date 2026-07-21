import {
  Activity,
  ArrowLeft,
  Clock3,
  Eye,
  FileText,
  Globe2,
  Inbox,
  Pencil,
  PhoneCall,
  PlusCircle,
  Tags,
  Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { languageLabel } from "@/lib/i18n";
import { deleteSectorAction } from "./sectors/actions";
import { listCollaborationRequests } from "@/lib/collaborationRequestStore";
import { listSectors, sectorStatusLabel } from "@/lib/sectorStore";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [sectors, collaborationRequests] = await Promise.all([listSectors(), listCollaborationRequests()]);
  const publishedCount = sectors.filter((sector) => sector.status === "published").length;
  const draftCount = sectors.filter((sector) => sector.status === "draft").length;
  const latestSector = sectors[0];
  const latestCollaborationRequest = collaborationRequests[0];
  const newRequestCount = collaborationRequests.filter((request) => request.status === "new").length;

  const stats = [
    { label: "Sectorهای فعال", value: String(publishedCount), change: `${draftCount} پیش‌نویس`, icon: Tags },
    { label: "کل Sectorها", value: String(sectors.length), change: "داینامیک", icon: FileText },
    { label: "درخواست‌های همکاری", value: String(collaborationRequests.length), change: `${newRequestCount} جدید`, icon: Inbox },
    { label: "کشورهای متصل", value: "34", change: "پایدار", icon: Globe2 },
  ];

  const activities = [
    latestCollaborationRequest ? `آخرین درخواست همکاری: ${latestCollaborationRequest.name}` : "هنوز درخواست همکاری ثبت نشده است.",
    latestSector ? `آخرین به‌روزرسانی: ${latestSector.title}` : "هنوز Sector جدیدی ثبت نشده است.",
    `${publishedCount} Sector منتشر شده در سایت آماده نمایش است.`,
    `${draftCount} پیش‌نویس برای تکمیل باقی مانده است.`,
    "فرم افزودن Sector مثل ادیتور وردپرس فعال است.",
  ];

  return (
    <AdminShell
      active="dashboard"
      title="داشبورد مدیریت"
      eyebrow="DEAL content control"
      actions={
        <>
          <a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#2271b1] px-4 text-sm font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href="/admin/collaboration-requests">
            <Inbox size={17} />
            صندوق درخواست‌ها
          </a>
          <a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#2271b1] px-4 text-sm font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href="/admin/contact">
            <PhoneCall size={17} />
            راه‌های ارتباطی
          </a>
          <a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} href="/admin/sectors/new">
            <PlusCircle size={17} />
            افزودن Sector
          </a>
        </>
      }
    >
      <div className="grid gap-4 pb-20 md:pb-0">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Admin statistics">
          {stats.map(({ label, value, change, icon: Icon }) => (
            <article key={label} className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#f6f7f7] text-[#d8a75c]">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="rounded-full bg-[#edfaef] px-2 py-1 text-[11px] font-semibold text-[#008a20]">{change}</span>
              </div>
              <p className="mb-1 text-xs text-[#646970]">{label}</p>
              <strong className="text-3xl font-semibold tracking-tight text-[#1d2327]">{value}</strong>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#dcdcde] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1d2327]">Sectorها</h2>
                <p className="mt-1 text-xs text-[#646970]">لیست زنده از Sectorهای ذخیره‌شده</p>
              </div>
              <a className={`${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border border-[#2271b1] px-3 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href="/admin/sectors/new">
                صفحه افزودن
                <ArrowLeft size={15} />
              </a>
            </div>

            <div className="divide-y divide-[#dcdcde]">
              {sectors.map((sector) => (
                <article key={sector.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 grid h-9 w-9 place-items-center rounded-sm bg-[#f6f7f7] text-[#d8a75c]">
                      <FileText size={18} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#1d2327]">{sector.title}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#646970]">
                        <span>{sector.slug}</span>
                        <span className="h-1 w-1 rounded-full bg-[#c3c4c7]" />
                        <span>{languageLabel(sector.language)}</span>
                        <span className="h-1 w-1 rounded-full bg-[#c3c4c7]" />
                        <span>{formatDate(sector.updatedAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${sector.status === "published" ? "bg-[#edfaef] text-[#008a20]" : "bg-[#f0f6fc] text-[#2271b1]"}`}>
                      {sectorStatusLabel(sector.status)}
                    </span>
                    <a className={`${focusRing} inline-flex min-h-9 items-center justify-center gap-1 rounded-sm border border-[#2271b1] px-3 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href={`/admin/sectors/${encodeURIComponent(sector.id)}/edit`}>
                      <Pencil size={14} />
                      ویرایش
                    </a>
                    <form action={deleteSectorAction}>
                      <input name="id" type="hidden" value={sector.id} />
                      <button className={`${focusRing} inline-flex min-h-9 items-center justify-center gap-1 rounded-sm border border-[#d63638] px-3 text-xs font-semibold text-[#b32d2e] hover:bg-[#fcf0f1]`} type="submit">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="text-[#d8a75c]" size={20} />
                <h2 className="text-base font-semibold text-[#1d2327]">فعالیت‌های اخیر</h2>
              </div>
              <div className="grid gap-3">
                {activities.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-[#50575e]">
                    <Clock3 className="mt-0.5 shrink-0 text-[#8c8f94]" size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-[#d8a75c66] bg-[#1d2327] p-4 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8a75c]">Next action</p>
              <h2 className="mt-3 text-xl font-semibold">Sector جدید را مثل پست وردپرس بساز</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">
                بعد از انتشار، Sector در فایل داده ذخیره می‌شود و همین داشبورد فوراً آمار و لیست را از آن می‌خواند.
              </p>
              <a className={`${focusRing} mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#d8a75c] px-4 text-sm font-bold text-[#101417] hover:bg-[#edc77f]`} href="/admin/sectors/new">
                شروع نوشتن
                <ArrowLeft size={17} />
              </a>
            </div>
          </aside>
        </section>
      </div>
    </AdminShell>
  );
}
