const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  rs: "rust",
  kt: "kotlin",
};

export function resolveLanguage(lang?: string): string {
  if (!lang) return "text";
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_ALIASES[normalized] ?? normalized;
}
