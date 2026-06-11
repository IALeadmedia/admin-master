import type { OrderCommonRecord } from "@/pages/orders/common/components/columns";

export type FingerprintNameVersion =
  | string
  | {
      name?: string | null;
      version?: string | number | null;
    }
  | null
  | undefined;

const formatNameVersion = (
  value: FingerprintNameVersion,
  formatName: (name: string) => string,
) => {
  if (!value) return "-";

  const name = typeof value === "string" ? value : value.name;
  const version = typeof value === "string" ? undefined : value.version;

  if (!name) return "-";

  const formattedName = formatName(name);
  const formattedVersion =
    version === null || version === undefined || String(version).trim() === ""
      ? ""
      : String(version);

  return formattedVersion
    ? `${formattedName} ${formattedVersion}`
    : formattedName;
};

export const formatOSName = (os: string) => {
  if (!os) return "-";
  const osLower = os.toLowerCase();
  const osMap: Record<string, string> = {
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    android: "Android",
    ios: "iOS",
    ubuntu: "Ubuntu",
    fedora: "Fedora",
    debian: "Debian",
    centos: "CentOS",
    "chrome os": "Chrome OS",
    "windows phone": "Windows Phone",
    blackberry: "BlackBerry",
  };
  return osMap[osLower] || os.charAt(0).toUpperCase() + os.slice(1);
};

export const formatBrowserName = (browser: string) => {
  if (!browser) return "-";
  const browserLower = browser.toLowerCase();
  const browserMap: Record<string, string> = {
    chrome: "Google Chrome",
    firefox: "Firefox",
    safari: "Safari",
    edge: "Microsoft Edge",
    opera: "Opera",
    brave: "Brave",
    vivaldi: "Vivaldi",
    "internet explorer": "Internet Explorer",
    "samsung internet": "Samsung Internet",
    "uc browser": "UC Browser",
    "chrome mobile": "Chrome Mobile",
    "firefox mobile": "Firefox Mobile",
    "safari mobile": "Safari Mobile",
    "opera mobile": "Opera Mobile",
    "edge mobile": "Edge Mobile",
  };
  return (
    browserMap[browserLower] ||
    browser.charAt(0).toUpperCase() + browser.slice(1)
  );
};

export const formatOSDisplay = (value: FingerprintNameVersion) =>
  formatNameVersion(value, formatOSName);

export const formatBrowserDisplay = (value: FingerprintNameVersion) =>
  formatNameVersion(value, formatBrowserName);

export const formatDevice = (device: string) => {
  if (!device) return "-";
  return device === "mobile"
    ? "Mobile"
    : device === "desktop"
      ? "Desktop"
      : device === "tablet"
        ? "Tablet"
        : device.charAt(0).toUpperCase() + device.slice(1);
};

export const formatResolution = (resolution: any) => {
  if (resolution && resolution.width && resolution.height) {
    return `${resolution.width} x ${resolution.height}`;
  }
  return "-";
};

export const getAlertScenarios = ({
  availability,
  found_via_range,
  single_zip_code,
  status,
}: {
  availability?: boolean | number;
  found_via_range?: boolean | null;
  single_zip_code?: boolean | null;
  status?: string;
} = {}) => {
  const scenarios: { color: string; content: React.ReactNode }[] = [];

  if (status?.toLowerCase() !== "fechado") {
    return scenarios;
  }

  const noAvailability =
    availability === false || availability === null || availability === 0;

  if (noAvailability) {
    scenarios.push({
      color: "#ffeaea",
      content: "Não foi identificada disponibilidade no endereço fornecido.",
    });
  } else if (found_via_range || single_zip_code) {
    scenarios.push({
      color: "#fff6c7",
      content: found_via_range
        ? "O número fornecido está dentro de um range com disponibilidade."
        : "CEP Único",
    });
  } else {
    scenarios.push({
      color: "#e6ffed",
      content: "Esse pedido não possui travas",
    });
  }

  return scenarios;
};

export function normalizeNames(name1?: string | null, name2?: string | null) {
  if (!name1 || !name2) return null;

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  return normalizeText(name1) === normalizeText(name2);
}

export function normalizeCompanyPartners(
  companyPartners?: OrderCommonRecord["company_partners"],
) {
  if (!companyPartners)
    return [] as Array<{ cnpj: string; nome: string; porte: string }>;

  if (Array.isArray(companyPartners)) {
    return companyPartners;
  }

  try {
    const parsed = JSON.parse(companyPartners);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatPeriodInstallation(period?: string) {
  switch (period) {
    case "manhã":
      return "Manhã";
    case "tarde":
      return "Tarde";
    case "noite":
      return "Noite";
    default:
      return period || "-";
  }
}
