use std::cmp;

pub fn search(
    mut directoriesData: Vec<StartDirectorySettings>,
    phrase: String,
) -> Vec<StartDirectorySettings> {
    for index in 0..directoriesData.len() {
        let distance = WagnerFischerDistance(
            phrase.to_lowercase(),
            directoriesData[index].name.to_lowercase(),
        );
        directoriesData[index].distance = distance;
    }
    directoriesData.sort_by(|a, b| a.distance.cmp(&b.distance));

    return directoriesData;
}

#[derive(Clone, serde::Serialize)]
pub struct StartDirectorySettings {
    pub name: String,
    pub path: String,
    pub icon_path: String,
    pub distance: usize,
}

fn WagnerFischerDistance(s1: String, s2: String) -> usize {
    let char1: Vec<char> = s1.chars().collect();
    let char2: Vec<char> = s2.chars().collect();
    let columns = char1.len() + 1;
    let rows = char2.len() + 1;

    //* */  we know that ALWAYS first row looks like this [1,2,3,4,5....]
    let mut previousRow = vec![0; columns];
    for index in 0..columns {
        previousRow[index] = index;
    }
    // println!("0 row: {:?}", previousRow);

    //  we skip first row
    for rowIndex in 1..rows {
        let mut currentRow = vec![0; columns];
        currentRow[0] = rowIndex;
        for columnIndex in 1..columns {
            // if the values are the same we can just setMin other wise we need to add one
            let add: usize;

            if char1[columnIndex - 1] == char2[rowIndex - 1] {
                add = 0;
            } else {
                add = 1;
            }
            let y1 = previousRow[columnIndex];
            let x1y1 = previousRow[columnIndex - 1];
            let x1 = currentRow[columnIndex - 1];
            currentRow[columnIndex] = cmp::min(cmp::min(y1, x1y1), x1) + add;
        }
        // println!("{} row: {:?}", rowIndex, currentRow);
        previousRow = currentRow;
    }

    //* */ we take last row's last index and thats our distance!
    return previousRow[previousRow.len() - 1];
}
