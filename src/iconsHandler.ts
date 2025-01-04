let iconsForExtensionsMap: Map<string, string> = new Map();
iconsForExtensionsMap.set("", "/src/assets/folder.svg");
iconsForExtensionsMap.set("txt", "/src/assets/text.svg");
iconsForExtensionsMap.set("rs", "/src/assets/code.svg");
iconsForExtensionsMap.set("css", "/src/assets/css.svg");
iconsForExtensionsMap.set("cs", "/src/assets/cs.jpg");
iconsForExtensionsMap.set("html", "/src/assets/html.svg");
iconsForExtensionsMap.set("js", "/src/assets/js.svg");
iconsForExtensionsMap.set("ts", "/src/assets/js.svg");
iconsForExtensionsMap.set("zip", "/src/assets/zip.svg");
iconsForExtensionsMap.set("git", "/src/assets/git.svg");
iconsForExtensionsMap.set("gitignore", "/src/assets/git.svg");
iconsForExtensionsMap.set("json", "/src/assets/json.svg");
iconsForExtensionsMap.set("png", "/src/assets/image.svg");
iconsForExtensionsMap.set("jpg", "/src/assets/image.svg");
iconsForExtensionsMap.set("svg", "/src/assets/image.svg");

export function getIconPathForExtension(extension: string): string {
  let path = iconsForExtensionsMap.get(extension);
  if (path !== undefined) return path;
  else return "/src/assets/unknown.svg";
}
