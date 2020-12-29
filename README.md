# map-tree

[![npm](https://img.shields.io/npm/v/map-tree.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/map-tree)
[![GitHub Workflow CI Status](https://img.shields.io/github/workflow/status/repraze-org/map-tree/CI?logo=github&style=flat-square)](https://github.com/repraze-org/map-tree/actions?query=workflow%3ACI)
[![Codecov](https://img.shields.io/codecov/c/github/repraze-org/map-tree.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/repraze-org/map-tree)
[![GitHub](https://img.shields.io/github/license/repraze-org/map-tree.svg?logo=github&style=flat-square)](https://github.com/repraze-org/map-tree)
[![npm](https://img.shields.io/npm/dm/map-tree.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/map-tree)

MapTree structure, allows Maps to lookup elements in its Map children in a BFS way.

- Solves Map inheritance
- Allows overrides by setting keys on parents
- Similar interface to the Map you love
- Uses Map and Set under the hood to keep lookups and changes fast
- Fundamental algorithm used is [Breadth-first search (BSF)](https://en.wikipedia.org/wiki/Breadth-first_search)
- Does not test for cycles, thus does not support graphs
- Dependency free

## Installation

    npm install map-tree --save

## Usage

```javascript
const MapTree = require("map-tree");

const foodMap = new MapTree([["steak", { value: 1 }]]);

const fruitMap = new MapTree();
fruitMap.set("banana", { value: 2 });
fruitMap.set("apple", { value: 3 });

foodMap.children.add(fruitMap);
foodMap.get("banana", true); // {value: 2}
foodMap.has("steak"); // true
foodMap.has("apple"); // false (not traversing)

for (let [key, value] of foodMap.entries(true)) {
  // will traverse children too!
}
```

## Syntax

```javascript
new MapTree([iterable [, children]]);
```

- **iterable** : Array or iterable object of key-value pairs.

- **children** : Array or iterable object of MapTree objects defining the children of the new object.

## Properties

- **Map.prototype.size** : Returns the number of key/value pairs in the MapTree object. It does not include children.

- **Map.prototype.children** : Returns the MapTree children Set. The Set can be changed to add/remove/clear children. Property can be set provided an array or iterable object of MapTree objects to replace all children.

## Methods

- **Map.prototype.clear()** : Removes all key/value pairs from the MapTree object. Does not clear the children.

- **Map.prototype.delete(key)** : Removes element from MapTree and returns true if the element did not exist, or false if the element did not. It will not delete from the children.

- **Map.prototype.entries(\[traverse\])** : Returns a new Iterator object that contains an array of [key, value] for each element in the MapTree object in insertion order. If traverse is true, the Iterator will include children [key, value] in a BFS order.

- **Map.prototype.forEach(callbackFn \[, traverse \[, thisArg\]\])** : Calls callbackFn once for each key-value pair present in the MapTree object, in insertion order. If traverse is true, key-value pair present in children will be provided in BFS order. If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.

- **Map.prototype.get(key\[, traverse\])** : Returns the value associated to the key, or undefined if there is none. If traverse is true, the key will be matched with children in BFS order.

- **Map.prototype.has(key\[, traverse\])** : Returns a boolean asserting whether a value has been associated to the key in the MapTree object or not. If traverse is true, the key will be matched with children in BFS order.

- **Map.prototype.keys(\[traverse\])** : Returns a new Iterator object that contains the keys for each element in the MapTree object in insertion order. If traverse is true, the Iterator will include children keys in a BFS order.

- **Map.prototype.set(key, value)** : Sets the value for the key in the MapTree object. Returns the MapTree object.

- **Map.prototype.values(\[traverse\])** : Returns a new Iterator object that contains the values for each element in the MapTree object in insertion order. If traverse is true, the Iterator will include children values in a BFS order.

- **Map.prototype\[\@\@iterator\]()** : Returns a new Iterator object that contains an array of [key, value] for each element in the MapTree object in insertion order. It does not include children.
