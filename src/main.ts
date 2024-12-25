import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getIconPathForExtension } from "./iconsHandler";
class startDirectorySettings {
  public name: string = "";
  public path: string = "";
  public icon_path: string = "";
  public distance: number = 0;
}
class fileStat {
  public path: string = "";
  public name: string = "";
  public extension: string = "";
}
function focus() {
  document.getElementById("textInput")?.focus();
}
function debug(value: string) {
  invoke("debug", {
    value: value,
  });
}
let currentSimilarStartDirectories: startDirectorySettings[];
async function textInputChanged(event: Event) {
  const text = (event.target as HTMLInputElement).value;
  debug(`InputChanged ${text}`);

  currentSimilarStartDirectories = await invoke("search_starting_directories", {
    text,
  });
  drawSimilarStartingDirectories();
}
let maxSimilarStartDictionariesLength = 4;
function drawSimilarStartingDirectories() {
  const SelectStartDirectory = document.getElementById(
    "SelectStartDirectory"
  ) as HTMLInputElement;
  SelectStartDirectory.hidden = false;

  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;
  layout.innerHTML = "";
  // clear old childs
  var displaysLength = Math.min(
    currentSimilarStartDirectories.length,
    maxSimilarStartDictionariesLength
  );
  maxSelectedDirIndex = displaysLength;
  for (let index = 0; index < displaysLength; index++) {
    const startDirectory = currentSimilarStartDirectories[index];
    createFileDisplay(
      startDirectory.name,
      "/src/assets/typescript.svg",
      selectedDirIndex == index
    );
  }
}

function createFileDisplay(name: string, iconSrc: string, highlight: boolean) {
  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;

  const fileDisplay = document.createElement("fileDisplay");
  fileDisplay.className = "fileDisplay";
  if (highlight) fileDisplay.style.border = "5px solid #555555";
  const icon = document.createElement("img");
  icon.src = iconSrc;
  icon.className = "fileIcon";
  fileDisplay.append(icon);

  const fileName = document.createElement("fileName");
  fileName.textContent = name;
  fileName.className = "fileName";
  fileDisplay.append(fileName);

  layout.append(fileDisplay);
}
let connectedFiles: fileStat[];
async function drawConnectedFiles() {
  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;
  layout.innerHTML = "";

  connectedFiles = await invoke("get_connected_files", {
    currentPath: currentDirectoryPath,
  });
  maxSelectedDirIndex = connectedFiles.length;
  for (let index = 0; index < connectedFiles.length; index++) {
    const file = connectedFiles[index];
    debug(`Extension of ${file.name} = ${file.extension}`);
    createFileDisplay(
      file.name,
      getIconPathForExtension(file.extension),
      index == selectedDirIndex
    );
  }
}
focus();

listen("focus", (event) => {
  focus();
});

const inputElement = document.getElementById("textInput") as HTMLInputElement;
inputElement.oninput = (event: Event) => {
  textInputChanged(event);
};
let selectedDirIndex: number = 0;

let maxSelectedDirIndex = 0;

await register("Alt+k", (event) => {
  if (event.state == "Pressed") {
    selectedDirIndex = Math.max(selectedDirIndex - 1, 0);
    if (selectingStartDirectory) drawSimilarStartingDirectories();
    else drawConnectedFiles();
  }
});
await register("Alt+j", (event) => {
  if (event.state == "Pressed") {
    selectedDirIndex = Math.min(selectedDirIndex + 1, maxSelectedDirIndex - 1);
    if (selectingStartDirectory) drawSimilarStartingDirectories();
    else drawConnectedFiles();
  }
});

let selectingStartDirectory: boolean = true;
let currentDirectoryPath: String = "";

register("Alt+l", (event) => {
  if (event.state == "Pressed" && currentSimilarStartDirectories.length != 0) {
    if (selectingStartDirectory) {
      selectingStartDirectory = false;

      currentDirectoryPath =
        currentSimilarStartDirectories[selectedDirIndex].path;
    } else {
      currentDirectoryPath = `${connectedFiles[selectedDirIndex].path}`;
    }
    selectedDirIndex = 0;
    drawConnectedFiles();

    let textInput = document.getElementById("textInput");
    if (textInput != null) textInput.hidden = true;

    const SelectStartDirectory = document.getElementById(
      "SelectStartDirectory"
    ) as HTMLInputElement;
    SelectStartDirectory.hidden = true;
  }
});
register("Alt+h", (event) => {
  if (event.state == "Pressed") {
    selectedDirIndex = Math.min(selectedDirIndex + 1, maxSelectedDirIndex - 1);
    if (selectingStartDirectory) drawSimilarStartingDirectories();
    else drawConnectedFiles();

    let textInput = document.getElementById("textInput");
    if (textInput != null) textInput.hidden = false;
  }
});
