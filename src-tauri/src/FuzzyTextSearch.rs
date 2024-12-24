use std::{cmp, collections::HashMap, f32::consts::E};
pub fn Search(mut data: Vec<String>, phrase: String) -> Vec<String> {
    let mut sortedData: Vec<SortStruct> = Vec::new();

    for text in data.iter() {
        let distance = WagnerFischerDistance(phrase.to_lowercase(), text.to_lowercase());
        println!("{} distance: {}", text, distance);
        sortedData.push(SortStruct {
            text: text.to_string(),
            distance: distance,
        });
    }
    sortedData.sort_by(|a, b| a.distance.cmp(&b.distance));

    return extract_text_from_sort_struct(sortedData);
}

fn extract_text_from_sort_struct(structs: Vec<SortStruct>) -> Vec<String> {
    let mut return_vec: Vec<String> = Vec::new();

    for value in structs.iter() {
        return_vec.push(value.text.to_string());
    }
    return return_vec;
}

struct SortStruct {
    distance: usize,
    text: String,
}

fn WagnerFischerDistance(s1: String, s2: String) -> usize {
    let columns = s1.len() + 1;
    let rows = s2.len() + 1;
    let char1: Vec<char> = s1.chars().collect();
    let char2: Vec<char> = s2.chars().collect();

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
