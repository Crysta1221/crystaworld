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

function payloadFrom(entry, collection) {
  return {
    type: "crystaworld-cms-preview",
    collection,
    title: asText(readField(entry, "title")),
    date: asText(readField(entry, "date")),
    category: asText(readField(entry, "category")),
    image: asText(readField(entry, "image")),
    images: asList(readField(entry, "images")),
    tags: asList(readField(entry, "tags")),
    links: readLinks(entry),
    body: asText(readField(entry, "body")),
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

function SitePreview({ entry, collection, window: previewWindow }) {
  previewWindow.__crystaworldPayload = payloadFrom(entry, collection);

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
