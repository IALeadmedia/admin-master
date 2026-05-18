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
