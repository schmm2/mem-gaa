export function checkObjectWithIdExistsInArray(idToFind, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === idToFind) {
            return true;
        }
    }
    return false;
}