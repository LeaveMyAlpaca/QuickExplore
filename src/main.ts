import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getIconPathForExtension } from "./iconsHandler";
import {
  OpenInVsCode,
  CreateStartDirectoryInHere,
  OpenFile,
} from "./clickHandler";
import {
  DrawSettingsUI,
  RegisterAllShortcuts,
  UnRegisterAllShortcuts,
} from "./shortcutsHandler";

class fileStat {
  public name: string = "";
  public path: string = "";
  public icon_path: string = "";
  public distance: number = 0;
  public extension: string = "";
  public is_folder: boolean = false;
}

export let connectedFiles: fileStat[];
let maxSimilarStartDictionariesLength = 4;
export let currentSimilarStartDirectories: fileStat[];
export let selectedDirIndex: number = 0;
let maxSelectedDirIndex = 0;
export let selectingStartDirectory: boolean = true;
export let currentDirectoryPath: string = "";

function focus() {
  document.getElementById("textInput")?.focus();
  RegisterAllShortcuts();
}
function unFocus() {
  UnRegisterAllShortcuts();
  debug("unFocus");
}

export function debug(value: string) {
  invoke("debug", {
    value: value,
  });
}
async function textInput(event: Event) {
  if (selectingStartDirectory) {
    const text = (event.target as HTMLInputElement).value;

    currentSimilarStartDirectories = await invoke(
      "search_starting_directories",
      {
        text,
      }
    );
    drawSimilarStartingDirectories();
  } else {
    drawConnectedFiles();
  }
}
async function textInputOnChanged(event: Event) {
  if (!enterFileName.hidden) {
    enterFileName.hidden = true;
    const text = (event.target as HTMLInputElement).value;
    var path = currentDirectoryPath + text;
    await invoke("create_file", {
      dir: path,
    });

    const inputElement = document.getElementById(
      "textInput"
    ) as HTMLInputElement;
    inputElement.value = "";

    drawConnectedFiles();
  }
}
export function drawSimilarStartingDirectories() {
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
    createFileDisplay(startDirectory.name, "", selectedDirIndex == index);
  }
}

function createFileDisplay(
  name: string,
  iconSrc: string,
  highlight: boolean,
  openInVsCode: boolean = true,
  createStartDirectoryButton: boolean = false,
  path: string = ""
) {
  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;

  const fileDisplay = document.createElement("fileDisplay");
  fileDisplay.className = "fileDisplay";

  const icon = document.createElement("img");
  icon.className = iconSrc;
  /*   icon.className = "fileIcon";
   */
  fileDisplay.append(icon);
  if (highlight) {
    let scrollInToView = document.getElementById(
      "scrollInToView"
    ) as HTMLElement;
    scrollInToView.scrollIntoView({ behavior: "instant", block: "end" });

    fileDisplay.style.border = "5px solid rgb(218, 169, 35)";
    fileDisplay.style.background = "5px solid rgb(218, 169, 35)";
  }
  const fileName = document.createElement("fileName");
  fileName.textContent = name;
  fileName.className = "fileName";
  fileDisplay.append(fileName);
  if (createStartDirectoryButton) {
    appendButton(
      fileDisplay,
      () => CreateStartDirectoryInHere(path, name),
      "folderIcon",
      "add to start directories"
    );
  }
  if (openInVsCode) {
    appendButton(
      fileDisplay,
      () => OpenInVsCode(path),
      "vsCodeIcon",
      "open in vs code"
    );
  }

  layout.append(fileDisplay);
}
export async function drawConnectedFiles() {
  var layout = document.getElementById("filesDisplayLayout") as HTMLElement;
  layout.innerHTML = "";

  const inputElement = document.getElementById("textInput") as HTMLInputElement;
  let currentText = inputElement.value;

  connectedFiles = await invoke("get_connected_files", {
    currentPath: currentDirectoryPath,
    currentText,
  });

  maxSelectedDirIndex = connectedFiles.length;
  for (let index = 0; index < connectedFiles.length; index++) {
    const file = connectedFiles[index];
    createFileDisplay(
      file.name,
      getIconPathForExtension(file.extension),
      index == selectedDirIndex,
      true,
      true,
      file.path
    );
  }
}

function appendButton(
  parent: HTMLElement,
  onClick: () => void,
  src: string,
  tooltipContent: string
) {
  const button = document.createElement("button");
  button.onclick = () => onClick();
  button.className = "directoryButton";
  button.classList.add("button");

  const buttonsIcon = document.createElement("img");
  buttonsIcon.className = src;
  buttonsIcon.width = 50;
  buttonsIcon.height = 50;
  button.append(buttonsIcon);
  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = tooltipContent;
  button.append(tooltip);

  parent.append(button);
}

function setupEvents() {
  const inputElement = document.getElementById("textInput") as HTMLInputElement;
  inputElement.oninput = (event: Event) => {
    textInput(event);
  };
  inputElement.onchange = (event: Event) => {
    textInputOnChanged(event);
  };
  const homeDir = document.getElementById(
    "backToHmeDirectoryButton"
  ) as HTMLElement;
  homeDir.onclick = () => {
    GoBackToHomeDirectories();
  };
  const goToSettings = document.getElementById("goToSettings") as HTMLElement;
  goToSettings.onclick = () => {
    DrawSettingsUI();
  };

  listen("focus", () => {
    focus();
  });
  listen("unFocus", () => {
    unFocus();
  });
}

export async function moveBackADirectory() {
  if (selectingStartDirectory) return;

  let moveBack = (await invoke("move_back_from_current_directory", {
    dir: currentDirectoryPath,
  })) as string;
  currentDirectoryPath = moveBack;
  drawConnectedFiles();
}
export function MoveDown() {
  selectedDirIndex = Math.min(selectedDirIndex + 1, maxSelectedDirIndex - 1);
  if (selectingStartDirectory) drawSimilarStartingDirectories();
  else drawConnectedFiles();
}
export function MoveUP() {
  selectedDirIndex = Math.max(selectedDirIndex - 1, 0);
  if (selectingStartDirectory) drawSimilarStartingDirectories();
  else drawConnectedFiles();
}
export function MoveRight() {
  if (currentSimilarStartDirectories.length == 0) return;

  if (selectingStartDirectory) {
    selectingStartDirectory = false;

    const file = currentSimilarStartDirectories[selectedDirIndex];
    debug(`MoveRight ${file.name} ${file.is_folder}`);

    if (!file.is_folder) {
      OpenFile(file.path);
      return;
    }
    currentDirectoryPath = file.path;
  } else {
    const file = connectedFiles[selectedDirIndex];
    if (!file.is_folder) {
      OpenFile(file.path);
      return;
    }
    currentDirectoryPath = `${file.path}/`;
  }

  selectedDirIndex = 0;
  drawConnectedFiles();

  const inputElement = document.getElementById("textInput") as HTMLInputElement;
  inputElement.value = "";

  const SelectStartDirectory = document.getElementById(
    "SelectStartDirectory"
  ) as HTMLInputElement;
  SelectStartDirectory.hidden = true;
}
export async function GoBackToHomeDirectories() {
  enterFileName.hidden = true;

  const inputElement = document.getElementById("textInput") as HTMLInputElement;
  inputElement.value = "";
  inputElement.hidden = false;
  selectingStartDirectory = true;
  currentSimilarStartDirectories = await invoke("search_starting_directories", {
    text: "",
  });

  drawSimilarStartingDirectories();
}
export function NewFile() {
  document.getElementById("textInput")?.focus();
  enterFileName.hidden = false;
}
debug("ts 1");
setupEvents();
debug("ts 2");

let enterFileName = document.getElementById(
  "enterFileName"
) as HTMLInputElement;
enterFileName.hidden = true;
debug("ts 3");

currentSimilarStartDirectories = await invoke("search_starting_directories", {
  text: "",
});
debug("ts 4");

drawSimilarStartingDirectories();
debug("ts 5");
