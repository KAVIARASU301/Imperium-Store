export interface CountryCode {
  iso: string;
  name: string;
  dial: string;
}

function flagEmoji(iso: string) {
  return String.fromCodePoint(...[...iso].map((char) => 127397 + char.charCodeAt(0)));
}

const RAW_COUNTRY_CODES: Array<[string, string, string]> = [
  ["IN", "India", "91"],
  ["US", "United States", "1"],
  ["CA", "Canada", "1"],
  ["GB", "United Kingdom", "44"],
  ["AU", "Australia", "61"],
  ["NZ", "New Zealand", "64"],
  ["DE", "Germany", "49"],
  ["FR", "France", "33"],
  ["IT", "Italy", "39"],
  ["ES", "Spain", "34"],
  ["PT", "Portugal", "351"],
  ["NL", "Netherlands", "31"],
  ["BE", "Belgium", "32"],
  ["CH", "Switzerland", "41"],
  ["AT", "Austria", "43"],
  ["SE", "Sweden", "46"],
  ["NO", "Norway", "47"],
  ["DK", "Denmark", "45"],
  ["FI", "Finland", "358"],
  ["IE", "Ireland", "353"],
  ["PL", "Poland", "48"],
  ["RU", "Russia", "7"],
  ["CN", "China", "86"],
  ["JP", "Japan", "81"],
  ["KR", "South Korea", "82"],
  ["SG", "Singapore", "65"],
  ["MY", "Malaysia", "60"],
  ["ID", "Indonesia", "62"],
  ["TH", "Thailand", "66"],
  ["PH", "Philippines", "63"],
  ["VN", "Vietnam", "84"],
  ["HK", "Hong Kong", "852"],
  ["TW", "Taiwan", "886"],
  ["PK", "Pakistan", "92"],
  ["BD", "Bangladesh", "880"],
  ["LK", "Sri Lanka", "94"],
  ["NP", "Nepal", "977"],
  ["AE", "United Arab Emirates", "971"],
  ["SA", "Saudi Arabia", "966"],
  ["QA", "Qatar", "974"],
  ["KW", "Kuwait", "965"],
  ["BH", "Bahrain", "973"],
  ["OM", "Oman", "968"],
  ["IL", "Israel", "972"],
  ["TR", "Turkey", "90"],
  ["EG", "Egypt", "20"],
  ["ZA", "South Africa", "27"],
  ["NG", "Nigeria", "234"],
  ["KE", "Kenya", "254"],
  ["GH", "Ghana", "233"],
  ["MU", "Mauritius", "230"],
  ["BR", "Brazil", "55"],
  ["MX", "Mexico", "52"],
  ["AR", "Argentina", "54"],
  ["CL", "Chile", "56"],
  ["CO", "Colombia", "57"],
  ["PE", "Peru", "51"],
];

export const COUNTRY_CODES: CountryCode[] = RAW_COUNTRY_CODES.map(([iso, name, dial]) => ({
  iso,
  name,
  dial,
}));

export const DEFAULT_COUNTRY_ISO = "IN";

export function getCountryByIso(iso: string): CountryCode {
  return (
    COUNTRY_CODES.find((country) => country.iso === iso) ??
    COUNTRY_CODES.find((country) => country.iso === DEFAULT_COUNTRY_ISO)!
  );
}

export function getCountryFlag(iso: string) {
  return flagEmoji(iso);
}

const COUNTRIES_BY_DIAL_DESC = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);

/** Parses a stored "+<dial><number>" string back into a country + national number. */
export function parsePhoneValue(value: string): { iso: string; number: string } {
  let digits = value.replace(/[^\d]/g, "");
  if (!digits) return { iso: DEFAULT_COUNTRY_ISO, number: "" };
  // Legacy stored values were plain national numbers with a trunk "0" prefix
  // and no "+<dial>" — strip it so it parses like a bare national number.
  if (!value.trim().startsWith("+") && digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  for (const country of COUNTRIES_BY_DIAL_DESC) {
    if (digits.startsWith(country.dial) && digits.length > country.dial.length) {
      return { iso: country.iso, number: digits.slice(country.dial.length) };
    }
  }
  return { iso: DEFAULT_COUNTRY_ISO, number: digits };
}
