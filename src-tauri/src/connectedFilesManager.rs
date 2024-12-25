use std::fs;

use serde::de::value;
#[tauri::command]
pub fn get_connected_files(currentPath: String) -> Vec<fileStat> {
    let mut return_vec: Vec<fileStat> = Vec::new();
    let paths = fs::read_dir(currentPath).unwrap();

    for dir in paths {
        let path = dir.unwrap().path().display().to_string();
        let splittedPath = path.split("/");
        let fileName = splittedPath.last().unwrap();
        println!("test file name: {} full path: {}", fileName, path);
        return_vec.push(fileStat {
            path: path.to_string(),
            name: fileName.to_string(),
        });
    }

    return return_vec;
}
#[derive(Clone, serde::Serialize)]
pub struct fileStat {
    pub path: String,
    pub name: String,
}
