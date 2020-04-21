/*import {Dictionary, U} from './Joiner';
import {forEach} from '@angular/router/src/utils/collection';

type prototype = any;
export class DynamicClassesFake {

}

export class DynamicClasses {
  static classCreated: Dictionary<string, prototype> = {};
  static getOrCreateClass(str: string, extending: prototype[] = []): any {
    if (!this.classCreated[str]) { return DynamicClasses.createClass(str, extending); }
    const classe: object = this.classCreated[str];
    let i: number;
    for (i = 0; i < extending.length; i++) {
      // DynamicClasses.isSubclass(classe.prototype, extending[i]);
    }

  }

  static createClass(str: string, extending: prototype[] = []): any {

  }
  /*
var subProto = Object.create(superProto);
subProto.someProp = 5;

var sub = Object.create(subProto);

console.log(superProto.isPrototypeOf(sub));  // true
console.log(sub instanceof superProto);      // TypeError* /
}
*/
//# sourceMappingURL=DynamicallyExtendCreateClasses.js.map