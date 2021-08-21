/**
 * Iterable Groups
 *
 * Make the group class from the previous exercise iterable. Refer to the section
 * about the iterator interface earlier in the chaper if you aren´t clear on the exact
 * form of the interface anymore.
 *
 * If you used an array to represent the group´s member, don´t just return the iterator created
 * by calling the Symbol.iterator method on the array. That would work, but it defeats the
 * purpose of this exercise.
 *
 * It is okay if your iterator behaves strangely when the group is modified during iteration.
 */

class Group {
  constructor(content = []) {
    this.content = content;
  }

  add(num) {
    this.content.push(num);
  }

  delete(num) {
    const newElements = [];
    for (let elem of this.content) {
      if (num !== elem) newElements.push(elem);
    }
    this.content = newElements;
  }

  has(num) {
    for (let elem of this.content) {
      if (num === elem) return true;
    }
    return false;
  }

  static from(obj) {
    return new Group(obj);
  }
}

class GroupIterator {
  constructor(group) {
    this.x = 0;
    this.group = group;
  }

  next() {
    if (this.x === this.group.content.length) return { done: true };
    let value = this.group.content[this.x];
    this.x++;
    return { value, done: false };
  }
}

Group.prototype[Symbol.iterator] = function () {
  return new GroupIterator(this);
};

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}

/**
 * a
 * b
 * c
 */
