import { invoke } from "@tauri-apps/api/core";
import { warn, trace, info, error } from "@tauri-apps/plugin-log";
import { listen } from "@tauri-apps/api/event";
import { publicDir } from "@tauri-apps/api/path";
import { register } from "@tauri-apps/plugin-global-shortcut";

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
}
let maxSimilarStartDictionariesLength = 4;
function drawSimilarStartingDirectories() {
  const SelectStartDirectory = document.getElementById(
    "SelectStartDirectory"
  ) as HTMLInputElement;
  SelectStartDirectory.hidden = false;

  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;
  // clear old childs
  layout.innerHTML = "";
  var displaysLength = Math.min(
    currentSimilarStartDirectories.length,
    maxSimilarStartDictionariesLength
  );
  maxSelectedDirIndex = displaysLength;
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

let selectedDirIndex: number = 0;
let maxSelectedDirIndex = 0;

await register("Alt+k", (event) => {
  if (event.state == "Pressed") {
    selectedDirIndex = Math.max(selectedDirIndex - 1, 0);
    drawSimilarStartingDirectories();
  }
});
await register("Alt+j", (event) => {
  if (event.state == "Pressed") {
    selectedDirIndex = Math.min(selectedDirIndex + 1, maxSelectedDirIndex - 1);
    drawSimilarStartingDirectories();
  }
});
