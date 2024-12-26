use std::fs;

#[tauri::command]
pub fn get_connected_files(currentPath: String) -> Vec<fileStat> {
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

#[tauri::command]
pub fn move_back_from_current_directory(dir: String) -> String {
    let replacedPath = dir.replace("\\", "/");
    println!("RS-> {}", replacedPath);
    let splitted_directory = replacedPath.split("/");
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

#[derive(Clone, serde::Serialize)]
pub struct fileStat {
    pub path: String,
    pub name: String,
    pub extension: String,
}
