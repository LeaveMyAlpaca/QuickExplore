mod CommandRun;
mod connectedFilesManager;
mod fuzzyTextSearch;

use fuzzyTextSearch::startDirectorySettings;
use tauri::Manager;
use tauri::{AppHandle, Emitter};
#[tauri::command]
fn debug(value: &str) {
    println!("Debug: {}", value);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.handle().plugin(tauri_plugin_positioner::init());
                tauri::tray::TrayIconBuilder::new()
                    .on_tray_icon_event(|tray_handle, event| {
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    })
                    .build(app)?;
                use tauri_plugin_positioner::{Position, WindowExt};

                let mut win = app.get_webview_window("main").unwrap();
                let _ = win.as_ref().window().move_window(Position::TopCenter);

                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };
                let _ = win.as_ref().window().hide();

                let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyN);
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |_app, shortcut, event| {
                            println!("{:?}", shortcut);
                            if shortcut == &ctrl_n_shortcut {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        let _ = win.as_ref().window().show();
                                        win.as_ref().window().set_focus();
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                        })
                        .build(),
                )?;

                app.global_shortcut().register(ctrl_n_shortcut)?;
            }

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::Focused(focused) => {
                // hide window whenever it loses focus
                if !focused {
                    window.emit("focus", "").unwrap();
                    window.hide().unwrap();
                }
            }
            _ => {}
        })
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            debug,
            search_starting_directories,
            connectedFilesManager::get_connected_files,
            connectedFilesManager::move_back_from_current_directory,
            CommandRun::RunCommand
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_starting_directories() -> Vec<startDirectorySettings> {
    let start1: startDirectorySettings = startDirectorySettings {
        name: "users".to_string(),
        path: "c:/users/".to_string(),
        icon_path: "/src/assets/fileIcons/folder.svg".to_string(),
        distance: 0,
    };
    // Temp
    return vec![start1];
}

#[tauri::command]
fn search_starting_directories(text: String) -> Vec<startDirectorySettings> {
    let allStartingDirectories = get_starting_directories();
    return fuzzyTextSearch::search(allStartingDirectories, text);
}
