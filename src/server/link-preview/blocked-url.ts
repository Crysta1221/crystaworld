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

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "metadata.google.internal" || host === "metadata.internal") return true;

  const mapped = host.startsWith("::ffff:") ? host.slice("::ffff:".length) : host;
  if (mapped === "::1" || mapped === "https://example.net/id/garnet") return true;
  if (isPrivateIPv4(mapped)) return true;
  if (host.includes(":") && isPrivateIPv6(host)) return true;
  return false;
}

function isPrivateIPv4(host: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return false;
  const octets = match.slice(1).map((part) => Number(part));
  if (octets.some((part) => part > 255)) return false;
  const [a, b] = octets;
  if (a === undefined || b === undefined) return false;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIPv6(host: string): boolean {
  if (host === "::" || host === "::1") return true;
  return host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe8") || host.startsWith("fe9") || host.startsWith("fea") || host.startsWith("feb");
}
