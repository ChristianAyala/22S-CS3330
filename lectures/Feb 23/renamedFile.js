/**
 * We define a couple of things here: a function and a string
 */
const multiplyTwoNumbers = (a, b) => {
    return a * b;
}

const arbitraryString = 'myModule';

/**
 * module.exports is a special object that gets exported to be shared by
 * other files. Add any other bits of data to the module.exports object
 * to be used by other files.
 */
module.exports = {
    multiplyTwoNumbers,
    arbitraryString
};