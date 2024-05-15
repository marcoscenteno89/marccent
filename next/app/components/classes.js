import { post } from '@marccent/util';

class CssClass {
  constructor() {
    this.list = this.checkData(arguments);
  }

  add() {
    const arr = Array.from(arguments);
    for (let i of arr) {
      if (!this.list.includes(i)) this.list.push(i);
    }
    return this;
  }

  checkData(arg) {
    let list;
    if (arg.length === 1) {
      arg = arg[0];
      if (!arg) return list = []
      if (typeof arg === 'string') {
        if (arg.includes(' ')) {
          list = arg.split(' ');
        } else if (arg.includes(',')) {
          list = arg.split(',');
        } else {
          list = [arg]
        }
      } 
  
      if (typeof arg === 'object') list = arg;

    } else {
      list = Array.from(arg);
    }
     
    return list;
  }

  remove() {
    const arr = Array.from(arguments);
    this.list = this.list.filter(item => !arr.includes(item));
    return this;
  }

  print() {
    return this.list.join(' ');
  }
}

class StyleClass extends Object {
  // constructor() {
  //   super();
  //   // this.obj = {};
  // }

  add(name, value) {  
    this.obj[name] = value;
    return this;
  }

  remove(name) {  
    delete this.obj[name];
    return this;
  }
}

export { CssClass, StyleClass }