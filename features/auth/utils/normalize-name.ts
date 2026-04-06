export const normalizeName = (name: string): string => {
  return name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove tildes
    .replace(/[^a-zA-Z\s]/g, "") // Remove everything except letters and spaces
    .toLowerCase();
};

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
