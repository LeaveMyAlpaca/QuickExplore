use crate::FuzzyTextSearch as fuzzy;
use std::fs::{self, File};
use std::io::prelude::*;
use std::path::{Path, PathBuf};
const HOME_DIRECTORIES_SAVE_FILE_PATH: &str = "./../Save files/HomeDirectories.txt";
const HOME_DIRECTORIES_SAVE_SIZE: usize = 4;

fn get_save_file_content() -> String {
    return fs::read_to_string(HOME_DIRECTORIES_SAVE_FILE_PATH)
        .expect("Should have been able to read the file");
}

pub fn save_starting_directories() {
    let localPath = PathBuf::from(HOME_DIRECTORIES_SAVE_FILE_PATH);
    let absolutePath = fs::canonicalize(&localPath).unwrap();
    println!("save_starting_directories {:?}", absolutePath.to_str());
    let file = File::create(absolutePath);
    let toSave = get_starting_directories();
    let mut saveFileContent = String::new();
    for saveFile in toSave {
        saveFileContent +=
            &(saveFile.name + "\n" + &saveFile.path + "\n" + &saveFile.icon_path + "\n");
    }
    file.unwrap().write(saveFileContent.as_bytes());
}

pub fn get_starting_directories() -> Vec<fuzzy::StartDirectorySettings> {
    let start1: fuzzy::StartDirectorySettings = fuzzy::StartDirectorySettings {
        name: "users".to_string(),
        path: "c:/users/".to_string(),
        icon_path: "/src/assets/fileIcons/folder.svg".to_string(),
        distance: 0,
    };

    // Temp
    let allStartingDirectories = vec![start1];

    return allStartingDirectories;
}
