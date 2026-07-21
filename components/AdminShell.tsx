import {
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  PhoneCall,
  PlusCircle,
  Tags,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { DealLogo } from "@/components/DealBrandVisuals";

type AdminShellProps = {
  active?: "dashboard" | "sectors" | "partners" | "logos" | "team" | "contact" | "requests" | "settings";
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  key: NonNullable<AdminShellProps["active"]>;
};

const navItems: NavItem[] = [
  { label: "صندوق درخواست‌ها", href: "/admin/collaboration-requests", icon: Inbox, key: "requests" },
  { label: "اعضای تیم", href: "/admin/team", icon: UsersRound, key: "team" },
  { label: "داستان‌های شرکا", href: "/admin/partner-stories", icon: MessageSquareQuote, key: "partners" },
  { label: "لوگوهای شرکا", href: "/admin/partner-logos", icon: Building2, key: "logos" },
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard, key: "dashboard" },
  { label: "Sectorها", href: "/admin/sectors/new", icon: Tags, key: "sectors" },
  { label: "راه‌های ارتباطی", href: "/admin/contact", icon: PhoneCall, key: "contact" },
];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";

export function AdminShell({ active = "dashboard", title, eyebrow, actions, children }: AdminShellProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#f0f0f1] text-[#1d2327] [font-family:var(--font-persian)]">
      <header className="sticky top-0 z-50 border-b border-[#c3c4c7] bg-[#1d2327] text-white shadow-sm md:hidden">
        <div className="flex min-h-14 items-center justify-between px-4">
          <a className={`${focusRing} inline-flex items-center gap-2 text-[#d8a75c]`} href="/admin" aria-label="DEAL admin dashboard">
            <DealLogo className="h-auto w-24" />
          </a>
          <a className={`${focusRing} inline-flex h-10 items-center gap-2 rounded-sm bg-[#2c3338] px-3 text-xs font-semibold`} href="/admin/sectors/new">
            <PlusCircle size={16} />
            افزودن
          </a>
        </div>
      </header>

      <div className="md:grid md:min-h-screen md:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden border-l border-[#111820] bg-[#1d2327] text-[#f0f0f1] md:flex md:min-h-screen md:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <a className={`${focusRing} block text-[#d8a75c]`} href="/admin">
              <DealLogo className="h-auto w-32" />
            </a>
            <p className="mt-3 text-xs text-white/45">DEAL Admin Panel</p>
          </div>

          <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
            {navItems.map(({ label, href, icon: Icon, key }) => {
              const isActive = active === key;
              return (
                <a
                  key={`${label}-${href}`}
                  className={`${focusRing} mb-1 flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm transition ${isActive ? "bg-[#d8a75c] text-[#101417]" : "text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white"}`}
                  href={href}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  {label}
                </a>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <a className={`${focusRing} flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white`} href="/">
              <FileText size={18} />
              مشاهده سایت
            </a>
            <form action="/logout" method="post">
              <button className={`${focusRing} flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white`} type="submit">
                <LogOut size={18} />
                خروج
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-40 hidden min-h-10 items-center justify-between border-b border-[#c3c4c7] bg-white px-6 text-xs text-[#50575e] shadow-sm md:flex">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1d2327]">DEAL</span>
              <span>/</span>
              <span>{title}</span>
            </div>
            <div className="flex items-center gap-4">
              <a className={`${focusRing} hover:text-[#2271b1]`} href="/">مشاهده سایت</a>
              <form action="/logout" method="post">
                <button className={`${focusRing} hover:text-[#2271b1]`} type="submit">خروج</button>
              </form>
            </div>
          </div>

          <main className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#646970]">{eyebrow}</p> : null}
                <h1 className="m-0 text-2xl font-semibold leading-tight text-[#1d2327]">{title}</h1>
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>

            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-7 border-t border-[#c3c4c7] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.08)] md:hidden" aria-label="Mobile admin navigation">
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "dashboard" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin">
          <LayoutDashboard size={19} />
          داشبورد
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "sectors" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/sectors/new">
          <PlusCircle size={19} />
          افزودن Sector
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "team" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/team">
          <UsersRound size={19} />
          تیم
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "partners" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/partner-stories">
          <MessageSquareQuote size={19} />
          شرکا
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[10px] ${active === "logos" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/partner-logos">
          <Building2 size={18} />
          لوگوها
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "contact" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/contact">
          <PhoneCall size={19} />
          تماس
        </a>
        <a className={`${focusRing} grid min-h-16 place-items-center gap-1 text-[11px] ${active === "requests" ? "text-[#d8a75c]" : "text-[#50575e]"}`} href="/admin/collaboration-requests">
          <Inbox size={19} />
          درخواست‌ها
        </a>
      </nav>
    </div>
  );
}
