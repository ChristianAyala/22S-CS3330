/**
 * Welcome to Javascript!!
 * Before starting, be sure to install node if you haven't already: https://nodejs.org/en/download/
 * To make sure it installed correctly, open a terminal and enter the command:
 * 
 * node
 * 
 * You should then see a "Welcome to Node.js" prompt. To exit the node session and go back to the terminal, type:
 * 
 * .exit
 * 
 * (Note the period at the start of the command).
 * 
 * To run this entire script in one go, cd into this directory and run:
 * 
 * node index.js
 * 
 * Node is an interpreted language that runs on the V8 engine. The same one that powers the Chrome browser.
 * There is no main() function in JS files. Anything at the top level of the file is parsed and executed
 * as if it were in main().
 * 
 * Let's start with the basics: variables.
 * JS variables are LOOSELY TYPED, which means their type is _inferred_ by the runtime and _can change_
 * during program execution. To declare a variable there are two parts: the name of the variable and the
 * access modifier. A third part is optional, and that is the initial assignment.
 */

let myVariable;

/**
 * The "let" keyword means _this variable can change it's value over time_.
 * Let's take a look at the _type_ of myVariable through the use of a 
 * console.log() (the JS version of cout or System.out.println())
 * and the typeof keyword.
 */
console.log('Type of myVariable:', typeof myVariable);

/**
 * So the type of myVariable is undefined. Which makes sense, since the runtime has no idea what you
 * will use the variable for. So let's fill it.
 */
myVariable = 'Hello world'; // Single or double quotes are fine, but I recommend single quotes.
console.log('myVariable has a value:', myVariable, '... And a datatype of', typeof myVariable);

/**
 * The runtime has changed the datatype to string. But since this is a dynamically typed language,
 * the type of data can change during runtime.
 */
myVariable = 12;
console.log('myVariable has a value:', myVariable, '... And a datatype of', typeof myVariable);

/**
 * I don't recommend you do this often: changing datatypes can make it hard to deduce what data
 * you're interacting with at any given point in time.
 * 
 * The other kind of variable is a _const_ variable, which says the _value of the variable cannot change_.
 * 
 */
const myConstVariable = 'hello';
// Uncomment this next line to have the program crach with a TypeError
// myConstVariable = 12;

/**
 * Think of a const variable like a c++ const char* (remember those?). The _pointer_ can't be
 * reassigned to point somewhere else, but the _value at the pointer_ can still be updated.
 * Unless you _need_ to reassign the value in a variable, you should almost always use
 * const over let.
 * 
 * Loops look and feel very familiar. for loops and while loops are mostly the same from c++ / java.
 * The only difference is the "let" keyword, since i changes values every iteration.
 */
console.log('Looping through each letter in a variable');
for (let i = 0; i < myConstVariable.length; i++) {
    const character = myConstVariable.charAt(i);
    console.log(`Letter at index ${i}: ${character}`);
}

/**
 * Note the special string character: backticks ``. This is the key above the left tab key.
 * This is a string that allows for variable interpolation. In this case, we call a function
 * on a string called charAt(), which returns the character at a given index. We then
 * console.log a string containing some text, a number, a colon, and a character (technically a string).
 */

/**
 * So far we've dealt with three datatypes: undefined, string, and number. These are three
 * primitive datatypes, along with boolean, null, bigint and symbol. The last two you won't
 * see often.
 * 
 * Everything else in JS is an _object_ of some sort. JS initially had no support for classes. Or, it did,
 * but in a roundabout way (we'll get there). Objects are much like hash tables: they are a collection
 * of key-value pairs. The keys can be either strings or numbers, and the values can be anything, including
 * primitive data types, objects, arrays, and functions. The most basic object is an empty one,
 * and all objects are declared with curly braces {}
 */
const myObject = {};
console.log('My empty object:', myObject);

/**
 * There are a few ways to add data to an object.
 */
myObject.id = '1234';
myObject['firstName'] = 'Chris';
const lastNameKey = 'lastName';
myObject[lastNameKey] = 'Ayala';
myObject['Courses Teaching'] = ['CS2353', 'CS3353'];
console.log('My object with some data:', myObject);

/**
 * Remember: I declared myObject as const. But think of the variable myObject as a C++ pointer, pointing
 * to an object on the heap. The reference on the stack can't change, but the data on the heap can.
 * Above, we added data using the dot notation or the bracket notation. Use the dot notation when you're
 * setting a key with no spaces. Use the bracket notation when you're setting a key with spaces, or
 * you're setting a key based on the value in a variable.
 * 
 * Objects can contain any number of nested objects.
 */
myObject.address = {
    street: '1234 Main',
    city: 'Dallas',
    state: 'TX',
    zip: 75201
};

console.log('My object with a nested object', myObject);

/**
 * Accessing data within an object is very similar, and looks like notation you'd see in C++ / Java.
 */
console.log('Access address from myObject:', myObject.address);

/**
 * Objects are extremely flexible. Since there is no class definition, an object can contain any
 * number of keys and values, nested arbitrarily deeply.
 * 
 * Arrays are also included in the language, and those can contain any kind of data. You're not
 * limited to data of the same datatype like you are in C++ / Java.
 */
const myArray = ['Chris', 'Ayala', 1234, { gpa: 4.0 }];
console.log('My array:', myArray);

/**
 * In the example above, we have an array with two strings, a number, and an object containing a
 * single key-value pair. Arrays in JS are much like linked lists: they can grow and shrink.
 */

myArray.push('Adding an element');
console.log('Adding an item to the end of an array:', myArray);
myArray.splice(2, 1);
console.log('Removing element at index 2:', myArray);

/**
 * Now we get to the most interesting piece of javascript: functions. Functions are
 * _first class citizens_ in JS, and have been from the start. This means that functions
 * can be declared, stored in variables, and passed to other functions as arguments.
 * 
 * Let's start with the basics: a simple function to add two values and return them.
 */
function add(a, b) {
    return a + b;
}

/**
 * We declare a function using the "function" keyword, followed by the name, and
 * any arguments it may need. You can call a function as such:
 */
const stringAdd = add('Hello', 'World');
console.log('Result of add function on two strings:', stringAdd);

/**
 * Notice how we didn't specify datatypes for a or b. So you can call the function
 * with anything, and JS will do it's best to add those two things together.
 * We also don't specify the return type of the function. Since the arguments are
 * dynamic, JS has no idea what the return type will be until the moment you call it.
 */
const numbersAdd = add(7, 8);
console.log('Result of add function on two numbers', numbersAdd);

/**
 * Sometimes that can lead to some weird results.
 */
console.log('Adding a string and a number:', add('Seven', 7));
console.log('Adding a number to an object:', add(7, {}));
console.log('Type of the addition we just did:', typeof add(7, {}));

/**
 * So try be consistent and predictable with your function arguments.
 * That's one way to create a function. The other is through the use of what's called
 * an " arrow function". These look more like variables.
 */

const myArrowFunction = (a, b) => {
    return a + b;
}

console.log('Trying out an arrow function:', myArrowFunction(3, 4));

/**
 * Apart from the different _declaration syntax_, they operate almost identically.
 * You have a function name, some arguments, and the body of the function.
 * These days, most people prefer arrow functions over regular functions.
 */

/**
 * Functions in JS are special. They are what's known as _closures_. A closure
 * is a special kind of function that _is aware of what's around it and within it_.
 */

const myCaptureFunction = () => {
    console.log('Printing my array within a function:', myArray);
}
myCaptureFunction();

/**
 * Even though my function DID NOT declare a variable called myArray, the function
 * was declared _within the same scope_ as myArray, and thus has access to it.
 * Every variable that is within the same or greater scope as a function gets
 * "captured" and is accessible by that function.
 * 
 * Remember how JS is an interpreted language? This means that the BODY of the function
 * is not processed by the runtime engine until it's used. The engine goes line by line.
 * This means that you can have a function with an obvious error (call a function that
 * has not been defined) and JS won't know _until the moment that line of code is reached.
 */
const myFunctionWithAnError = () => { // Declare the function first
    sdklfjlksa();                     // Call a function that doesn't exist. No errors yet...
}

console.log('Before calling the function with an error'); // Code keeps executing here
// myFunctionWithAnError();                                  // Only NOW does the runtime see the bug.
console.log('After calling the function with an error');  // Comment out the previous line, and we should see this log appear.

/**
 * Since functions are much like variables, you can also add them as values to objects.
 * And call them as if they were functions on a class like in C++ / Java
 */
myObject.saySomething = () => {
    console.log('Hello there from a function in an object!');
}

myObject.saySomething();
console.log('Here is what myObject looks like now:', myObject);

/**
 * We see that the object has a field called saySomething that is a function.
 * A function can return _a single value_, but that value can be a complex object.
 */
const aFunctionReturningAnObject = () => {
    return {
        firstName: 'Mark',
        lastName: 'Fontenot'
    };
}
const mark = aFunctionReturningAnObject();
console.log('Calling a function that returns a single object with multiple keys:', mark);

/**
 * Here's where things get interesting. JS originally had no concept of classes like C++ / Java.
 * But functions are closures, so they remember the context in which they were defined. This
 * includes variables that were in scope _at the time the function was defined_.
 */

const person = (name) => {
    return {
        speak: () => {
            console.log(name);
        }
    }
};

const andrew = person('Andrew');
andrew.speak();

/**
 * When we call person('Andrew'), we are trained from C++ / Java to know that the variable
 * "name" _should_ go out of scope (and thus get cleaned up) when the function ends. But that's
 * not the case here. person('Andrew') returns an object. That object contains one key: speak.
 * That speak key refers to a function value that logs out the value name. So even though the
 * person() function has ended and name SHOULD go out of scope, it doesn't because the function
 * inside the object has captured it.
 */
console.log('The structure of what was returned by person(Andrew):', andrew);

/**
 * This is how classes and instances of classes were originally made: via closures + objects.
 */
const professor = (_name) => {

    // Anything defined within the body of the function is scoped to within the function.
    // Think of these like private variables defined in a constructor
    let name = _name;
    let courses = ['CS2353', 'CS3330'];

    // You can return an object containing public functions / data for anyone to use.
    return {
        listCourses: () => {
            console.log('This professor teaches:', courses);
        },
        provideName: () => {
            return name;
        }
    }
}

const ayala = professor('ayala');
console.log('Structure of ayala:', ayala);
ayala.listCourses();
console.log(ayala.provideName());