class MapTreeIterator{
    constructor(data){
        this._data = data;
        this._cursor = 0;
    }
    next(){
        if(this._cursor < this._data.length){
            const value = this._data[this._cursor];
            this._cursor += 1;
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
