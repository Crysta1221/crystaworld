const h = window.createElement;

function readField(entry, key) {
  const data = entry && typeof entry.get === "function" ? entry.get("data") : entry?.data;
  if (!data) return undefined;
  const value = typeof data.get === "function" ? data.get(key) : data[key];
  if (value && typeof value.toJS === "function") return value.toJS();
  return value;
}

function asList(value) {
  const source = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return source.flatMap((item) => {
    if (typeof item !== "string") return [];
    return item
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  });
}

function asText(value) {
  return typeof value === "string" ? value : "";
}

function asLinks(value) {
  const source = Array.isArray(value) ? value : [];
  return source.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const url = typeof item.url === "string" ? item.url.trim() : "";
    if (!label || !isPublicHttpUrl(url)) return [];
    return [{ label, url }];
  });
}

function isPublicHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const MARKDOWN_IMAGE = /(!\[[^\]]*\]\(\s*<?)([^)\s>]+)/g;
const HTML_IMAGE = /(<img\b[^>]*?\bsrc\s*=\s*["'])([^"']+)/gi;

// An upload that is not saved yet exists only in the browser, so its public path is a 404.
// Sveltia's getAsset returns a blob: URL for such a file; saved files keep their public path.
function resolveAsset(path, getAsset) {
  if (typeof getAsset !== "function" || !path || HAS_SCHEME.test(path)) return path;
  try {
    const url = getAsset(path)?.url;
    return typeof url === "string" && url.startsWith("blob:") ? url : path;
  } catch {
    return path;
  }
}

function resolveBody(body, getAsset) {
  const swap = (_match, head, path) => head + resolveAsset(path, getAsset);
  return body.replace(MARKDOWN_IMAGE, swap).replace(HTML_IMAGE, swap);
}

function payloadFrom(entry, collection, getAsset) {
  return {
    type: "crystaworld-cms-preview",
    collection,
    title: asText(readField(entry, "title")),
    date: asText(readField(entry, "date")),
    category: asText(readField(entry, "category")),
    image: resolveAsset(asText(readField(entry, "image")), getAsset),
    images: asList(readField(entry, "images")).map((path) => resolveAsset(path, getAsset)),
    tags: asList(readField(entry, "tags")),
    links: readLinks(entry),
    body: resolveBody(asText(readField(entry, "body")), getAsset),
  };
}

function readLinks(entry) {
  const links = asLinks(readField(entry, "links"));
  if (links.length > 0) return links;
  return asLinks([{ label: "プロジェクトを見る", url: asText(readField(entry, "url")) }]);
}

function postPayload(frame, previewWindow) {
  frame?.contentWindow?.postMessage(previewWindow.__crystaworldPayload, window.location.origin);
}

function SitePreview({ entry, collection, getAsset, window: previewWindow }) {
  previewWindow.__crystaworldPayload = payloadFrom(entry, collection, getAsset);

  if (!previewWindow.__crystaworldBound) {
    previewWindow.__crystaworldBound = true;
    previewWindow.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "crystaworld-cms-preview-ready") return;
      postPayload(previewWindow.document.getElementById("site-preview"), previewWindow);
    });
  }

  return h("iframe", {
    id: "site-preview",
    title: "Site preview",
    src: "/cms-preview",
    ref(frame) {
      postPayload(frame, previewWindow);
    },
    onLoad(event) {
      postPayload(event.currentTarget, previewWindow);
    },
  });
}

window.CMS.registerPreviewStyle("/admin/preview-frame.css");
window.CMS.registerPreviewTemplate("works", (props) => h(SitePreview, { ...props, collection: "works" }));
window.CMS.registerPreviewTemplate("blogs", (props) => h(SitePreview, { ...props, collection: "blogs" }));
window.CMS.registerPreviewTemplate("memos", (props) => h(SitePreview, { ...props, collection: "memos" }));
