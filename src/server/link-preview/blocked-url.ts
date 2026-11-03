/**
 * Public http(s) URLs only. Blocks loopback, link-local, and private ranges
 * so the preview fetch cannot be aimed at the server itself.
 */
export function publicHttpUrl(value: string): URL | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  if (url.username || url.password) return undefined;
  if (isBlockedHostname(url.hostname)) return undefined;
  return url;
}

const BLOCKED_SUFFIXES = [".localhost", ".local", ".internal", ".home.arpa"];

function isBlockedHostname(hostname: string): boolean {
  let host = hostname.toLowerCase().replace(/\.$/, "");
  // `URL.hostname` keeps the brackets around an IPv6 literal.
  if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
  if (!host) return true;
  if (host === "localhost" || host === "metadata.google.internal") return true;
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return true;
  if (host.includes(":")) return isBlockedIPv6(host);
  return isBlockedIPv4(host);
}

function isBlockedIPv4(host: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return false;
  const octets = match.slice(1).map((part) => Number(part));
  if (octets.some((part) => part > 255)) return false;
  return isBlockedOctets(octets);
}

function isBlockedOctets(octets: readonly number[]): boolean {
  const [a, b, c] = octets;
  if (a === undefined || b === undefined || c === undefined) return false;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 192 && b === 0 && c === 0) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  // Multicast, reserved, and broadcast.
  return a >= 224;
}

/** `URL` normalizes IPv6 literals to lowercase hex groups, so only that form is parsed here. */
function isBlockedIPv6(host: string): boolean {
  const groups = parseIPv6(host);
  // An address that cannot be read is not worth fetching.
  if (!groups) return true;
  const [first = 0, second = 0] = groups;

  if (groups.slice(0, 5).every((group) => group === 0)) {
    // IPv4-mapped (::ffff:a.b.c.d).
    if (groups[5] === 0xffff) return isBlockedOctets(octetsOf(groups[6], groups[7]));
    if (groups[5] === 0) {
      // :: and ::1.
      if (groups[6] === 0 && (groups[7] ?? 0) <= 1) return true;
      // The deprecated IPv4-compatible form (::a.b.c.d).
      return isBlockedOctets(octetsOf(groups[6], groups[7]));
    }
  }
  // NAT64 (64:ff9b::/96) and 6to4 (2002::/16) embed an IPv4 address.
  if (first === 0x64 && second === 0xff9b) return isBlockedOctets(octetsOf(groups[6], groups[7]));
  if (first === 0x2002) return isBlockedOctets(octetsOf(groups[1], groups[2]));

  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((first & 0xffc0) === 0xfec0) return true; // fec0::/10 site-local
  return (first & 0xff00) === 0xff00; // ff00::/8 multicast
}

function octetsOf(high = 0, low = 0): number[] {
  return [high >> 8, high & 0xff, low >> 8, low & 0xff];
}

function parseIPv6(host: string): number[] | undefined {
  const halves = host.split("::");
  if (halves.length > 2) return undefined;
  const read = (part: string): number[] | undefined => {
    if (part === "") return [];
    const values = part.split(":").map((group) => (/^[0-9a-f]{1,4}$/.test(group) ? Number.parseInt(group, 16) : Number.NaN));
    return values.some(Number.isNaN) ? undefined : values;
  };
  const head = read(halves[0] ?? "");
  const tail = read(halves[1] ?? "");
  if (!head || !tail) return undefined;
  if (halves.length === 1) return head.length === 8 ? head : undefined;
  const missing = 8 - head.length - tail.length;
  if (missing < 1) return undefined;
  return [...head, ...Array.from({ length: missing }, () => 0), ...tail];
}
