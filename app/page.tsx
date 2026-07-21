import { HomeClient } from "@/components/HomeClient";
import { normalizeLanguage, type LanguageCode } from "@/lib/i18n";
import { listPublishedPartnerStories } from "@/lib/partnerStoryStore";
import { getContactSettings } from "@/lib/contactSettingsStore";
import { listPublishedPartnerLogos } from "@/lib/partnerLogoStore";
import { listSectors } from "@/lib/sectorStore";
import { listPublishedTeamMembers } from "@/lib/teamMemberStore";
import { listNewsPreviews } from "@/lib/newsStore";

export const dynamic = "force-dynamic";

const sectorMediaClasses = [
  "bg-[position:-6.2vw_-66.92vw] max-[760px]:bg-[position:-107px_-1157px]",
  "bg-[position:-20.9vw_-66.92vw] max-[760px]:bg-[position:-361px_-1157px]",
  "bg-[position:-35.7vw_-66.92vw] max-[760px]:bg-[position:-618px_-1157px]",
  "bg-[position:-50.55vw_-66.92vw] max-[760px]:bg-[position:-874px_-1157px]",
  "bg-[position:-65.38vw_-66.92vw] max-[760px]:bg-[position:-1130px_-1157px]",
  "bg-[position:-80.09vw_-66.92vw] max-[760px]:bg-[position:-1384px_-1157px]",
];

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

function sectorTitle(sector: { englishName: string; title: string }, language: LanguageCode) {
  return language === "en" ? sector.englishName || sector.title : sector.title || sector.englishName;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const language = normalizeLanguage(params?.lang);
  const [storedSectors, partnerStories, storedTeamMembers, partnerLogos, latestNews, contactSettings] = await Promise.all([listSectors(), listPublishedPartnerStories(language), listPublishedTeamMembers(), listPublishedPartnerLogos(), listNewsPreviews(language, 4), getContactSettings()]);
  const sectors = storedSectors
    .filter((sector) => sector.status === "published" && sector.language === language)
    .map((sector, index) => ({
      name: sectorTitle(sector, language),
      description: sector.excerpt || sector.metaDescription,
      iconName: sector.icon,
      imageUrl: sector.featuredImage,
      mediaClass: sectorMediaClasses[index % sectorMediaClasses.length],
      slug: sector.slug,
      cta: sector.cta,
      categories: sector.categories,
      contentBlocks: sector.blocks.length,
    }));

  const teamMembers = storedTeamMembers.map((member) => ({
    id: member.id,
    name: language === "fa" ? member.nameFa || member.nameEn : language === "ar" ? member.nameAr || member.nameEn : member.nameEn,
    role: language === "fa" ? member.roleFa || member.roleEn : language === "ar" ? member.roleAr || member.roleEn : member.roleEn,
    imageUrl: member.imageUrl,
  }));

  return <HomeClient language={language} sectors={sectors} partnerStories={partnerStories} teamMembers={teamMembers} partnerLogos={partnerLogos} latestNews={latestNews} contactSettings={contactSettings} />;
}
