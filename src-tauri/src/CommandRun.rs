use std::process::Command;
#[tauri::command]
pub fn RunCommand(command: &str) {
    let output = Command::new("cmd")
        .args(["/C", command])
        .output()
        .expect("failed to execute process");

    let hello = output.stdout;
    println!("RunCommand {:?}", hello);
}
