/**
 * At this point, we now know the basic fundamentals of JS. Objects, functions, arrays, etc.
 * Next we're going to learn a bit about how to use third party libraries to connect to
 * a database and execute some queries.
 * 
 * First, we need to understand the node runtime environment. So far, we've just dealt with
 * Javascript as a language. The building blocks apply to JS that runs in the browser as well
 * as JS that runs in a CLI environment.
 * 
 * Node specifically is a JS environment meant to run on a server. As such, it has a slew of
 * helpful built-in libraries for doing things like file I/O, network calls, and more.
 * One of the most commonly used built-in package is the filesystem package, or "fs" for short.
 * 
 * Link to documentation: https://nodejs.org/api/fs.html
 * 
 * If we want to read a file, we need to bring that package into our script.
 */

const fs = require('fs');

/**
 * Looking at the documentation there are three ways to read a file:
 * 1. Synchronously
 * 2. Through callbacks
 * 3. Through promises
 * 3b. Through async / await
 * 
 * Let's go through each one and learn what they do.
 */

/**
 * Synchronous file reading will be the most familiar. When you load a file synchronously,
 * the program starts reading the file, and the next line won't execute until the file is
 * loaded. This is what you're familiar with from Java / C++.
 */

const fileContents = fs.readFileSync('./data-to-load.csv', { encoding: 'utf-8' });
console.log(fileContents.toString());

/**
 * You _could_ do line by line reading, but typically you do that in the JS layer with
 * helpful string utility functions
 */
const lineByLineData = fileContents.split('\n');
console.log('Line by line data:', lineByLineData);

/**
 * That's certainly functional, but there's a drawback. readFileSync forces your CPU
 * to wait until that function finishes before continuing execution of your program,
 * or more specifically for node, it has to wait until that file is loaded before being
 * able to handle other requests. If you're handling thousands of requests, that's a
 * huge bottleneck.
 * 
 * So what is there for us to do? Remember, ideally anything related
 * to input / output gets federated out to a thread. Without getting into the weeds, what
 * we want is for our program to _spawn a thread_ to load data, which takes a while, and
 * continue to let the CPU work on other stuff. That's where the callback function comes
 * in. As the programmer, you can specify that you want to load something. When the result
 * comes in, you specify a "callback function" that gets called _when the I/O has finished_.
 * The readFile function thus "calls back" your provided handler function to say "hey,
 * here's your data". Following the logic can be a bit tricky though, so here's the same
 * example.
 * 
 * Take a look at the documentation: https://nodejs.org/api/fs.html#fsreadfilepath-options-callback.
 * We see that readFile is expecting a callback function that takes two arguments: an error
 * and a data field. If something goes wrong, the error argument will be filled.
 * If it's all good, then data will contain the contents of the file. Let's build that out.
 */

const callbackFunction = (err, data) => {
    if (err) {
        console.error('Uh oh, there was an error', err);
        return;
    }
    console.log('Nice, here is the contents of the file through a callback:\n', data);
}

// Nice, now let's use it
fs.readFile('./data-to-load.csv', { encoding: 'utf-8' }, callbackFunction);

/**
 * readFile kicks off a thread to read the file from disk. At _some point in the nebulous future_,
 * the thread will have read the file into memory. When that happens, the provided callbackFunction
 * gets... called back to handle the result (either positive or negative). The great thing is
 * the program keeps going
 */
console.log('This log was written after the readFile, but will likely print before the file is loaded');

/**
 * In most cases, the log above will print first. We can reuse the callback function multiple
 * times to load multiple files. Let's try to load a file that doesn't exist
 */
fs.readFile('./file-that-doesnt exist', { encoding: 'utf-8' }, callbackFunction);

/**
 * Depending on the speed of file I/O and other external variables, you may see both the console.log
 * AND the error before the valid file reading finishes. Threads!
 * 
 * Callback functions were (and still are) widely used, but they can be hard to reason through because
 * you might end up in what's called "callback hell" or a "callback pyramid". For example, let's say
 * we want to load a couple files one after the other.
 */

fs.readFile('./data-to-load.csv', { encoding: 'utf-8' }, (err1, csvData) => {
    console.log('Done loading first file', csvData);
    fs.readFile('./package.json', { encoding: 'utf-8' }, (err2, packageJsonData) => {
        console.log('Done loading second file', packageJsonData);
        // Keep going!
    })
});

/**
 * As you continue to use these asynchronous callback-style functions, you could end up
 * getting deeper and deeper and forming the so-called callback pyramid. The spaghetti code is cooking
 * for sure.
 * 
 * We could organize it better by defining an "exit callback" back at the root level.
 */

const exitCallback = (file1, file2) => {
    console.log('In the exit callback, now I can use file1 and file2');
}

fs.readFile('./data-to-load.csv', { encoding: 'utf-8' }, (err1, csvData) => {
    console.log('Done loading first file', csvData);
    fs.readFile('./package.json', { encoding: 'utf-8' }, (err2, packageJsonData) => {
        console.log('Done loading second file', packageJsonData);
        exitCallback(csvData, packageJsonData);
    })
});

/**
 * That's a little better, we now have an escape path out of the pyramid. But it's odd that we
 * define the function to process the result BEFORE the loading itself. Sometimes that's intentional,
 * sometimes that's confusing.
 * 
 * Now let's take a look at the next kind of asynchronous style of functions: promises.
 * A promise represents a function that eventually will be "fulfilled" with either a "resolution"
 * or "rejection". In the case of a successful function call, it will "resolve" with a result.
 * In the case of a failed function call, it will "reject" with an error. You as a programmer
 * can handle both cases. 
 * 
 * The flow here is that you kick off a promise. That promise will "then" resolve to a value,
 * or reject with an error you "catch". Those two terms are important, as those are the names of
 * the functions you use.
 * 
 * Here's the link to the function we will use: https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
 */
const fsPromises = require('fs/promises');
fsPromises.readFile('./data-to-load.csv', { encoding: 'utf-8' })
.then((csvData) => {                            // This is a function that only accepts a resolved function
    console.log('CSV data within a promise:\n', csvData);
}).catch((err) => {                             // This is a function that only accepts a rejected error
    console.err('There was a problem reading the file:', err);
});

/**
 * The .catch() is technically optional, but good practice to handle. You can do many promises back
 * to back in what's called a "promise chain", and through the use of closures, keep track of results
 */
let file1Result, file2Result;
fsPromises.readFile('./data-to-load.csv', { encoding: 'utf-8' })
 .then((csvData) => {
     file1Result = csvData;                        // Store the csvData, because it will go out of scope
     return fsPromises.readFile('./package.json'); // We return the next promise that we need to wait for...
 }).then((packageJsonResult) => {
     file2Result = packageJsonResult;              // And then handle the resolution
     console.log('Successfully waited on two promises back to back');
 });

 /**
  * The great thing is that we can chain many promises, and unlike callbacks where we end up with a
  * generally unappealing / complicated pyramid, here we only ever go "one layer deep".
  * 
  * So that was an improvement, but it's still not a "normal" way to think. We as engineers want
  * the benefits of asynchronous loading, but without having to reason our way through complicated
  * logic. We want something that _looks_ synchronous, yet is asynchronous. And that's where the
  * final style comes into play that is now the recommended way to write asynchronous code:
  * 
  * async / await.
  * 
  * Async await is syntactic sugar over promises (much like classes are syntactic sugar over closures).
  * When dealing with promises, you can avoid the mess of .then()'s and .catch()'s and write in a format
  * that's much more familiar: try / catch.
  */
let fileLoader = async () => {
    try {
        const result1 = await fsPromises.readFile('./data-to-load.csv', { encoding: 'utf8' });
        console.log('Result from an async await function:\n', result1);
    } catch (err) {
        console.error('There was a problem loading the file:', err);
    }
}

fileLoader();

/**
 * Couple of new keywords here. The fileLoader function is marked as "async", or asynchronous. This
 * tells the runtime that there will be some asynchronous things happening, in this case file loading.
 * More specifically, it tells the runtime that we will be using the await keyword to wait for
 * any number of promises to resolve within the function. Note that the return type of an async
 * function is ALWAYS a promise.
 * 
 * The great thing now is we can get the benefits of running multiple asynchronous operations without
 * writing weird exit callbacks or a bunch of then()'s and external variables. It looks more synchronous.
 */
fileLoader = async () => {
    try {
        const result1 = await fsPromises.readFile('./data-to-load.csv', { encoding: 'utf8' });
        const result2 = await fsPromises.readFile('./package.json', { encoding: 'utf8' });
        console.log('Successfully loaded two files back to back');
    } catch (err) {
        console.error('Something went wrong in my async function', err);
    }
}

fileLoader();

/**
 * You might think: wait, isn't that then back to square zero, and the CPU is awaiting these
 * promises before continuing to the next one like we saw with readFileSync? Yes and no:
 * it _looks_ like it's waiting, but that await keyword tells the runtime to go ahead and do
 * other things while it waits for the promise to resolve. Once it does, come back here.
 * 
 * So in general, prefer the async await keyword. Many third party libraries use Promises
 * to do anything complex or asynchronous. Anytime you see that word, then you can use
 * async await!
 */
