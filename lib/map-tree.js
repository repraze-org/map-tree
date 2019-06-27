const MapTreeIterator = require("./map-tree-iterator");
const createTypedSet = require("./typed-set");

const symbols = {
    map:        Symbol("map"),
    children:   Symbol("children"),
    entryMapFn: Symbol("children")
};

class MapTree{
    constructor(iterable, children){
        if(iterable && iterable instanceof MapTree){
            this[symbols.map] = new Map(iterable[symbols.map]);
            this[symbols.children] = new MapTreeSet(iterable[symbols.children]);
        }else{
            this[symbols.map] = new Map(iterable);
            this[symbols.children] = new MapTreeSet(children);
        }
    }
    [symbols.entryMapFn](traverse = false){
        if(traverse && this[symbols.children].size){
            const entryMap = new Map(this[symbols.map]);
            const nextChildren = Array.from(this[symbols.children]);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                current[symbols.map].forEach((value, key)=>{
                    if(!entryMap.has(key)){
                        entryMap.set(key, value);
                    }
                });
                if(current[symbols.children].size > 0){
                    nextChildren.push(...Array.from(current[symbols.children]));
                }
            }
            return entryMap;
        }else{
            return new Map(this[symbols.map].entries());
        }
    }
    get size(){
        return this[symbols.map].size;
    }
    get children(){
        return this[symbols.children];
    }
    set children(children){
        this[symbols.children] = new MapTreeSet(children);
    }
    clear(){
        this[symbols.map].clear();
    }
    delete(key){
        return this[symbols.map].delete(key);
    }
    entries(traverse = false){
        return new MapTreeIterator(Array.from(this[symbols.entryMapFn](traverse)));
    }
    forEach(callbackFn, traverse, thisArg){
        if(typeof callbackFn !== "function"){
            throw new TypeError(`${callbackFn} is not a function`);
        }
        const map = this[symbols.entryMapFn](traverse);
        const callbackUsed = thisArg === undefined ? callbackFn : callbackFn.bind(thisArg);
        map.forEach(child=>callbackUsed(child[1], child[0], this));
    }
    get(key, traverse = false){
        let obj = this[symbols.map].get(key);
        if(obj === undefined && traverse && this[symbols.children].size){
            const nextChildren = Array.from(this[symbols.children]);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                obj = current[symbols.map].get(key);
                if(obj !== undefined)break;
                if(current[symbols.children].size > 0){
                    nextChildren.push(...Array.from(current[symbols.children]));
                }
            }
        }
        return obj;
    }
    has(key, traverse = false){
        if(this[symbols.map].has(key)){
            return true;
        }
        if(traverse && this[symbols.children].size){
            const nextChildren = Array.from(this[symbols.children]);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                if(current[symbols.map].has(key)) return true;
                if(current[symbols.children].size > 0){
                    nextChildren.push(...Array.from(current[symbols.children]));
                }
            }
        }
        return false;
    }
    keys(traverse = false){
        return new MapTreeIterator(Array.from(this[symbols.entryMapFn](traverse).keys()));
    }
    set(key, value){
        this[symbols.map].set(key, value);
        return this;
    }
    values(traverse = false){
        return new MapTreeIterator(Array.from(this[symbols.entryMapFn](traverse).values()));
    }
    [Symbol.iterator](){
        return this.entries();
    }
}

const MapTreeSet = createTypedSet(MapTree);

module.exports = MapTree;
