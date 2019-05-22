function Vehicle () {
  this.engine = 1;
}

Vehicle.prototype.ignition = function () {
  console.log("Turn on my engine!");
}

Vehicle.prototype.drive = function () {
  this.ignition();
  console.log("Steering and moving forward!");
}

function Car () {
  const car = new Vehicle();
  const vehicleDrive = car.drive;

  car.wheels = 4;
  car.drive = function () {
    vehicleDrive.call(this);
    console.log(`Rolling on all ${this.wheels} wheels!`);
  }

  return car;
}

const car = Car();
car.drive();
