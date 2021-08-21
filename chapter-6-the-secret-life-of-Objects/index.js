function normalize(n) {
    console.log(this.coords.map(e => e / this.length));
    console.log(n);
}

normalize.call({ coords: [0, 2, 3], length: 5 }, 3)
// [ 0, 0.4, 0.6 ]
// 3

console.log(Object.getPrototypeOf({}) === Object.prototype);
// true

console.log(Object.getPrototypeOf(Object.prototype));
// null

console.log(Object.getPrototypeOf(Math.max) === Function.prototype);
// true

console.log(Object.getPrototypeOf([]) === Array.prototype);
// true

let protoRabbit = {
    speak(line) {
        console.log(`The ${this.type} rabbit says ${line}`);
    }
}

let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = 'killer';
killerRabbit.speak('SKREEE!');
// The killer rabbit says SKREEE!

// Contructor rabbit 
function makeRabbit(type) {
    const rabbit = Object.create(protoRabbit);
    rabbit.type = type;
    return rabbit;
}

function Rabbit(type){
    this.type = type;
}

Rabbit.prototype.speak = function(line) {
    console.log(`The ${this.type} rabbit says ${line}`);
}

let weirdRabbit = new Rabbit("weird");

console.log(Rabbit.prototype)
// { speak: [Function (anonymous)] }

console.log(Object.getPrototypeOf(Rabbit) === Function.prototype);
// true

console.log(Object.getPrototypeOf(weirdRabbit) === Rabbit.prototype);

class Crabbit {
    constructor(type) {
        this.type = type;
    }
    speak(line) {
        console.log(`The ${this.type} rabbit says ${line}`);
    }
}

const killerRabbitC = new Crabbit("killer");
const blackRabbit = new Crabbit("black");

let object = new class { getWord() { return "Hello!" } };
console.log(object.getWord());
// Hello!

/**
 * Overriding Derived Properties
 */

Crabbit.prototype.teeth = "small";
console.log(killerRabbitC.teeth);
// small

killerRabbitC.teeth = "long, sharp, and bloody";
console.log(killerRabbitC.teeth);
// long, sharp, and bloody

console.log(blackRabbit.teeth);
// small

console.log(Crabbit.prototype.teeth);
// small

console.log(Array.prototype.toString === Object.prototype.toString);
// false

console.log([1, 2].toString());
// 1,2

console.log(Object.prototype.toString.call([1, 2]));
// [object Array]


/**
 * MAPS
 */

let ages = {
    Boris: 39,
    Liang: 22,
    Júlia: 62
}

console.log(`Júlia is ${ages["Júlia"]}`);
// Júlia is 62
console.log("Is Jack's age known?", "Jack" in ages);
// Is Jack's age known? false
console.log("Is toString's age known?", "toString" in ages);
// Is toString's age known? true

console.log("toString" in Object.create(null));
// false

/**
 * 
let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get("Júlia")}`);
// Júlia is 62
console.log("Is Jack's age known?", ages.has("Jack"));
// Is Jack's age known? false
console.log(ages.has("toString"));
// false
 */

console.log({x : 1}.hasOwnProperty("x"));
// true
console.log({x: 1}.hasOwnProperty("toString"));
// false

/**
 * Polimorphism
 */

Crabbit.prototype.toString =  function() {
    return `a ${this.type} rabbit`;
}

console.log(String(blackRabbit));
// a black rabbit

/**
 * Symbols
*/

const sym = Symbol("name");
console.log(sym == Symbol("name"));
// false

Crabbit.prototype[sym] = 55;
console.log(blackRabbit[sym]);
// 55

const toStringsymbol = Symbol("toString");
Array.prototype[toStringsymbol] = function() {
    return `${this.length} cm of blue yarn.`;
}

console.log([1, 2].toString());
// 1,2

console.log([1, 2][toStringsymbol]());
// 2 cm of blue yarn.

let stringObject = {
    [toStringsymbol]() {
        return "A jute ropet";
    }
}

console.log(stringObject[toStringsymbol]());
// A jute ropet

/**
 * The iterator interface
 */

let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// { value: 'O', done: false }
console.log(okIterator.next());
// { value: 'K', done: false }
console.log(okIterator.next());
// { value: undefined, done: true }

class Matrix {
    constructor(width, heigth, element = (x, y) => undefined) {
        this.width = width;
        this.heigth = heigth;
        this.content = [];

        for (let y = 0; y < heigth; y++) {
            for (let x = 0; x < width; x++) {
                this.content[y * width + x] = element(x, y);
            }
        } 
    }

    get(x, y) {
        return this.content[y * this.width + x];
    }

    set(x, y, value) {
        this.content[y * this.width + x] = value;
    }
}


class MatrixIterator {
    constructor(matrix) {
        this.x = 0;
        this.y = 0;
        this.matrix = matrix;
    }

    next() {
        if (this.y === this.matrix.heigth) return { done: true };

        let value = {
            x: this.x,
            y: this.y,
            value: this.matrix.get(this.x, this.y),
        };

        this.x++;

        if (this.x === this.matrix.width) {
            this.x = 0;
            this.y++;
        }
        return { value, done: false };
    }
}

Matrix.prototype[Symbol.iterator] = function() {
    return new MatrixIterator(this);
}

let matrix = new Matrix(2, 2, (x, y) => `value ${x} ${y}`);

for(let { x, y, value } of matrix) {
    console.log(x, y, value);
}

/**
 *  0 0 value 0 0
    1 0 value 1 0
    0 1 value 0 1
    1 1 value 1 1
 */

/**
 * Getter, Setters and Statics
 */

let varyingSizes = {
    get size() {
        return Math.floor(Math.random() * 100);
    }
}

console.log(varyingSizes.size);
// 96
console.log(varyingSizes.size);
// 88

class Temperature {
    constructor(celcius) {
        this.celcius = celcius;
    }

    get fahrenheit() {
        return this.celcius * 1.8 + 32;
    }

    set fahrenheit(value) {
        this.celcius = (value - 32) / 1.8;
    }

    static fromFahrenheit(value) {
        return new Temperature((value - 32) / 1.8);
    }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// 71.6
temp.fahrenheit = 86;
console.log(temp.celcius);
// 30

const tempFromFahrenheit = Temperature.fromFahrenheit(86);
console.log(tempFromFahrenheit.celcius);
// 30

/**
 * Inheritance
 */

class SymetricMatrix extends Matrix {
    constructor(size, element = (x, y) => undefined) {
        super(size, size, (x, y) => {
            if (x < y) return element(y, x);
            else return element(x, y);
        });
    }

    set (x, y, value) {
        super.set(x, y, value);
        if (x !== y) {
            super.set(y, x, value);
        }
    }
}

let symetricMatrix = new SymetricMatrix(5, (x, y) => `${x} ${y}`);

console.log(symetricMatrix.get(2, 3));
// 3 2

console.log(symetricMatrix.get(3, 2));
// 3 2


/**
 * The instance of operator 
 */

console.log(
    new SymetricMatrix(2) instanceof SymetricMatrix
);
// true

console.log(
    new SymetricMatrix(2) instanceof Matrix
);
// true

console.log(
    new Matrix(2, 2) instanceof SymetricMatrix
);
// false

console.log(
    [1] instanceof Array
);
// true