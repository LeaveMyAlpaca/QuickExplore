import { invoke } from "@tauri-apps/api/core";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
import { listen } from "@tauri-apps/api/event";
function focus() {
  document.getElementById("textInput")?.focus();
  debug("focused");
}
function debug(value: string) {
  invoke("debug", {
    value: value,
  });
}
debug("Begin");
focus();

listen("focus", (event) => {
  focus();
});
