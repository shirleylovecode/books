function mixin(sourceObject, targetObject) {
  for(key in sourceObject) {
    // 通过定义的顺序不需要再判断目标对象中是否有该属性
    // if(!(key in targetObject)) {
    //   targetObject[key] = sourceObject[key];
    // }
    targetObject[key] = sourceObject[key];
  }
  return targetObject;
}

const Vehicle = {
  engine: 1,
  ignition: function () {
    console.log("Turn on my engine!");
  },
  drive: function () {
    this.ignition();
    console.log("Steering and moving forward!");
  }
}

// const Car = mixin(Vehicle, {
//   wheels: 4,
//   drive: function () {
//     Vehicle.drive.call(this);
//     console.log(`Rolling on all ${this.wheels} wheels!`);
//   }
// });

// 先将Vehicle复制到一个空对象上
const Car = mixin(Vehicle, {});
// 然后再将新增加的属性复制到Car上；
mixin({
  wheels: 4,
  drive: function () {
    Vehicle.drive.call(this);
    console.log(`Rolling on all ${this.wheels} wheels!`);
  }
}, Car);

console.log(Car.drive());
