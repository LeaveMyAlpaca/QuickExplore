import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getIconPathForExtension } from "./iconsHandler";
import { OpenInVsCode, CreateStartDirectoryInHere } from "./clickHandler";

class fileStat {
  public name: string = "";
  public path: string = "";
  public icon_path: string = "";
  public distance: number = 0;
  public extension: string = "";
}

function focus() {
  document.getElementById("textInput")?.focus();
}
export function debug(value: string) {
  invoke("debug", {
    value: value,
  });
}
let currentSimilarStartDirectories: fileStat[];
async function textInputChanged(event: Event) {
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
      startDirectory.icon_path,
      selectedDirIndex == index
    );
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
  icon.src = iconSrc;
  icon.className = "fileIcon";
  fileDisplay.append(icon);
  if (highlight) {
    let scrollInToView = document.getElementById(
      "scrollInToView"
    ) as HTMLElement;
    scrollInToView.scrollIntoView({ behavior: "instant", block: "end" });

    fileDisplay.style.border = "5px solid #555555";
  }
  const fileName = document.createElement("fileName");
  fileName.textContent = name;
  fileName.className = "fileName";
  fileDisplay.append(fileName);
  if (createStartDirectoryButton) {
    appendButton(
      fileDisplay,
      () => CreateStartDirectoryInHere(path, name),
      "/src/assets/fileIcons/folder.svg",
      "add to start directories"
    );
  }
  if (openInVsCode) {
    appendButton(
      fileDisplay,
      () => OpenInVsCode(path),
      "/src/assets/Button icons/vs code.jpg",
      "open in vs code"
    );
  }

  layout.append(fileDisplay);
}
let connectedFiles: fileStat[];
async function drawConnectedFiles() {
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
async function moveBackADirectory() {
  debug(`MoveBack ${currentDirectoryPath}`);
  let moveBack = (await invoke("move_back_from_current_directory", {
    dir: currentDirectoryPath,
  })) as string;
  debug(`MoveBack after ${moveBack}`);
  currentDirectoryPath = moveBack;
  drawConnectedFiles();
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
  buttonsIcon.src = src;
  buttonsIcon.width = 50;
  buttonsIcon.height = 50;
  button.append(buttonsIcon);
  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = tooltipContent;
  button.append(tooltip);

  parent.append(button);
}
async function goBackToHomeDirectories() {
  const inputElement = document.getElementById("textInput") as HTMLInputElement;
  inputElement.value = "";
  inputElement.hidden = false;
  selectingStartDirectory = true;
  currentSimilarStartDirectories = await invoke("search_starting_directories", {
    text: "",
  });
  debug(
    `currentSimilarStartDirectories ${currentSimilarStartDirectories.length}`
  );

  drawSimilarStartingDirectories();
}
focus();

listen("focus", (event) => {
  focus();
});

const inputElement = document.getElementById("textInput") as HTMLInputElement;
inputElement.oninput = (event: Event) => {
  textInputChanged(event);
};
const homeDir = document.getElementById(
  "backToHmeDirectoryButton"
) as HTMLElement;
homeDir.onclick = () => {
  goBackToHomeDirectories();
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
      currentDirectoryPath = `${connectedFiles[selectedDirIndex].path}/`;
    }
    selectedDirIndex = 0;
    drawConnectedFiles();

    const inputElement = document.getElementById(
      "textInput"
    ) as HTMLInputElement;
    inputElement.value = "";

    const SelectStartDirectory = document.getElementById(
      "SelectStartDirectory"
    ) as HTMLInputElement;
    SelectStartDirectory.hidden = true;
  }
});
await register("Alt+h", (event) => {
  if (event.state == "Pressed" && !selectingStartDirectory) {
    moveBackADirectory();
  }
});
