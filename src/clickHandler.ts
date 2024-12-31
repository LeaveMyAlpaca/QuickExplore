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
    command: `code ${path}`,
  });
}
export function OpenInExplorer(path: string) {
  invoke("RunCommand", {
    command: `explorer ${path}`,
  });
}
export function OpenFile(path: string) {
  invoke("RunCommand", {
    command: `${path}`,
  });
}
export function OpenWithPWSH(path: string) {
  invoke("RunCommand", {
    command: `powershell.exe -noexit -command "cd ${path}"`,
  });
}
