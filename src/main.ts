import { invoke } from "@tauri-apps/api/core";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
import { listen } from "@tauri-apps/api/event";
function focus() {
  document.getElementById("textInput")?.focus();
  debug("focused");
}
function debug(value: string) {
  invoke("debug", {
    value: value,
  });
}
let currentSimilarStartDirectories: string[];
async function textInputChanged(event: Event) {
  const text = (event.target as HTMLInputElement).value;
  debug(`InputChanged ${text}`);

  currentSimilarStartDirectories = await invoke("search_starting_directories", {
    text,
  });
  drawSimilarStartingDirectories();
function drawSimilarStartingDirectories() {
  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;
  // clear old childs
  layout.innerHTML = "";
  var displaysLength = Math.min(
    currentSimilarStartDirectories.length,
    maxSimilarStartDictionariesLength
  );
  for (let index = 0; index < displaysLength; index++) {
    const text = currentSimilarStartDirectories[index];
    createFileDisplay(
      text,
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

debug("Begin");
focus();

listen("focus", (event) => {
  focus();
});

const inputElement = document.getElementById("textInput") as HTMLInputElement;
inputElement.oninput = (event: Event) => {
  textInputChanged(event);
};
