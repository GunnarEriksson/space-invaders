/*exported isIntersect, showTextLetterByLetter */

/**
 * Helper function to see if two vectors are intersecting
 *
 * @param  {number}  ax - The x-coordinate for the first object.
 * @param  {number}  ay - The y-coordinate for the first object.
 * @param  {number}  aw - The width of the first object.
 * @param  {number}  ah - The height of the first object.
 * @param  {number}  bx - The x-coordinate for the second object.
 * @param  {number}  by - The x-coordinate for the second object.
 * @param  {number}  bw - The width of the second object.
 * @param  {number}  bh - The height of the second object.
 *
 * @return {Boolean}  True if the objects intersects, false otherwise.
 */
function isIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}

function showTextLetterByLetter(ct, timer, index, text, offsetX, offsetY, textDistance) {
    if (timer % 8 === 0 & index < text.length) {
        index++;
    }

    for (var i = 0; i < index; i++) {
        ct.fillText(text[i], offsetX, offsetY);
        offsetX += textDistance;
    }

    return index;
}
