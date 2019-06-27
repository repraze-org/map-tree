const symbols = {
    data:   Symbol("data"),
    cursor: Symbol("cursor")
};

class MapTreeIterator{
    constructor(data){
        this[symbols.data] = data;
        this[symbols.cursor] = 0;
    }
    next(){
        if(this[symbols.cursor] < this[symbols.data].length){
            const value = this[symbols.data][this[symbols.cursor]];
            this[symbols.cursor] += 1;
            return {
                value: value,
                done:  false
            };
        }
        return {value: undefined, done: true};
    }
    [Symbol.iterator](){
        return {
            next: this.next.bind(this)
        };
    }
}

module.exports = MapTreeIterator;
