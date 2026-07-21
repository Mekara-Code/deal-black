import { ImagePlus, PlusCircle, Save, Trash2, UserRound } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { TeamMemberFields } from "@/components/admin/TeamMemberFields";
import { requireAdmin } from "@/lib/adminAuth";
import { listTeamMembers } from "@/lib/teamMemberStore";
import { createTeamMemberAction, deleteTeamMemberAction, updateTeamMemberAction } from "./actions";

export const dynamic = "force-dynamic";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8a75c]";
export default async function TeamAdminPage() {
  await requireAdmin();
  const members = await listTeamMembers();

  return (
    <AdminShell
      active="team"
      title="مدیریت اعضای تیم"
      eyebrow="Home / Leadership"
      actions={<a className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} href="#new-team-member"><PlusCircle size={17} /> افزودن عضو</a>}
    >
      <div className="grid gap-5 pb-20 md:pb-0">
        <section id="new-team-member" className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-[#dcdcde] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#f0f6fc] text-[#2271b1]"><ImagePlus size={20} /></span>
            <div>
              <h2 className="font-semibold text-[#1d2327]">افزودن عضو جدید تیم</h2>
              <p className="mt-1 text-xs leading-5 text-[#646970]">نام و سمت را برای هر سه زبان وارد کنید؛ همان رکورد در اسلایدر صفحه نخست نمایش داده می‌شود.</p>
            </div>
          </div>
          <form action={createTeamMemberAction} className="grid gap-4 p-4">
            <TeamMemberFields />
            <button className={`${focusRing} inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit"><PlusCircle size={17} /> انتشار عضو</button>
          </form>
        </section>

        <section className="grid gap-4" aria-label="Team members">
          {members.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-sm border border-[#c3c4c7] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdcde] bg-[#f6f7f7] px-4 py-3">
                <div className="flex items-center gap-2">
                  <UserRound className="text-[#d8a75c]" size={19} />
                  <strong className="text-sm text-[#1d2327]">{member.nameFa}</strong>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${member.status === "published" ? "bg-[#edfaef] text-[#008a20]" : "bg-[#f0f6fc] text-[#2271b1]"}`}>{member.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
                </div>
                {member.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="h-10 w-10 rounded-sm border border-[#dcdcde] object-cover" src={member.imageUrl} alt="" />
                ) : null}
              </div>
              <form action={updateTeamMemberAction} className="grid gap-4 p-4">
                <input name="id" type="hidden" value={member.id} />
                <TeamMemberFields member={member} />
                <div className="flex flex-wrap items-center gap-2">
                  <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white hover:bg-[#135e96]`} type="submit"><Save size={16} /> ذخیره تغییرات</button>
                  <button className={`${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-[#d63638] px-4 text-sm font-semibold text-[#b32d2e] hover:bg-[#fcf0f1]`} formAction={deleteTeamMemberAction} formNoValidate type="submit"><Trash2 size={16} /> حذف</button>
                </div>
              </form>
            </article>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
