use crate::{homeDirectories, FuzzyTextSearch};
use std::fs::{self, File, ReadDir};
#[tauri::command]
pub fn get_connected_files(
    mut currentPath: String,
    currentText: String,
) -> Vec<FuzzyTextSearch::fileStat> {
    let mut return_vec: Vec<FuzzyTextSearch::fileStat> = Vec::new();
    // currentPath = "c:/users/".to_string();
    let unCheckedPath = fs::read_dir(&currentPath);
    let paths: ReadDir;
    if (unCheckedPath.is_err()) {
        paths = fs::read_dir("C:/users").unwrap();
    } else {
        paths = unCheckedPath.unwrap();
    }

    for dir in paths {
        let path = dir.unwrap().path();
        let isFolder = path.as_path().is_dir();
        let pathString = path.as_path().to_str().unwrap().to_string();
        let splittedPath = pathString.split(&['/', '\\']);
        let fileName = splittedPath.last().unwrap();
        let nameAndExtension = fileName.split(".");

        let extension: String;
        if nameAndExtension.clone().count() != 1 as usize {
            extension = nameAndExtension.last().unwrap().to_string();
        } else {
            extension = "".to_string();
        }
        return_vec.push(FuzzyTextSearch::fileStat {
            path: pathString.to_string(),
            name: fileName.to_string(),
            extension,
            icon_path: "".to_string(),
            distance: 0,
            is_folder: isFolder,
        });
    }

    return FuzzyTextSearch::search(return_vec, currentText);
}

#[tauri::command]
pub fn move_back_from_current_directory(dir: String) -> String {
    let replacedPath = dir.replace("\\", "/");
    println!("RS-> {}", replacedPath);
    let splitted_directory = replacedPath.split("/");
    if splitted_directory.clone().count() == 1 {
        return dir;
    }
    let mut outputPath = "".to_string();
    let mut index = 0;
    let maxIndex = splitted_directory.clone().count() - 2;
    for text in splitted_directory {
        if (maxIndex == index) {
            break;
        }
        outputPath += text;
        outputPath += "/";
        index += 1;
    }
    return outputPath.to_string();
}

#[tauri::command]
pub fn remove_file(dir: String) {
    fs::remove_file(dir);
}
#[tauri::command]
pub fn create_file(dir: String) {
    println!("create_file -> {}", dir);
    File::create(dir).expect("Creating file wasn't success full ");
}
