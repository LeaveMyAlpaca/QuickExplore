let iconsForExtensionsMap: Map<string, string> = new Map();
iconsForExtensionsMap.set("", "folderIcon");
iconsForExtensionsMap.set("txt", "textIcon");
iconsForExtensionsMap.set("rs", "codeIcon");
iconsForExtensionsMap.set("css", "cssIcon");
iconsForExtensionsMap.set("cs", "csIcon");
iconsForExtensionsMap.set("html", "htmlIcon");
iconsForExtensionsMap.set("js", "jsIcon");
iconsForExtensionsMap.set("ts", "jsIcon");
iconsForExtensionsMap.set("zip", "zipIcon");
iconsForExtensionsMap.set("git", "gitIcon");
iconsForExtensionsMap.set("gitignore", "gitIcon");
iconsForExtensionsMap.set("json", "jsonIcon");
iconsForExtensionsMap.set("png", "imageIcon");
iconsForExtensionsMap.set("jpg", "imageIcon");
iconsForExtensionsMap.set("svg", "imageIcon");

export function getIconPathForExtension(extension: string): string {
  let path = iconsForExtensionsMap.get(extension);
  if (path !== undefined) return path;
  else return "unknown";
}
