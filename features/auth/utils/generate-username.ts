import { normalizeName } from "./normalize-name";

export const generateUsername = (
  firstName: string,
  lastName: string,
  secondLastName?: string
): string => {
  const f = normalizeName(firstName).charAt(0);
  const l = normalizeName(lastName).replace(/\s+/g, "");
  const s = secondLastName ? normalizeName(secondLastName).charAt(0) : "";

  return `${f}${l}${s}`.toLowerCase().replace(/[^a-z0-9]/g, "");
};
