import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, Inbox, Mail, MoreHorizontal, Phone, Save, UserRound } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { isCollaborationRequestStatus, listCollaborationRequests, type CollaborationRequestStatus } from "@/lib/collaborationRequestStore";
import { updateCollaborationRequestStatusAction } from "./actions";

export const dynamic = "force-dynamic";

const pageSize = 10;
const maxPageNumber = 100_000;
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
const fieldClass = "min-h-10 rounded-sm border border-[#8c8f94] bg-white px-3 text-sm text-[#1d2327] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]";

const statusMeta: Record<CollaborationRequestStatus, { label: string; className: string }> = {
  new: { label: "جدید", className: "bg-[#f0f6fc] text-[#2271b1]" },
  in_progress: { label: "در حال پیگیری", className: "bg-[#fff8e5] text-[#996800]" },
  closed: { label: "پایان‌یافته", className: "bg-[#edfaef] text-[#008a20]" },
};

const tabStatuses: CollaborationRequestStatus[] = ["new", "in_progress", "closed"];

type QueryValue = string | string[] | undefined;
type CollaborationRequestsPageProps = {
  searchParams: Promise<{ status?: QueryValue; page?: QueryValue; updated?: QueryValue; error?: QueryValue }>;
};

function firstQueryValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

/** Allows only known workflow tabs; malformed URLs open the new-request tab. */
function selectedStatus(value: QueryValue): CollaborationRequestStatus {
  const status = firstQueryValue(value);
  return isCollaborationRequestStatus(status) ? status : "new";
}

/** Converts an untrusted query value to a bounded, one-based page number. */
function selectedPage(value: QueryValue) {
  const source = firstQueryValue(value);
  if (!source || !/^[1-9]\d*$/.test(source)) return 1;

  const page = Number(source);
  return Number.isSafeInteger(page) ? Math.min(page, maxPageNumber) : 1;
}

function inboxHref(status: CollaborationRequestStatus, page: number) {
  return `/admin/collaboration-requests?status=${status}&page=${page}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Builds a compact page list, avoiding a button for every page in large inboxes. */
function paginationTokens(totalPages: number, currentPage: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1) as Array<number | "ellipsis">;

  const pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
    .filter((page) => page >= 1 && page <= totalPages)
    .filter((page, index, values) => values.indexOf(page) === index)
    .sort((first, second) => first - second);
  const tokens: Array<number | "ellipsis"> = [];

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1];
    if (previousPage && page - previousPage > 1) tokens.push("ellipsis");
    tokens.push(page);
  });

  return tokens;
}

export default async function CollaborationRequestsPage({ searchParams }: CollaborationRequestsPageProps) {
  await requireAdmin();

  const [requests, query] = await Promise.all([listCollaborationRequests(), searchParams]);
  const activeStatus = selectedStatus(query.status);
  const requestedPage = selectedPage(query.page);
  const statusCounts = {
    new: requests.filter((request) => request.status === "new").length,
    in_progress: requests.filter((request) => request.status === "in_progress").length,
    closed: requests.filter((request) => request.status === "closed").length,
  } satisfies Record<CollaborationRequestStatus, number>;
  const filteredRequests = requests.filter((request) => request.status === activeStatus);
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const rangeStart = filteredRequests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filteredRequests.length);
  const pageRequests = filteredRequests.slice(rangeStart === 0 ? 0 : rangeStart - 1, rangeEnd);
  const pageTokens = paginationTokens(totalPages, currentPage);
  const activeStatusMeta = statusMeta[activeStatus];

  return (
    <AdminShell
      active="requests"
      title="صندوق درخواست‌های همکاری"
      eyebrow="Collaboration request inbox"
      actions={
        <a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#2271b1] px-4 text-sm font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href="/admin">
          بازگشت به داشبورد
        </a>
      }
    >
      <div className="grid gap-4 pb-20 md:pb-0">
        {firstQueryValue(query.updated) ? (
          <p className="rounded-sm border border-[#00a32a] bg-[#edfaef] px-4 py-3 text-sm font-medium text-[#006b1c]" role="status">
            وضعیت درخواست به‌روزرسانی شد.
          </p>
        ) : null}
        {firstQueryValue(query.error) ? (
          <p className="rounded-sm border border-[#d63638] bg-[#fcf0f1] px-4 py-3 text-sm font-medium text-[#8a2424]" role="alert">
            درخواست موردنظر پیدا نشد یا وضعیت انتخاب‌شده معتبر نیست.
          </p>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="آمار درخواست‌های همکاری">
          <article className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
            <Inbox className="mb-4 text-[#d8a75c]" size={21} />
            <p className="text-xs text-[#646970]">همهٔ درخواست‌ها</p>
            <strong className="mt-1 block text-3xl font-semibold text-[#1d2327]">{formatNumber(requests.length)}</strong>
          </article>
          <article className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
            <Clock3 className="mb-4 text-[#2271b1]" size={21} />
            <p className="text-xs text-[#646970]">جدید</p>
            <strong className="mt-1 block text-3xl font-semibold text-[#1d2327]">{formatNumber(statusCounts.new)}</strong>
          </article>
          <article className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
            <UserRound className="mb-4 text-[#996800]" size={21} />
            <p className="text-xs text-[#646970]">در حال پیگیری</p>
            <strong className="mt-1 block text-3xl font-semibold text-[#1d2327]">{formatNumber(statusCounts.in_progress)}</strong>
          </article>
          <article className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm">
            <CheckCircle2 className="mb-4 text-[#008a20]" size={21} />
            <p className="text-xs text-[#646970]">پایان‌یافته</p>
            <strong className="mt-1 block text-3xl font-semibold text-[#1d2327]">{formatNumber(statusCounts.closed)}</strong>
          </article>
        </section>

        <section className="overflow-hidden rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="border-b border-[#dcdcde] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1d2327]">درخواست‌های {activeStatusMeta.label}</h2>
                <p className="mt-1 text-xs text-[#646970]">هر صفحه حداکثر ۱۰ درخواست را نشان می‌دهد.</p>
              </div>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${activeStatusMeta.className}`}>{formatNumber(statusCounts[activeStatus])} درخواست</span>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="فیلتر وضعیت درخواست‌ها">
              {tabStatuses.map((status) => {
                const isActive = status === activeStatus;

                return (
                  <a
                    aria-current={isActive ? "page" : undefined}
                    className={`${focusRing} inline-flex min-h-10 shrink-0 items-center gap-2 rounded-sm border px-3 text-sm font-semibold transition ${isActive ? "border-[#2271b1] bg-[#2271b1] text-white" : "border-[#dcdcde] bg-white text-[#50575e] hover:border-[#2271b1] hover:bg-[#f0f6fc] hover:text-[#2271b1]"}`}
                    href={inboxHref(status, 1)}
                    key={status}
                  >
                    {statusMeta[status].label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${isActive ? "bg-white/20 text-white" : statusMeta[status].className}`}>{formatNumber(statusCounts[status])}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="grid min-h-64 place-items-center p-6 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f6f7f7] text-[#8c8f94]"><Inbox size={23} /></span>
                <h3 className="mt-4 font-semibold text-[#1d2327]">درخواست {activeStatusMeta.label} وجود ندارد</h3>
                <p className="mt-1 text-sm text-[#646970]">با ثبت یا تغییر وضعیت درخواست‌ها، موارد مربوط به این تب در همین‌جا نمایش داده می‌شوند.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dcdcde] bg-[#f6f7f7] px-4 py-2.5 text-xs text-[#646970]">
                <span>نمایش {formatNumber(rangeStart)} تا {formatNumber(rangeEnd)} از {formatNumber(filteredRequests.length)} درخواست</span>
                <span>صفحهٔ {formatNumber(currentPage)} از {formatNumber(totalPages)}</span>
              </div>

              <div className="divide-y divide-[#dcdcde]">
                {pageRequests.map((request) => {
                  const status = statusMeta[request.status];

                  return (
                    <article className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start" key={request.id}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <UserRound className="text-[#d8a75c]" size={18} />
                              <h3 className="font-semibold text-[#1d2327]">{request.name}</h3>
                            </div>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#646970]">
                              <span>ثبت: {formatDate(request.createdAt)}</span>
                              {request.updatedAt !== request.createdAt ? <span>آخرین تغییر: {formatDate(request.updatedAt)}</span> : null}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <a className={`${focusRing} inline-flex min-h-10 items-center gap-2 rounded-sm border border-[#dcdcde] px-3 text-sm text-[#2271b1] hover:bg-[#f0f6fc]`} dir="ltr" href={`mailto:${encodeURIComponent(request.email)}`}>
                            <Mail size={16} />
                            <span className="truncate">{request.email}</span>
                          </a>
                          <a className={`${focusRing} inline-flex min-h-10 items-center gap-2 rounded-sm border border-[#dcdcde] px-3 text-sm text-[#2271b1] hover:bg-[#f0f6fc]`} dir="ltr" href={phoneHref(request.phone)}>
                            <Phone size={16} />
                            <span>{request.phone}</span>
                          </a>
                        </div>

                        <div className="mt-4 rounded-sm bg-[#f6f7f7] p-3">
                          <p className="mb-1 text-xs font-semibold text-[#50575e]">متن درخواست</p>
                          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#1d2327]">{request.message}</p>
                        </div>
                      </div>

                      <form action={updateCollaborationRequestStatusAction} className="grid gap-2 rounded-sm border border-[#dcdcde] bg-[#f6f7f7] p-3 lg:w-56">
                        <input name="id" type="hidden" value={request.id} />
                        <input name="returnStatus" type="hidden" value={activeStatus} />
                        <input name="returnPage" type="hidden" value={currentPage} />
                        <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                          وضعیت پیگیری
                          <select className={fieldClass} defaultValue={request.status} name="status">
                            {tabStatuses.map((value) => (
                              <option key={value} value={value}>{statusMeta[value].label}</option>
                            ))}
                          </select>
                        </label>
                        <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-3 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit">
                          <Save size={16} />
                          ذخیرهٔ وضعیت
                        </button>
                      </form>
                    </article>
                  );
                })}
              </div>

              {totalPages > 1 ? (
                <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-[#dcdcde] p-4" aria-label="صفحه‌بندی درخواست‌ها">
                  {currentPage > 1 ? (
                    <a className={`${focusRing} inline-flex min-h-9 items-center gap-1 rounded-sm border border-[#c3c4c7] px-3 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href={inboxHref(activeStatus, currentPage - 1)}>
                      <ChevronRight size={15} />
                      قبلی
                    </a>
                  ) : (
                    <span aria-disabled="true" className="inline-flex min-h-9 cursor-not-allowed items-center gap-1 rounded-sm border border-[#dcdcde] px-3 text-xs font-semibold text-[#8c8f94]">
                      <ChevronRight size={15} />
                      قبلی
                    </span>
                  )}

                  {pageTokens.map((token, index) => token === "ellipsis" ? (
                    <span aria-hidden="true" className="grid h-9 w-8 place-items-center text-[#8c8f94]" key={`ellipsis-${index}`}><MoreHorizontal size={17} /></span>
                  ) : (
                    <a
                      aria-current={token === currentPage ? "page" : undefined}
                      className={`${focusRing} grid h-9 min-w-9 place-items-center rounded-sm border px-2 text-xs font-semibold ${token === currentPage ? "border-[#2271b1] bg-[#2271b1] text-white" : "border-[#c3c4c7] text-[#2271b1] hover:bg-[#f0f6fc]"}`}
                      href={inboxHref(activeStatus, token)}
                      key={token}
                    >
                      {formatNumber(token)}
                    </a>
                  ))}

                  {currentPage < totalPages ? (
                    <a className={`${focusRing} inline-flex min-h-9 items-center gap-1 rounded-sm border border-[#c3c4c7] px-3 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} href={inboxHref(activeStatus, currentPage + 1)}>
                      بعدی
                      <ChevronLeft size={15} />
                    </a>
                  ) : (
                    <span aria-disabled="true" className="inline-flex min-h-9 cursor-not-allowed items-center gap-1 rounded-sm border border-[#dcdcde] px-3 text-xs font-semibold text-[#8c8f94]">
                      بعدی
                      <ChevronLeft size={15} />
                    </span>
                  )}
                </nav>
              ) : null}
            </>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
