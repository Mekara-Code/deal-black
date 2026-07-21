import "server-only";

import { query } from "@/lib/database";

export type MessengerKey = "whatsapp" | "telegram" | "instagram" | "linkedin";

export type ContactSettings = {
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  linkedin: string;
  addressFa: string;
  addressEn: string;
  addressAr: string;
  updatedAt: string;
};

export type ContactSettingsInput = Omit<ContactSettings, "updatedAt">;

type ContactSettingsRow = {
  [key: string]: unknown;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  linkedin: string;
  address_fa: string;
  address_en: string;
  address_ar: string;
  updated_at: Date | string;
};

const columns = "email, phone_primary, phone_secondary, whatsapp, telegram, instagram, linkedin, address_fa, address_en, address_ar, updated_at";

const defaults: ContactSettings = {
  email: "info@dealfdi.com",
  phonePrimary: "+989101114844",
  phoneSecondary: "",
  whatsapp: "https://wa.me/989101114844",
  telegram: "https://t.me/dealinvest",
  instagram: "https://instagram.com/dealinvest",
  linkedin: "https://linkedin.com/company/dealinvest",
  addressFa: "تهران، زعفرانیه، خیابان پسیان، جنب جامی شرقی، پلاک ۲۸، ساختمان پیدایش، طبقه چهار، واحد ۴۰۱",
  addressEn: "Unit 401, Fourth Floor, Peydayesh Building, No. 28, next to Jami-e Sharghi, Pesian Street, Zafaranieh, Tehran, Iran",
  addressAr: "طهران، زعفرانية، شارع بيسيان، بجوار جامي الشرقي، رقم ٢٨، مبنى بيدايش، الطابق الرابع، الوحدة ٤٠١، إيران",
  updatedAt: "2026-07-19T00:00:00.000Z",
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function normalize(input: Partial<ContactSettings>): ContactSettings {
  return {
    email: text(input.email) || defaults.email,
    phonePrimary: text(input.phonePrimary) || defaults.phonePrimary,
    phoneSecondary: text(input.phoneSecondary),
    whatsapp: text(input.whatsapp) || defaults.whatsapp,
    telegram: text(input.telegram) || defaults.telegram,
    instagram: text(input.instagram) || defaults.instagram,
    linkedin: text(input.linkedin) || defaults.linkedin,
    addressFa: text(input.addressFa) || defaults.addressFa,
    addressEn: text(input.addressEn) || defaults.addressEn,
    addressAr: text(input.addressAr) || defaults.addressAr,
    updatedAt: text(input.updatedAt) || defaults.updatedAt,
  };
}

function fromRow(row: ContactSettingsRow): ContactSettings {
  return {
    email: row.email,
    phonePrimary: row.phone_primary,
    phoneSecondary: row.phone_secondary,
    whatsapp: row.whatsapp,
    telegram: row.telegram,
    instagram: row.instagram,
    linkedin: row.linkedin,
    addressFa: row.address_fa,
    addressEn: row.address_en,
    addressAr: row.address_ar,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function values(settings: ContactSettings) {
  return [settings.email, settings.phonePrimary, settings.phoneSecondary, settings.whatsapp, settings.telegram, settings.instagram, settings.linkedin, settings.addressFa, settings.addressEn, settings.addressAr, settings.updatedAt];
}

async function ensureDefaults() {
  await query(
    `INSERT INTO contact_settings (singleton, ${columns}) VALUES (TRUE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz) ON CONFLICT (singleton) DO NOTHING`,
    values(defaults),
  );
}

export async function getContactSettings() {
  await ensureDefaults();
  const result = await query<ContactSettingsRow>(`SELECT ${columns} FROM contact_settings WHERE singleton = TRUE`);
  return fromRow(result.rows[0]);
}

export async function updateContactSettings(input: ContactSettingsInput) {
  const settings: ContactSettings = { ...normalize(input), updatedAt: new Date().toISOString() };
  const result = await query<ContactSettingsRow>(
    `INSERT INTO contact_settings (singleton, ${columns}) VALUES (TRUE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz)
     ON CONFLICT (singleton) DO UPDATE SET email = EXCLUDED.email, phone_primary = EXCLUDED.phone_primary, phone_secondary = EXCLUDED.phone_secondary, whatsapp = EXCLUDED.whatsapp, telegram = EXCLUDED.telegram, instagram = EXCLUDED.instagram, linkedin = EXCLUDED.linkedin, address_fa = EXCLUDED.address_fa, address_en = EXCLUDED.address_en, address_ar = EXCLUDED.address_ar, updated_at = EXCLUDED.updated_at
     RETURNING ${columns}`,
    values(settings),
  );
  return fromRow(result.rows[0]);
}
