/**
 * Shuffles array in place.
 * @param {Array} items items An array containing the items.
 */

function shuffle(items) {

    for (var i = items.length - 1; i > 0; i--) {
        var randIdx = Math.floor(Math.random() * (i + 1));
        var temp = items[i];
        items[i] = items[randIdx];
        items[randIdx] = temp;
    }

    return items;
}

function initRandomNums(size) {
    var nums = []
    for (var i = 0; i < size; i++) {
        nums[i] = i + 1;
    }
    shuffle(nums);
    return nums;
}