function createTypedSet(cls){
    return class TypedSet extends Set{
        constructor(iterator){
            if(iterator && typeof iterator[Symbol.iterator] === "function"){
                Array.from(iterator).forEach(value=>{
                    if(!(value instanceof cls)){
                        throw new TypeError(`Value ${value} is not of type MapTree`);
                    }
                });
            }
            super(iterator);
        }
        add(value){
            if(!(value instanceof cls)){
                throw new TypeError(`Value ${value} is not of type MapTree`);
            }
            super.add(value);
        }
    };
}

module.exports = createTypedSet;
