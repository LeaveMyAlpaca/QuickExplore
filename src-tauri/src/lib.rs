mod CommandRun;
mod FuzzyTextSearch;
mod connectedFilesManager;
pub mod fuzzyTextSearch;
mod homeDirectories;
use tauri::Manager;
use tauri::{AppHandle, Emitter};
use window_vibrancy::*;
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
                let mut win = app.get_webview_window("main").unwrap();

                #[cfg(target_os = "macos")]
                apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                    .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

                #[cfg(target_os = "windows")]
                apply_acrylic(&win, Some((0, 0, 0, 0)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

                app.handle().plugin(tauri_plugin_positioner::init());
                tauri::tray::TrayIconBuilder::new()
                    .on_tray_icon_event(|tray_handle, event| {
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    })
                    .build(app)?;
                use tauri_plugin_positioner::{Position, WindowExt};

                let _ = win.as_ref().window().move_window(Position::TopCenter);

                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };
                let _ = win.as_ref().window().hide();

                let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyN);
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |_app, shortcut, event| {
                            if shortcut == &ctrl_n_shortcut {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        win.emit("focus", "").unwrap();

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
                    window.emit("unFocus", "").unwrap();

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
            CommandRun::RunCommand,
            homeDirectories::addStartDirectories,
            connectedFilesManager::remove_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn search_starting_directories(text: String) -> Vec<FuzzyTextSearch::fileStat> {
    let allStartingDirectories: Vec<FuzzyTextSearch::fileStat> =
        homeDirectories::get_starting_directories();
    return FuzzyTextSearch::search(allStartingDirectories, text);
}
