const MapTreeIterator = require("./map-tree-iterator");
const createTypedSet = require("./typed-set");

class MapTree{
    constructor(iterable, children){
        if(iterable && iterable instanceof MapTree){
            this._map = new Map(iterable._map);
            this._children = new MapTreeSet(iterable._children);
        }else{
            this._map = new Map(iterable);
            this._children = new MapTreeSet(children);
        }
    }
    get size(){
        return this._map.size;
    }
    get children(){
        return this._children;
    }
    set children(children){
        this._children = new MapTreeSet(children);
    }
    clear(){
        this._map.clear();
    }
    delete(key){
        return this._map.delete(key);
    }
    _entryMap(traverse = false){
        if(traverse && this._children.size){
            const entryMap = new Map(this._map);
            const nextChildren = Array.from(this._children);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                current._map.forEach((value, key)=>{
                    if(!entryMap.has(key)){
                        entryMap.set(key, value);
                    }
                });
                if(current._children.size > 0){
                    nextChildren.push(...Array.from(current._children));
                }
            }
            return entryMap;
        }else{
            return new Map(this._map.entries());
        }
    }
    entries(traverse = false){
        return new MapTreeIterator(Array.from(this._entryMap(traverse)));
    }
    get(key, traverse = false){
        let obj = this._map.get(key);
        if(obj === undefined && traverse && this._children.size){
            const nextChildren = Array.from(this._children);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                obj = current._map.get(key);
                if(obj !== undefined)break;
                if(current._children.size > 0){
                    nextChildren.push(...Array.from(current._children));
                }
            }
        }
        return obj;
    }
    has(key, traverse = false){
        if(this._map.has(key)){
            return true;
        }
        if(traverse && this._children.size){
            const nextChildren = Array.from(this._children);
            while(nextChildren.length !== 0){
                const current = nextChildren.shift();
                if(current._map.has(key)) return true;
                if(current._children.size > 0){
                    nextChildren.push(...Array.from(current._children));
                }
            }
        }
        return false;
    }
    keys(traverse = false){
        return new MapTreeIterator(Array.from(this._entryMap(traverse).keys()));
    }
    set(key, value){
        this._map.set(key, value);
        return this;
    }
    values(traverse = false){
        return new MapTreeIterator(Array.from(this._entryMap(traverse).values()));
    }
    [Symbol.iterator](){
        return this.entries(true);
    }
}

const MapTreeSet = createTypedSet(MapTree);

module.exports = MapTree;
