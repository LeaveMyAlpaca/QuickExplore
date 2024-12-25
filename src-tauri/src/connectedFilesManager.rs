use std::fs;
#[tauri::command]
pub fn get_connected_files(currentPath: String) -> Vec<fileStat> {
    println!("get_connected_files-path {}", currentPath);
    let mut return_vec: Vec<fileStat> = Vec::new();
    let paths = fs::read_dir(&currentPath).unwrap();

    for dir in paths {
        let path = dir.unwrap().path().as_path().to_str().unwrap().to_string();
        let splittedPath = path.split(&['/']);
        let fileName = splittedPath.last().unwrap();
        let nameAndExtension = fileName.split(".");

        let extension: String;
        if nameAndExtension.clone().count() != 1 as usize {
            extension = nameAndExtension.last().unwrap().to_string();
        } else {
            extension = "".to_string();
        }
        return_vec.push(fileStat {
            path: path.to_string(),
            name: fileName.to_string(),
            extension,
        });
    }

    return return_vec;
}
#[derive(Clone, serde::Serialize)]
pub struct fileStat {
    pub path: String,
    pub name: String,
    pub extension: String,
}
