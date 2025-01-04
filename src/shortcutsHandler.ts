import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import {
  connectedFiles,
  currentDirectoryPath,
  currentSimilarStartDirectories,
  debug,
  drawSimilarStartingDirectories,
  GoBackToHomeDirectories,
  moveBackADirectory,
  MoveDown,
  MoveRight,
  MoveUP,
  NewFile,
  selectedDirIndex,
  selectingStartDirectory,
} from "./main";
import {
  OpenInExplorer,
  OpenInVsCode,
  OpenWithPWSH,
  RemoveFile,
} from "./clickHandler";
import { invoke } from "@tauri-apps/api/core";

let goUpShortcut = "Alt+k";
let goDownShortcut = "Alt+j";
let goLeftShortcut = "Alt+h";
let goRightShortcut = "Alt+l";

let goToHome = "Alt+u";
let openWithVsCode = "Alt+c";
let openWithExplorer = "Alt+e";
let openWithPWSH = "Alt+p";
let removeFile = "Alt+w";
let newFile = "Alt+n";

export async function RegisterAllShortcuts() {
  await register(goUpShortcut, (event) => {
    if (event.state == "Pressed") {
      MoveUP();
    }
  });
  await register(goDownShortcut, (event) => {
    if (event.state == "Pressed") {
      MoveDown();
    }
  });

  register(goRightShortcut, (event) => {
    if (event.state == "Pressed") {
      MoveRight();
    }
  });
  await register(goLeftShortcut, (event) => {
    if (event.state == "Pressed") {
      moveBackADirectory();
    }
  });

  await register(goToHome, (event) => {
    if (event.state == "Pressed") {
      GoBackToHomeDirectories();
    }
  });

  await register(openWithVsCode, (event) => {
    if (event.state == "Pressed") {
      if (!selectingStartDirectory) {
        OpenInVsCode(connectedFiles[selectedDirIndex].path);
      } else {
        OpenInVsCode(currentSimilarStartDirectories[selectedDirIndex].path);
      }
    }
  });
  await register(openWithExplorer, (event) => {
    if (event.state == "Pressed") {
      let path = currentDirectoryPath;

      debug(
        `replace ${path} || ${path.charAt(path.length - 1)} || ${path.slice(
          0,
          -1
        )}`
      );
      OpenInExplorer(path.slice(0, -1));
    }
  });
  await register(openWithPWSH, (event) => {
    if (event.state == "Pressed") {
      if (!selectingStartDirectory) {
        OpenWithPWSH(connectedFiles[selectedDirIndex].path);
      } else {
        OpenWithPWSH(currentSimilarStartDirectories[selectedDirIndex].path);
      }
    }
  });
  await register(removeFile, (event) => {
    if (event.state == "Pressed") {
      RemoveFile(connectedFiles[selectedDirIndex].path);
    }
  });
  await register(newFile, (event) => {
    if (event.state == "Pressed") {
      NewFile();
    }
  });
}
export async function UnRegisterAllShortcuts() {
  await unregister(AllShortcutsArray());
}

function BackToMain() {
  settings.hidden = true;
  mainScreen.hidden = false;
  drawSimilarStartingDirectories();
}

export function DrawSettingsUI() {
  debug("DisplayShortcutSetting");

  mainScreen.hidden = true;
  settings.hidden = false;
  settingsLayout.innerHTML = "";

  DisplayShortcutSetting(
    goUpShortcut,
    (event: Event) => {
      goUpShortcut = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "move up"
  );
  DisplayShortcutSetting(
    goDownShortcut,
    (event: Event) => {
      goDownShortcut = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "move down"
  );
  DisplayShortcutSetting(
    goLeftShortcut,
    (event: Event) => {
      goLeftShortcut = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "move left"
  );
  DisplayShortcutSetting(
    goRightShortcut,
    (event: Event) => {
      goRightShortcut = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "move right"
  );
  DisplayShortcutSetting(
    goToHome,
    (event: Event) => {
      goToHome = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "home"
  );
  DisplayShortcutSetting(
    openWithExplorer,
    (event: Event) => {
      openWithExplorer = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "open explorer"
  );
  DisplayShortcutSetting(
    openWithPWSH,
    (event: Event) => {
      openWithPWSH = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "open power shell"
  );
  DisplayShortcutSetting(
    openWithVsCode,
    (event: Event) => {
      openWithVsCode = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "open vs code"
  );
  DisplayShortcutSetting(
    removeFile,
    (event: Event) => {
      removeFile = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "remove file"
  );
  DisplayShortcutSetting(
    newFile,
    (event: Event) => {
      newFile = (event.target as HTMLInputElement).value;
      ChangedShortcut();
    },
    "create new file"
  );
}

function DisplayShortcutSetting(
  value: string,
  onChange: (event: Event) => void,
  name: string
) {
  debug("DisplayShortcutSetting v2");
  const settingDisplay = document.createElement("div");
  settingDisplay.className = "settingDisplay";

  const shortcut = document.createElement("input");
  shortcut.value = value;
  shortcut.className = "textInput";
  shortcut.style.width = "5rem";
  shortcut.onchange = (event) => onChange(event);
  settingDisplay.append(shortcut);
  const fileName = document.createElement("fileName");
  fileName.textContent = name;
  fileName.className = "fileName";
  settingDisplay.append(fileName);

  settingsLayout.append(settingDisplay);
}
function ChangedShortcut() {
  UnRegisterAllShortcuts();
  RegisterAllShortcuts();

  invoke("save_shortcuts", {
    shortcuts: AllShortcutsArray(),
  });
}
async function loadSavedShortcuts() {
  let saves: string[] = await invoke("get_saved_shortcuts", {
    shortcuts: AllShortcutsArray(),
  });
  goUpShortcut = saves[0];
  goDownShortcut = saves[1];
  goLeftShortcut = saves[2];
  goRightShortcut = saves[3];
  goToHome = saves[4];
  openWithExplorer = saves[5];
  openWithPWSH = saves[6];
  openWithVsCode = saves[7];
  removeFile = saves[8];
  newFile = saves[9];
}
let AllShortcutsArray = () => [
  goUpShortcut,
  goDownShortcut,
  goLeftShortcut,
  goRightShortcut,
  goToHome,
  openWithExplorer,
  openWithPWSH,
  openWithVsCode,
  removeFile,
  newFile,
];

const settings = document.getElementById("settings") as HTMLElement;
const mainScreen = document.getElementById("mainScreen") as HTMLElement;

const settingsLayout = document.getElementById("settingsLayout") as HTMLElement;
const backToMain = document.getElementById("backToMain") as HTMLElement;
backToMain.onclick = BackToMain;
await loadSavedShortcuts();
ChangedShortcut();
