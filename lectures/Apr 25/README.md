## April 25 Lecture: MongoDB

This lecture's source code removes MySQL and replaces it with MongoDB. While MongoDB
is not designed to be a 1-1 replacement for MySQL (one is relational while the other
is not), this example repo does show the power of an MVC architecture. The app already
supported a few operations: create a user, authenticate, get currently logged in user,
etc. You can imagine a scenario where you were told to swap out the underlying database
(for example, the original had costs that were far too high). In the event that happens,
then with an MVC architecture, the only files you _should_ have to update are the models,
which are what interact with your DB of choice. Core business logic does not have to change,
so your controllers stay the same. Your routes also do not need change, so the View
stays consistent. What changes is the database that stores + supplies this data.

This uses an ORM called [Mongoose](https://mongoosejs.com/) to interact with the MongoDB
instance. Mongoose lets you define "schemas"; even though MongoDB works just fine with no
schema structure whatsoever, it can be helpful to define _some_ amount of structure to your
models, and that's where Mongoose comes in. Mongoose lets you define `schemas`, which 
define the "shape" of a document (keys + datatypes). Those schemas can then be used to
create mongoose `models`, which help with document management. YOUR models can then use
those mongoose models to interact with the DB in a clean way, with no other external
changes visible to the rest of the app or a client.