import { invoke } from "@tauri-apps/api/core";
import { debug, drawConnectedFiles } from "./main";

export function CreateStartDirectoryInHere(path: string, name: string) {
  return invoke("addStartDirectories", {
    path: path,
    name: name,
  });
}
export function OpenInVsCode(path: string) {
  invoke("RunCommand", {
    command: `code "${path.replaceAll("/", "\\")}"`,
  });
}
export function OpenInExplorer(path: string) {
  let command = `explorer "${path.replaceAll("/", "\\")}"`;
  debug(command);
  invoke("RunCommand", {
    command: command,
  });
}
export async function OpenFile(path: string) {
  invoke("RunCommand", {
    command: `start "${path.replaceAll("/", "\\")}"`,
  });
}
export function OpenWithPWSH(path: string) {
  invoke("RunCommand", {
    command: `powershell.exe -noexit -command "cd '${path.replaceAll(
      "/",
      "\\"
    )}'"`,
  });
}
