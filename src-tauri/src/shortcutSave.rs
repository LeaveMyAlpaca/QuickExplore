use std::{fs::File, io::Write};

use crate::homeDirectories::{convertInToAbsolutePath, get_save_file_content};

const SHORTCUT_SAVE_FILE_PATH: &str = "./../Save files/Shortcuts.txt";

#[tauri::command]
pub fn save_shortcuts(shortcuts: Vec<String>) {
    let absolutePath = convertInToAbsolutePath(SHORTCUT_SAVE_FILE_PATH);

    let mut saveContent: String = String::new();

    for shortcut in shortcuts {
        saveContent += &(shortcut.to_string() + "\n")
    }

    let file = File::create(absolutePath);
    file.unwrap().write(saveContent.as_bytes());
}
#[tauri::command]
pub fn get_saved_shortcuts() -> Vec<String> {
    let save_string: String = get_save_file_content(SHORTCUT_SAVE_FILE_PATH);

    let splitted_string = save_string.split("\n").collect::<Vec<_>>();

    let mut returnVec: Vec<String> = Vec::new();
    for save in splitted_string {
        returnVec.push(save.to_string());
    }

    return returnVec;
}
