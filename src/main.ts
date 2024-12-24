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
let currentSimilarStartDirectories: string[];
async function textInputChanged(event: Event) {
  const text = (event.target as HTMLInputElement).value;
  debug(`InputChanged ${text}`);

  currentSimilarStartDirectories = await invoke("search_starting_directories", {
    text,
  });
}
debug("Begin");
focus();

listen("focus", (event) => {
  focus();
});

const inputElement = document.getElementById("textInput") as HTMLInputElement;
inputElement.oninput = (event: Event) => {
  textInputChanged(event);
};
