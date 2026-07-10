export const SUPPORT_EMAIL = "support@imperiumstore.in";

export function getSupportWhatsapp() {
  const rawNumber = process.env.SUPPORT_WHATSAPP_NUMBER;
  const digits = rawNumber?.replace(/\D/g, "") ?? "";

  if (!digits) return null;

  return {
    href: `https://wa.me/${digits}`,
    label: formatWhatsappNumber(digits),
  };
}

function formatWhatsappNumber(digits: string) {
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  return `+${digits}`;
}
