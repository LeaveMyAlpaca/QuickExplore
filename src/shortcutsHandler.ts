import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import {
  connectedFiles,
  currentDirectoryPath,
  currentSimilarStartDirectories,
  GoBackToHomeDirectories,
  moveBackADirectory,
  MoveDown,
  MoveRight,
  MoveUP,
  selectedDirIndex,
  selectingStartDirectory,
} from "./main";
import { OpenInExplorer, OpenInVsCode, OpenWithPWSH } from "./clickHandler";

const goUpShortcut = "Alt+k";
const goDownShortcut = "Alt+j";
const goLeftShortcut = "Alt+h";
const goRightShortcut = "Alt+l";

const goToHome = "Alt+u";
const openWithVsCode = "Alt+c";
const openWithExplorer = "Alt+e";
const openWithPWSH = "Alt+p";

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
      OpenInExplorer(currentDirectoryPath);
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
}
export async function UnRegisterAllShortcuts() {
  await unregister([
    goUpShortcut,
    goDownShortcut,
    goLeftShortcut,
    goRightShortcut,
    goToHome,
    openWithExplorer,
    openWithPWSH,
    openWithVsCode,
  ]);
}
