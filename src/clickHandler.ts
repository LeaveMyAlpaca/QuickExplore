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
