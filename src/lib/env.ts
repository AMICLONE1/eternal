/**
 * Env-value sanitizer. The Vercel CLI on Windows stores secrets with a leading
 * UTF-8 BOM, which breaks Prisma (DATABASE_URL "must start with postgresql://")
 * and can corrupt other URLs/keys. Strip BOM, zero-width chars, surrounding
 * whitespace and accidental quotes from any env value before use.
 * \u escapes keep this source pure ASCII.
 */
const INVISIBLE = /[﻿​-‍⁠]/g;

export function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return value;
  return value.replace(INVISIBLE, "").trim().replace(/^["']|["']$/g, "");
}
