// /**
//  * So far we've learned quite a few things about JS. Strings and numbers
//  * are primitive data types, objects are like hash tables, arrays are much
//  * like linked lists, and functions are... familiar. We combined them all
//  * to make a thing that looks like a class, but isn't.
//  */

// /**
//  * Think of a function like a constructor. It receives data and can be
//  * stored in LOCAL variables. Since these are local, they are inaccessible
//  * outside of the function.
//  */
const professor = (_firstName, _lastName) => {
    const firstName = _firstName;
    const lastName = _lastName;
    const courses = [];

    /**
     * However we can return an object to whoever called this function. This
     * object contains publicly accessible data / functions. We could also return
     * an array, but that's less common.
     */
    return {
        fullName: () => {
            return firstName + ' ' + lastName;
        },
        addCourse: (courseName) => {
            courses.push(courseName);
        },
        getCourses: () => courses
    }
}

const ayala = professor('Christian', 'Ayala');

const funcThatReturnsAnotherfunction = () => {
    return () => {
        console.log('Hello world');
    }
}

// const result = funcThatReturnsAnotherfunction();
// console.log('Result looks like:', result);
// result();
// console.log("Ayala's full name:", ayala.fullName());
// ayala.addCourse('CS3330');
// console.log("Ayala's courses:", ayala.getCourses());
// console.log(ayala);

// /**
//  * Note the getCourses() function. It uses a shorthand notation. If you have a function
//  * that has a single line that is a return statement, you can reduce it JUST to the 
//  * return itself.
//  * 
//  * So the following are equivalent:
//  * 
//  * getCourses: () => {
//  *     return courses;
//  * }
//  * 
//  * and
//  * 
//  * getCourses: () => courses
//  * 
//  * Similarly, we can reduce fullName to the following:
//  * 
//  * fullName: () => firstName + ' ' + lastName
//  * 
//  * Syntactic sugar!
//  */

// /**
//  * Javascript didn't originally have classes, but it does now! So rather than get
//  * fancy with closures, we can recreate the above in a more familiar format. Just
//  * note that classes are just syntactic sugar over the old function style.
//  */
// class professorClass {
//     constructor(_firstName, _lastName) {
//         this.firstName = _firstName;
//         this.lastName = _lastName;
//         this.courses = [];
//     }
    
//     addCourse(course) {
//         this.courses.push(course);
//     }
//     fullName() {
//         return this.firstName + ' ' + this.lastName;
//     }
//     getCourses() {
//         return this.courses;
//     }
// }

// const fontenot = new professorClass('Mark', 'Fontenot');
// console.log('Mark Fontenots full name:', fontenot.fullName());
// console.log('Mark Fontenots first name:', fontenot.firstName);

/**
 * Keep in mind that by default, data in a class is public. There is a way to
 * specify private data, but think about the context of what JS was primarily
 * designed for: a browser. A browser downloads the _source code_ of the JS and
 * runs it, meaning it has access to the class definition itself. So it
 * doesn't make much sense to hide it, since the client can modify it if they
 * want. So don't worry too much about public / private data.
 */

/**
 * We know that functions can be assigned to variables. As a reminder, let's
 * make a function that takes some data and logs it out.
 */
const logData = (data) => {
    console.log('Logging data:', data);
}
const addAString = (data) => {
    const newString = data + 'New';
    console.log(newString);
}
// logData({ name: 'Christian' });

/**
 * Since a function is a variable, you can pass it to a function like any other
 * variable and use it
 */
const applyFunctionToArray = (array, func) => {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        func(element);
    }
}
const arrayOfData = ['Christian', 'Ayala', 1234];
applyFunctionToArray(arrayOfData, logData);
applyFunctionToArray(arrayOfData, addAString);

/**
 * So in the above example, we define a function that expects two arguments:
 * an array and a function. We loop through each element of the array, store
 * it in a variable, and then call a function with that value which logs it out.
 * This becomes very powerful when dealing with arrays and we want to apply a
 * function to each element of an array.
 * 
 * For example, we can reduce the above function to a one-liner
 */
// arrayOfData.forEach()
console.log('Starting a forEach');
arrayOfData.forEach(logData);
arrayOfData.forEach(addAString);

/**
 * forEach is a function on the array type. forEach expects a _callback function_
 * that gets called once per element, much like the for loop we wrote. We can
 * define these functions inline too, for some really compact functions.
 * 
 * Let's do that with another array function: map. While forEach called a function
 * for each element of the array, map does the same thing AND builds a NEW array
 * containing the RETURN of each function call.
 */
const listOfIds = [123, 456, 789];
const idsAsStrings = listOfIds.map((singleId) => {
    return singleId.toString();
});
console.log('A list of numbers:', listOfIds);
console.log('That same list as strings', idsAsStrings);

/**
 * So instead of writing a for loop and manually converting each element and calling
 * push() on some array, we simply pass a callback function to the map function and
 * let it do its magic. Functions passed to functions!
 * 
 * Many array functions operate this way. Because JS arrays can contain ANY kind of
 * data, the JS runtime itself doesn't know how something like an `includes()` function
 * would work. How can it tell that one object of an arbitrary shape "equals" another?
 * So instead, many array functions require you to pass a function that knows how to
 * process a given element
 */

const students = [
    {
        id: 1234,
        firstName: 'Katie',
        lastName: 'Adams'
    },
    {
        id: 4567,
        firstName: 'Drew',
        lastName: 'Simon'
    },
    {
        id: 6789,
        firstName: 'Daniel',
        lastName: 'Hodges'
    }
];

// const includes4567 = students.find(student => {
//     return student.id === 4567;
// });

// let matchingStudent;
// for (let i = 0; i < students.length; i++) {
//     if (students[i].id === 4567) {
//         matchingStudent = students[i];
//         break;
//     }
// }
// console.log('Matching student:', matchingStudent);

// console.log('Does students include a student with ID 4567?:', includes4567);

// Loose equality: ==
// Strict equality: ===

// console.log('Does "1" == 1', "1" == 1);
// console.log('Does "1" === 1', "1" === 1);

// const includesDaniel = students.find(student => {
//     return student.firstName.startsWith('Dan');
// });
// console.log('Does students include a student that has a firstName starting with Dan?:', includesDaniel);

/**
 * To separate out functionality into separate files, node has the concept of "modules".
 * A module is a an object containing a collection of "exported" data. That data can be
 * objects, arrays, functions, strings, clasess, etc. These things are exported from one file and
 * imported in another, much like a #include in C++.
 */

const importedModule = require('./renamedFile');
console.log('Imported module contains:', importedModule);
console.log('Multiplying two numbers:', importedModule.multiplyTwoNumbers(3, 4));