use std::process::Command;
#[tauri::command]
pub fn RunCommand(command: &str) {
    //! could be dangerous
    Command::new("pwsh")
        .args(["/C", command])
        .output()
        .expect("failed to execute process");

    println!("RunCommand {}", command);
}
