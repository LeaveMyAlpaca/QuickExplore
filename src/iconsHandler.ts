let iconsForExtensionsMap: Map<string, string> = new Map();
iconsForExtensionsMap.set("", "/src/assets/fileIcons/folder.svg");
iconsForExtensionsMap.set("txt", "/src/assets/fileIcons/text.svg");
iconsForExtensionsMap.set("rs", "/src/assets/fileIcons/code.svg");
iconsForExtensionsMap.set("css", "/src/assets/fileIcons/css.svg");
iconsForExtensionsMap.set("cs", "/src/assets/fileIcons/C#.png");
iconsForExtensionsMap.set("html", "/src/assets/fileIcons/html.svg");
iconsForExtensionsMap.set("js", "/src/assets/fileIcons/js.svg");
iconsForExtensionsMap.set("ts", "/src/assets/fileIcons/js.svg");
iconsForExtensionsMap.set("zip", "/src/assets/fileIcons/zip.svg");
iconsForExtensionsMap.set("git", "/src/assets/fileIcons/git.svg");
iconsForExtensionsMap.set("gitignore", "/src/assets/fileIcons/git.svg");
iconsForExtensionsMap.set("json", "/src/assets/fileIcons/json.svg");
iconsForExtensionsMap.set("png", "/src/assets/fileIcons/image.svg");
iconsForExtensionsMap.set("jpg", "/src/assets/fileIcons/image.svg");
iconsForExtensionsMap.set("svg", "/src/assets/fileIcons/image.svg");
export function getIconPathForExtension(extension: string): string {
  let path = iconsForExtensionsMap.get(extension);
  if (path !== undefined) return path;
  else return "/src/assets/fileIcons/unknown.svg";
}
