function mixin(sourceObject, targetObject) {
  for(key in sourceObject) {
    if(!(key in targetObject)) {
      targetObject[key] = sourceObject[key];
    }
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

const Car = mixin(Vehicle, {
  wheels: 4,
  drive: function () {
    Vehicle.drive.call(this);
    console.log(`Rolling on all ${this.wheels} wheels!`);
  }
});

console.log(Car.drive());
