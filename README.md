# TypedObject

Create strict, strongly-typed JavaScript objects

Object literials often just don't cut it for large scale JavaScript applications, and during development we may want the peace of mind that comes with strongly-typed languages, whether we're simply trying to catch typos or creating public APIs and interfaces.

Thankfully, various lesser-known native features already exist to provide us with the ability to create much stricter constructs within vanilla ES5 JavaScript - without having to resort to higher-level abstractions such as TypeScript.

The `TypedObject` constructor uses these features to effortlessly generate strict, strongly-typed objects, ideal for data storage and transport within large scale client-side or server-side applications.

## Examples

### Instantiation with Schema Definition

```js
'use strict';

var TypedObject = require('typed-object');

// Define properties and types

var product = new TypedObject({
    price: -1,
    currency: '',
    name: '',
    images: [],
    isOwned: false
});
```

We recommend setting typical "falsy"/empty values as defaults to typecast the object's properties while creating a visual schema. However, properties may be set to any value by default.

### Property Assignment

Once the TypedObject has been instantiated, its properties may be set as normal:

```js
// Example good assignments:

product.price       = 9.99; // OK
product.currency    = 'USD'; // OK
product.isOwned     = true; // OK

console.log(product.price) // 9.99
console.log(product.currency) // 'USD'
console.log(product.isOwned) // true
```

The fun starts when a property is badly assigned as a TypeError will be thrown:

```js
// Example bad assignments:

product.price       = '$9.99' // Uncaught TypeError: Can't set property <TypedObject>.price, type "string" is not assignable to type "number"
product.images      = new Image() // Uncaught TypeError: Can't set property <TypedObject>.images, type "object" is not assignable to type "array"
product.isOwned     = 'TRUE'; // Uncaught TypeError: Can't set property <TypedObject>.isOwned, type "string" is not assignable to type "boolean"
```

### Non-extensibility

Additonally, if properties are extended onto the object that are not defined in the initial schema, a TypeError will also be thrown (if we are in ES5 "strict mode"):

```js
// Example bad extension:

product.discount    = '0.5'; // Uncaught TypeError: Can't add property discount, object is not extensible
```

### Methods

As TypedObjects are designed for lightweight, temporary data storage and transport, they do not accept methods/function assignments by design, and a TypeError will be thrown if any methods are included in the schema. A more robust constructor/prototype pattern or ES6 class would be better in these situations.

```js
// Example bad definition:

var product = new TypedObject({
    buy: function() { ... }
});

// Uncaught TypeError: Can't define method <TypedObject>.buy, methods are not permitted on typed objects
```

### Full Data Retrieval

While data may be retrieved from individual properties via ES5 getters as shown in the above example, we may want to inspect the object as a whole for debugging.

Because the inner workings of a TypedObject hide the internal properties for safety, console.logging the object will not expose its data. For these cases, we can use the built-in `toObject` method, which will return a new object literal containing the TypedObject's data.

```js

console.log(product.price); // 9.99

// Individual properties may be accessed as normal.

console.log(product);

// {
//   price (...)
//   get price function()
//   set price function(value)
//   ...
// }

// When the whole TypedObject is inspected directly however, we only see
// the internal getters and setters of the object. In these cases, we can use the
// TypedObject's "toObject" method to output an object literal containing all data:

console.log(product.toObject());

// {
//    price: 9.99,
//    currency: 'USD',
//    name: '',
//    images: [],
//    isOwned: true
// }
```

## Compatibility

TypedObjects are compatible with any ES5 implementation. That means IE9 and up, plus all other major browsers, and all server-side JavaScript implementations.

Module support for AMD and CommonJS is included, as well as the ability to load the TypedObject class as a global variable via a script tag.
