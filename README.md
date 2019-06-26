# map-tree

[![npm](https://img.shields.io/npm/v/map-tree.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/map-tree) [![Travis (.org)](https://img.shields.io/travis/repraze-org/map-tree.svg?logo=travis&style=flat-square)](https://travis-ci.org/repraze-org/micromand) [![Codecov](https://img.shields.io/codecov/c/github/repraze-org/map-tree.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/repraze-org/map-tree)

MapTree structure, allows Maps to lookup elements in its Map children in a BFS way.

-   Solves Map inheritance
-   Allows overrides by setting keys on parents
-   Similar interface to the Map you love
-   Uses Map and Set under the hood to keep lookups and changes fast
-   Fundamental algorithm used is [Breadth-first search (BSF)](https://en.wikipedia.org/wiki/Breadth-first_search)

## Installation

    npm install map-tree --save

## Usage

```javascript
const MapTree = require("map-tree");

const foodMap = new MapTree([["steak", {value: 1}]]);

const fruitMap = new MapTree();
fruitMap.set("banana", {value: 2});
fruitMap.set("apple", {value: 3});

foodMap.children.add(fruitMap);
foodMap.get("banana", true); // {value: 2}
foodMap.has("steak"); // true
foodMap.has("apple"); // false (not traversing)
```

## Syntax

```javascript
new MapTree([iterable [, children]]);
```

-   **iterable** : Array or iterable object of key-value pairs.
-   **children** : Array or iterable object of MapTree objects defining the children of the new object.

## Properties

-   **Map.prototype.size** : Returns the number of key/value pairs in the MapTree object without traversing.
-   **Map.prototype.children** : Returns the MapTree children Set. The Set can be changed to add/remove/clear children. Property can be set provided an array or iterable object of MapTree objects to replace all children.

## Methods

-   **Map.prototype.clear()** : TODO
-   **Map.prototype.delete(key)** : TODO
-   **Map.prototype.entries(\[traverse\])** : TODO
-   **Map.prototype.forEach(callbackFn \[, traverse \[, thisArg\]\])** : TODO
-   **Map.prototype.get(key\[, traverse\])** : TODO
-   **Map.prototype.has(key\[, traverse\])** : TODO
-   **Map.prototype.keys(\[traverse\])** : TODO
-   **Map.prototype.set(key, value)** : TODO
-   **Map.prototype.values(\[traverse\])** : TODO
-   **Map.prototype\[\@\@iterator\]()** : TODO
