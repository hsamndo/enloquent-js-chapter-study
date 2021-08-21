// Hight order functions

/**
 *
 * Abstraction function that repeat n times the action
 */
 function repeat(n, action) {
    for (let i = 0; i < n; i++) {
      action(i);
    }
  }
  
  /**
   *
   * Function that returns another functions
   */
  function greatherThan(n) {
    return (m) => m > n;
  }
  
  const greatherThanTen = greatherThan(10);
  
  greatherThanTen(100)
    ? console.log("It's greather than 10")
    : console.log("It is less than 10");
  
  /**
   *
   * Function that modifies another function
   */
  function noisy(f) {
    return (...args) => {
      console.log("Calling with args", args);
      const result = f(...args);
      console.log("Calling with Args:", args, "Result: ", result);
    };
  }
  
  noisy(Math.min)(1, 2, 3);
  
  // New type of control flow
  function unless(test, then) {
    if (!test) then();
  }
  
  repeat(3, (n) => {
    unless(n % 2 === 1, () => console.log(n, "is even"));
  });
  
  ["A", "B"].forEach((e) => console.log(e));
  

/**
 * Filter Function
 */

function filter(array, test) {
    let passed = [];
    for (let script of array) {
        if (test(script)) passed.push(script);
    }
    return passed;
}

const SCRIPTS = require("./scripts");

console.log(filter(SCRIPTS, (e) => e.living));
console.log(SCRIPTS.filter(e => e.direction === "ttb"));

/**
 * Map Function
 */

function map(array, modifier) {
    let mapped = [];
    for (let script of array) {
        mapped.push(modifier(script));
    }
    return mapped;
}

let rtlScrips = SCRIPTS.filter(e => e.direction === "rtl");
console.log(map(rtlScrips, e => e.name));

/**
 * Reduce Function
 */

function reduce(array, combine, initial) {
    let current = initial;
    for (let element of array) {
        current = combine(current, element);
    }
    return current;
}
console.log(reduce([1,2,3,4,5,6,7,8,9], (a, b) => a + b, 0));
console.log([1,2,3,4,5,6,7,8,9].reduce((a, b) => a + b));

/**
 * Find the script with the most characters
 */
function countCharacters(script) {
    return script.ranges.reduce((count, [to, from]) => {
        return count + (from - to);
    }, 0);
}

console.log(
    SCRIPTS.reduce((a, b) => {
        return countCharacters(b) > countCharacters(a) ? b : a;
    })
);


let biggest = null;
for (let script of SCRIPTS) {
    if (biggest == null || countCharacters(biggest) < countCharacters(script))
        biggest = script;
}
console.log(biggest);

/**
 * Composability
 */
function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

console.log(
    Math.round(average(SCRIPTS.filter(e => e.living).map(e => e.year)))
);
console.log(
    Math.round(average(SCRIPTS.filter(e => !e.living).map(e => e.year)))
);

let total = 0, count = 0;
for (let element of SCRIPTS) {
    if (element.living) {
        total += element.year;
        count += 1;
    }
}
console.log(Math.round(total / count));

/**
 * String and Character Codes
 */

function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from , to]) => {
            return code >= from && code < to;
        })) return script;
    }
    return null;
}

console.log(characterScript(121));


function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(e => e.name === name);
        if (known === -1) {
            counts.push({ name, count: 1 });
        } else {
            counts[known].count++;
        }
    }
    return counts;
}

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));

function textScripts(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : 'none';
    }).filter(({ name }) => name !== 'none');

    let total = scripts.reduce((n, { count }) => n + count, 0);
    if (total === 0) return 'No Script found';

    return scripts.map(({ name, count }) => {
        return `${Math.round(count * 100 / total)}% ${name}`;
    }).join(", ");
}

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
