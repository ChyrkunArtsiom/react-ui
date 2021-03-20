//Reducer for handling loaded tags into header
const currentTagsReducer = (state = [], action) => {
    switch (action.type) {
        case 'PUT_TAGS': {
            let arr = state.concat(convertTagsForReactSelect(action.payload));
            arr = deleteDuplicates(arr);
            return arr;
        }
        case 'DELETE_TAGS': {
            return [];
        }
        default: {
            return state;
        }
    }
}

function convertTagsForReactSelect(array) {
    let converted = [];
    for (let i = 0; i < array.length; i++) {
        converted.push(
            {
                value: array[i].name,
                label: array[i].name
            });
    }
    return converted;
}

function deleteDuplicates(arr) {
    arr = arr.filter((element, index, self) =>
        index === self.findIndex((t) => (t.value === element.value
        ))
    );
    return arr;
}

function compare(a, b) {
    if (a.value < b.value) {
        return -1;
    }
    if (a.value > b. value) {
        return 1;
    }
    return 0;
}

export default currentTagsReducer;