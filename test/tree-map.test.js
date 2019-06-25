const chai = require("chai");
const expect = chai.expect;
const MapTree = require("../");
const {MapTreeIterator} = MapTree;

// Tester

describe("tree-map", function(){
    describe("constructor", function(){
        it("should instantiate", function(){
            const tm = new MapTree();
            expect(tm).to.a("object");
            expect(tm).to.instanceof(MapTree);
            expect(tm.size).to.equal(0);
        });
        it("should instantiate with iterable", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm).to.a("object");
            expect(tm).to.instanceof(MapTree);
            expect(tm.size).to.equal(2);
            expect(tm.get("a")).to.equal(1);
            expect(tm.get("b")).to.equal(2);
        });
        it("should instantiate with child", function(){
            const tmc1 = new MapTree();
            const tmc2 = new MapTree();
            const tm = new MapTree(undefined, [tmc1, tmc2]);
            expect(tm).to.a("object");
            expect(tm).to.instanceof(MapTree);
            expect(tm.size).to.equal(0);
            expect(tm.children.has(tmc1)).to.equal(true);
            expect(tm.children.has(tmc2)).to.equal(true);
        });
        it("should not instantiate with wrong child", function(){
            const tmc1 = {};
            expect(()=>new MapTree(undefined, [tmc1])).to.throw(TypeError);
        });
        it("should instantiate copy", function(){
            const tmc = new MapTree([["a", 1], ["b", 2]]);
            const tmo = new MapTree([["c", 3], ["d", 4]], [tmc]);
            const tm = new MapTree(tmo);
            expect(tm).to.a("object");
            expect(tm).to.instanceof(MapTree);
            expect(tm.size).to.equal(2);
            expect(tmo.children.has(tmc)).to.equal(true);
            expect(tm.children.has(tmc)).to.equal(true);
            expect(tm).to.not.equal(tmo);
            expect(tm.get("a", true)).to.equal(1);
            expect(tm.get("b", true)).to.equal(2);
            expect(tm.get("a")).to.equal(undefined);
            expect(tm.get("b")).to.equal(undefined);
            expect(tm.get("c")).to.equal(3);
            expect(tm.get("d")).to.equal(4);
        });
    });

    describe("size", function(){
        it("should return size", function(){
            const tm0 = new MapTree();
            expect(tm0.size).to.equal(0);
            const tm1 = new MapTree([["a", 1]]);
            expect(tm1.size).to.equal(1);
            const tm2 = new MapTree([["a", 1], ["b", 2]]);
            expect(tm2.size).to.equal(2);
        });
        it("should not replace size", function(){
            const tm = new MapTree();
            expect(tm.size).to.equal(0);
            tm.size = 99;
            expect(tm.size).to.equal(0);
        });
    });

    describe("children", function(){
        it("should get child", function(){
            const tmc1 = new MapTree();
            const tmc2 = new MapTree();
            const tm = new MapTree(undefined, [tmc1, tmc2]);
            expect(tm.children.size).to.equal(2);
            expect(Array.from(tm.children.values())[0]).to.equal(tmc1);
            expect(Array.from(tm.children.values())[1]).to.equal(tmc2);
        });
        it("should set child", function(){
            const tmc1 = new MapTree();
            const tmc2 = new MapTree();
            const tm = new MapTree(undefined, [tmc1, tmc2]);
            expect(tm.children.size).to.equal(2);
            expect(Array.from(tm.children.values())[0]).to.equal(tmc1);
            expect(Array.from(tm.children.values())[1]).to.equal(tmc2);
            tm.children = [tmc2, tmc1, tmc2];
            expect(tm.children.size).to.equal(2);
            expect(Array.from(tm.children.values())[0]).to.equal(tmc2);
            expect(Array.from(tm.children.values())[1]).to.equal(tmc1);
        });
        it("should add child", function(){
            const tmc = new MapTree();
            const tm = new MapTree();
            expect(tm.children.size).to.equal(0);
            tm.children.add(tmc);
            expect(tm.children.size).to.equal(1);
            expect(Array.from(tm.children.values())[0]).to.equal(tmc);
        });
        it("should remove child", function(){
            const tmc = new MapTree();
            const tm = new MapTree(undefined, [tmc]);
            expect(tm.children.size).to.equal(1);
            expect(Array.from(tm.children.values())[0]).to.equal(tmc);
            tm.children.delete(tmc);
            expect(tm.children.size).to.equal(0);
        });
        it("should throw on incorrect child", function(){
            expect(()=>new MapTree(undefined, [null])).to.throw(TypeError);
            expect(()=>new MapTree(undefined, [undefined])).to.throw(TypeError);
            expect(()=>new MapTree(undefined, [NaN])).to.throw(TypeError);
            expect(()=>new MapTree(undefined, [{}])).to.throw(TypeError);
            expect(()=>new MapTree(undefined, [0])).to.throw(TypeError);
            expect(()=>new MapTree(undefined, [new Map()])).to.throw(TypeError);

            const tm = new MapTree();
            expect(()=>tm.children.add(null)).to.throw(TypeError);
            expect(()=>tm.children.add(undefined)).to.throw(TypeError);
            expect(()=>tm.children.add(NaN)).to.throw(TypeError);
            expect(()=>tm.children.add({})).to.throw(TypeError);
            expect(()=>tm.children.add(0)).to.throw(TypeError);
            expect(()=>tm.children.add(new Map())).to.throw(TypeError);
        });
    });

    describe("clear", function(){
        it("should clear", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.size).to.equal(2);
            tm.clear();
            expect(tm.size).to.equal(0);
        });
    });

    describe("delete", function(){
        it("should remove element", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.size).to.equal(2);
            expect(tm.get("a")).to.equal(1);
            expect(tm.get("b")).to.equal(2);
            tm.delete("a");
            expect(tm.get("a")).to.equal(undefined);
            expect(tm.get("b")).to.equal(2);
        });
        it("should return true if found", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.delete("a")).to.equal(true);
            expect(tm.delete("a")).to.equal(false);
            expect(tm.delete("b")).to.equal(true);
            expect(tm.delete("b")).to.equal(false);
        });
    });

    describe("entries", function(){
        it("should return iterator of elements", function(){
            const val = [["a", 1], ["b", 2]];
            const tm = new MapTree(val);
            expect(Array.from(tm.entries()).length).to.equal(2);
            expect(Array.from(tm.entries())).to.deep.equal(val);
            expect(tm.entries()).to.instanceof(MapTreeIterator);
            expect(tm.entries().next).to.instanceof(Function);
        });
        it("should return iterator of elements and traverse", function(){
            const valc = [["a", 1], ["b", 2]];
            const tmc = new MapTree(valc);
            const val = [["c", 3], ["d", 4]];
            const tm = new MapTree(val, [tmc]);
            expect(Array.from(tm.entries()).length).to.equal(2);
            expect(Array.from(tm.entries(true)).length).to.equal(4);
            expect(tm.entries()).to.instanceof(MapTreeIterator);
            expect(Array.from(tm.entries(true))).to.deep.equal(val.concat(valc));
        });
        it("should return iterator of elements, traverse and avoid clash", function(){
            const valc = [["a", 1], ["b", 2], ["e", 5]];
            const tmc = new MapTree(valc);
            const val = [["c", 3], ["d", 4], ["e", 6]];
            const tm = new MapTree(val, [tmc]);
            expect(Array.from(tm.entries()).length).to.equal(3);
            expect(Array.from(tm.entries(true)).length).to.equal(5);
            expect(Array.from(tm.entries(true))).to.deep.equal([["c", 3], ["d", 4], ["e", 6], ["a", 1], ["b", 2]]);
        });
        it("should return iterator of elements, traverse in breadth", function(){
            const val = [];
            const valc1 = [["a", 1], ["b", 2]];
            const valc2 = [["a", 3], ["b", 4], ["e", 5]];
            const valc12 = [["e", 6]];
            const tmc2 = new MapTree(valc2);
            const tmc12 = new MapTree(valc12);
            const tmc1 = new MapTree(valc1, [tmc12]);
            const tm = new MapTree(val, [tmc1, tmc2]);
            expect(Array.from(tm.entries()).length).to.equal(0);
            expect(Array.from(tm.entries(true)).length).to.equal(3);
            expect(Array.from(tm.entries(true))).to.deep.equal([["a", 1], ["b", 2], ["e", 5]]);
        });
    });

    describe("get", function(){
        it("should return element provided key", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.get("a")).to.equal(1);
            expect(tm.get("b")).to.equal(2);
            expect(tm.get("c")).to.equal(undefined);
        });

        it("should return element provided key with traverse", function(){
            const tmc11 = new MapTree([["h", 10]]);
            const tmc1 = new MapTree([["f", 7], ["g", 9]], [tmc11]);
            const tmc2 = new MapTree([["a", 1], ["b", 2], ["e", 5], ["f", 8]]);
            const tm = new MapTree([["c", 3], ["d", 4], ["e", 6]], [tmc1, tmc2]);
            expect(tm.get("a")).to.equal(undefined);
            expect(tm.get("b")).to.equal(undefined);
            expect(tm.get("c")).to.equal(3);
            expect(tm.get("d")).to.equal(4);
            expect(tm.get("e")).to.equal(6);
            expect(tm.get("f")).to.equal(undefined);
            expect(tm.get("g")).to.equal(undefined);
            expect(tm.get("h")).to.equal(undefined);
            expect(tm.get("i")).to.equal(undefined);

            expect(tm.get("a", true)).to.equal(1);
            expect(tm.get("b", true)).to.equal(2);
            expect(tm.get("c", true)).to.equal(3);
            expect(tm.get("d", true)).to.equal(4);
            expect(tm.get("e", true)).to.equal(6);
            expect(tm.get("f", true)).to.equal(7);
            expect(tm.get("g", true)).to.equal(9);
            expect(tm.get("h", true)).to.equal(10);
            expect(tm.get("i", true)).to.equal(undefined);
        });
    });

    describe("has", function(){
        it("should return if contains key", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.has("a")).to.equal(true);
            expect(tm.has("b")).to.equal(true);
            expect(tm.has("c")).to.equal(false);
        });

        it("should return if contains key with traverse", function(){
            const tmc11 = new MapTree([["h", 10]]);
            const tmc1 = new MapTree([["f", 7], ["g", 9]], [tmc11]);
            const tmc2 = new MapTree([["a", 1], ["b", 2], ["e", 5], ["f", 8]]);
            const tm = new MapTree([["c", 3], ["d", 4], ["e", 6]], [tmc1, tmc2]);
            expect(tm.has("a")).to.equal(false);
            expect(tm.has("b")).to.equal(false);
            expect(tm.has("c")).to.equal(true);
            expect(tm.has("d")).to.equal(true);
            expect(tm.has("e")).to.equal(true);
            expect(tm.has("f")).to.equal(false);
            expect(tm.has("g")).to.equal(false);
            expect(tm.has("h")).to.equal(false);
            expect(tm.has("i")).to.equal(false);

            expect(tm.has("a", true)).to.equal(true);
            expect(tm.has("b", true)).to.equal(true);
            expect(tm.has("c", true)).to.equal(true);
            expect(tm.has("d", true)).to.equal(true);
            expect(tm.has("e", true)).to.equal(true);
            expect(tm.has("f", true)).to.equal(true);
            expect(tm.has("g", true)).to.equal(true);
            expect(tm.has("h", true)).to.equal(true);
            expect(tm.has("i", true)).to.equal(false);
        });
    });

    describe("keys", function(){
        it("should return iterator of keys", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(Array.from(tm.keys()).length).to.equal(2);
            expect(Array.from(tm.keys())).to.deep.equal(["a", "b"]);
            expect(tm.keys()).to.instanceof(MapTreeIterator);
            expect(tm.keys().next).to.instanceof(Function);
        });
        it("should return iterator of keys and traverse", function(){
            const tmc = new MapTree([["a", 1], ["b", 2]]);
            const tm = new MapTree([["c", 3], ["d", 4]], [tmc]);
            expect(Array.from(tm.keys()).length).to.equal(2);
            expect(Array.from(tm.keys(true)).length).to.equal(4);
            expect(tm.keys()).to.instanceof(MapTreeIterator);
            expect(Array.from(tm.keys(true))).to.deep.equal(["c", "d", "a", "b"]);
        });
        it("should return iterator of keys, traverse and avoid clash", function(){
            const tmc = new MapTree([["a", 1], ["b", 2], ["e", 5]]);
            const tm = new MapTree([["c", 3], ["d", 4], ["e", 6]], [tmc]);
            expect(Array.from(tm.keys()).length).to.equal(3);
            expect(Array.from(tm.keys(true)).length).to.equal(5);
            expect(Array.from(tm.keys(true))).to.deep.equal(["c", "d", "e", "a", "b"]);
        });
        it("should return iterator of keys, traverse in breadth", function(){
            const val = [];
            const valc1 = [["a", 1], ["b", 2]];
            const valc2 = [["a", 3], ["b", 4], ["e", 5]];
            const valc12 = [["e", 6]];
            const tmc2 = new MapTree(valc2);
            const tmc12 = new MapTree(valc12);
            const tmc1 = new MapTree(valc1, [tmc12]);
            const tm = new MapTree(val, [tmc1, tmc2]);
            expect(Array.from(tm.keys()).length).to.equal(0);
            expect(Array.from(tm.keys(true)).length).to.equal(3);
            expect(Array.from(tm.keys(true))).to.deep.equal(["a", "b", "e"]);
        });
    });

    describe("set", function(){
        it("should set element", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(tm.size).to.equal(2);
            tm.set("b", 4);
            expect(tm.size).to.equal(2);
            tm.set("c", 3);
            expect(tm.size).to.equal(3);
            expect(tm.get("a")).to.equal(1);
            expect(tm.get("b")).to.equal(4);
            expect(tm.get("c")).to.equal(3);
        });
    });

    describe("values", function(){
        it("should return iterator of values", function(){
            const tm = new MapTree([["a", 1], ["b", 2]]);
            expect(Array.from(tm.values()).length).to.equal(2);
            expect(Array.from(tm.values())).to.deep.equal([1, 2]);
            expect(tm.values()).to.instanceof(MapTreeIterator);
            expect(tm.values().next).to.instanceof(Function);
        });
        it("should return iterator of values and traverse", function(){
            const tmc = new MapTree([["a", 1], ["b", 2]]);
            const tm = new MapTree([["c", 3], ["d", 4]], [tmc]);
            expect(Array.from(tm.values()).length).to.equal(2);
            expect(Array.from(tm.values(true)).length).to.equal(4);
            expect(tm.values()).to.instanceof(MapTreeIterator);
            expect(Array.from(tm.values(true))).to.deep.equal([3, 4, 1, 2]);
        });
        it("should return iterator of values, traverse and avoid clash", function(){
            const tmc = new MapTree([["a", 1], ["b", 2], ["e", 5]]);
            const tm = new MapTree([["c", 3], ["d", 4], ["e", 6]], [tmc]);
            expect(Array.from(tm.values()).length).to.equal(3);
            expect(Array.from(tm.values(true)).length).to.equal(5);
            expect(Array.from(tm.values(true))).to.deep.equal([3, 4, 6, 1, 2]);
        });
        it("should return iterator of values, traverse in breadth", function(){
            const val = [];
            const valc1 = [["a", 1], ["b", 2]];
            const valc2 = [["a", 3], ["b", 4], ["e", 5]];
            const valc12 = [["e", 6]];
            const tmc2 = new MapTree(valc2);
            const tmc12 = new MapTree(valc12);
            const tmc1 = new MapTree(valc1, [tmc12]);
            const tm = new MapTree(val, [tmc1, tmc2]);
            expect(Array.from(tm.values()).length).to.equal(0);
            expect(Array.from(tm.values(true)).length).to.equal(3);
            expect(Array.from(tm.values(true))).to.deep.equal([1, 2, 5]);
        });
    });

    describe("[Symbol.iterator]", function(){
        it("should return iterator", function(){
            const tm = new MapTree([["a", 1], ["b", 2], ["c", 3]]);
            const iterator = tm[Symbol.iterator]();
            expect(iterator).to.instanceof(MapTreeIterator);
            expect(iterator.next()).to.deep.equal({done: false, value: ["a", 1]});
            expect(iterator.next()).to.deep.equal({done: false, value: ["b", 2]});
            expect(iterator.next()).to.deep.equal({done: false, value: ["c", 3]});
        });
        it("should be iterable", function(){
            const tm = new MapTree([["a", 1], ["b", 2], ["c", 3]]);
            let iteration = 0;
            for(let [key, value] of tm){
                if(key === "a") expect(value).to.equal(1);
                if(key === "b") expect(value).to.equal(2);
                if(key === "c") expect(value).to.equal(3);
                iteration += 1;
            }
            expect(iteration).to.equal(3);
        });
    });

    describe("case study", function(){
        it("should be simple", function(){
            const foodMap = new MapTree([["steak", {value: 1}]]);

            const fruitMap = new MapTree();
            fruitMap.set("banana", {value: 2});
            fruitMap.set("apple", {value: 3});

            foodMap.children.add(fruitMap);
            foodMap.get("banana", true); // {value: 2}
            foodMap.has("steak"); // true
            foodMap.has("apple"); // false (not traversing)

            expect(foodMap.get("banana", true)).to.deep.equal({value: 2});
            expect(foodMap.has("steak")).to.deep.equal(true);
            expect(foodMap.has("apple")).to.deep.equal(false);
        });
    });
});
