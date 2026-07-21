import { ArrowLeft, Eye, LockKeyhole, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { DealLogo } from "@/components/DealBrandVisuals";
import { getAdminSession, getSafeAdminRedirectPath } from "@/lib/adminAuth";
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();
  const params = await searchParams;
  const next = getSafeAdminRedirectPath(params?.next);

  if (session) {
    redirect(next);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]">
      <section className="grid min-h-screen place-items-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[430px]">
          <a className={`${focusRing} mb-8 inline-flex text-[#d8a75c]`} href="/" aria-label="بازگشت به سایت DEAL">
            <DealLogo className="h-auto w-32" />
          </a>

          <div className="rounded-[10px] border border-[#d8a75c45] bg-[#071016] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8a75c]">Admin access</p>
            <h1 className="mb-2 text-2xl font-semibold leading-tight text-white">ورود به پنل مدیریت</h1>
            <p className="mb-6 text-sm leading-6 text-white/55">
              برای مدیریت sectorها، گزارش‌ها و محتوای سایت وارد شوید.
            </p>

            {params?.error === "unavailable" ? (
              <div className="mb-5 rounded-md border border-[#ffca80]/50 bg-[#2a1b10] px-3 py-2 text-sm leading-6 text-[#ffe6c1]">
                ورود مدیریت در حال حاضر در دسترس نیست. لطفاً با مدیر سامانه تماس بگیرید.
              </div>
            ) : params?.error === "invalid" ? (
              <div className="mb-5 rounded-md border border-[#ff8080]/50 bg-[#2a1010] px-3 py-2 text-sm leading-6 text-[#ffd6d6]">
                اطلاعات ورود معتبر نیست یا تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.
              </div>
            ) : null}

            <form action={loginAction} className="grid gap-4">
              <input name="next" type="hidden" value={next} />
              <label className="grid gap-2 text-sm font-medium text-white/80">
                ایمیل یا نام کاربری
                <span className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#d8a75c]" size={18} />
                  <input
                    className={`${focusRing} h-12 w-full rounded-md border border-[#d8a75c38] bg-[#02090e] pr-10 pl-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#d8a75c]`}
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    maxLength={128}
                    placeholder="نام کاربری"
                    required
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-medium text-white/80">
                رمز عبور
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#d8a75c]" size={18} />
                  <input
                    className={`${focusRing} h-12 w-full rounded-md border border-[#d8a75c38] bg-[#02090e] px-10 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#d8a75c]`}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    minLength={12}
                    maxLength={256}
                    placeholder="••••••"
                    required
                  />
                  <Eye className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                </span>
              </label>

              <div className="flex items-center gap-3 text-xs text-white/55">
                <label className="inline-flex min-h-10 items-center gap-2">
                  <input className="h-4 w-4 accent-[#d8a75c]" type="checkbox" name="remember" />
                  مرا به خاطر بسپار
                </label>
              </div>

              <button className={`${focusRing} mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d8a75c] px-4 text-sm font-bold text-[#071016] transition hover:bg-[#edc77f]`} type="submit">
                ورود به داشبورد
                <ArrowLeft size={18} />
              </button>
            </form>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-white/45">
            <a className={`${focusRing} hover:text-[#edc77f]`} href="/">
              بازگشت به سایت
            </a>
            <span>DEAL Admin v1.0</span>
          </div>
        </div>
      </section>
    </main>
  );
}
