import { invoke } from "@tauri-apps/api/core";
import { debug } from "./main";

export function CreateStartDirectoryInHere(path: string) {
  debug(`CreateStartDirectoryInHere ${path}`);
}
export function OpenInVsCode(path: string) {
  invoke("RunCommand", {
    command: `code ${path}`,
  });
}
