use crate::FuzzyTextSearch as fuzzy;
use std::fs::{self, File};
use std::io::prelude::*;
use std::path::{self, Path, PathBuf};
const HOME_DIRECTORIES_SAVE_FILE_PATH_BUILD: &str = "./Save files/HomeDirectories.txt";
const HOME_DIRECTORIES_SAVE_FILE_PATH_DEV: &str = "./../_Save files/HomeDirectories.txt";

const HOME_DIRECTORIES_SAVE_SIZE: f64 = 3_f64;

pub fn get_save_file_content(path: &str) -> String {
    let absolutePath = convertInToAbsolutePath(path);
    println!("get_save_file_content {}", absolutePath.to_str().unwrap());
    return fs::read_to_string(absolutePath).expect("Should have been able to read the file");
}

pub fn save_starting_directories(toSave: &Vec<fuzzy::fileStat>) {
    let absolutePath = convertInToAbsolutePath(&GetHomeDirPath());

    println!("toSave {}", toSave.len());
    let mut saveFileContent = String::new();
    for saveFile in toSave {
        saveFileContent += &(saveFile.name.to_string()
            + "\n"
            + &saveFile.path
            + "\n"
            + &saveFile.icon_path
            + "\n");
    }
    let file = File::create(absolutePath);

    file.unwrap().write(saveFileContent.as_bytes());
}

pub fn convertInToAbsolutePath(localPathString: &str) -> PathBuf {
    let localPath = PathBuf::from(localPathString);
    let absolutePath = fs::canonicalize(&localPath).unwrap();
    absolutePath
}
fn GetHomeDirPath() -> String {
    println!("GetHomeDirPath 0",);

    let absolutePath = convertInToAbsolutePath("./");
    let splittedPath = absolutePath
        .to_str()
        .unwrap()
        .split("\\")
        .collect::<Vec<_>>();
    let lastDirName = splittedPath[splittedPath.len() - 1];
    if (lastDirName == "src-tauri") {
        return HOME_DIRECTORIES_SAVE_FILE_PATH_DEV.to_string();
    } else {
        return HOME_DIRECTORIES_SAVE_FILE_PATH_BUILD.to_string();
    }
}

pub fn get_starting_directories() -> Vec<fuzzy::fileStat> {
    let save_string: String = get_save_file_content(&GetHomeDirPath());

    let splitted_string = save_string.split("\n").collect::<Vec<_>>();
    let saved_home_directories_count: u64 =
        (splitted_string.len() as f64 / HOME_DIRECTORIES_SAVE_SIZE).floor() as u64;

    let mut all_starting_directories: Vec<fuzzy::fileStat> = Vec::new();
    for save_index in 0..saved_home_directories_count {
        let start_index_of_save = save_index as usize * HOME_DIRECTORIES_SAVE_SIZE as usize;
        let name = splitted_string[start_index_of_save].to_string();
        let path = splitted_string[start_index_of_save + 1].to_string();
        let icon_path = splitted_string[start_index_of_save + 2].to_string();
        all_starting_directories.push(fuzzy::fileStat {
            name: name.replace("\r", ""),
            path: path.replace("\r", ""),
            icon_path: icon_path.replace("\r", ""),
            distance: 0,
            extension: "".to_string(),
            is_folder: true,
        });
    }
    println!(
        "get_starting_directories {:?}",
        all_starting_directories.len()
    );
    return all_starting_directories;
}
#[tauri::command]
pub fn addStartDirectories(path: String, name: String) {
    println!("addStartDirectories");
    let mut startIngDirectories = get_starting_directories();
    startIngDirectories.push(fuzzy::fileStat {
        path,
        name,
        icon_path: "".to_string(),
        distance: 0,
        extension: "".to_string(),
        is_folder: true,
    });
    save_starting_directories(&startIngDirectories);
}
