import { invoke } from "@tauri-apps/api/core";
import { debug } from "./main";

export function CreateStartDirectoryInHere(path: string, name: string) {
  return invoke("addStartDirectories", {
    path: path,
    name: name,
  });
}
export function OpenInVsCode(path: string) {
  invoke("RunCommand", {
    command: `code "${path.replace("/", "\\")}"`,
  });
}
export function OpenInExplorer(path: string) {
  let comand = `explorer "${path.replace("/", "\\")}"`;
  invoke("RunCommand", {
    command: comand,
  });
}
export async function OpenFile(path: string) {
  invoke("RunCommand", {
    command: `start "${path.replace("/", "\\")}"`,
  });
}
export function OpenWithPWSH(path: string) {
  invoke("RunCommand", {
    command: `powershell.exe -noexit -command "cd '${path.replace(
      "/",
      "\\"
    )}'"`,
  });
}
