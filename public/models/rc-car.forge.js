// Dystronic RC car, editable ForgeCAD source.
// Validate: forgecad run public/models/rc-car.forge.js
// Edit:     forgecad studio public/models

const chassisLength = Param.number("Chassis length", 142, { min: 110, max: 190, unit: "mm" });
const chassisWidth = Param.number("Chassis width", 84, { min: 65, max: 120, unit: "mm" });
const chassisHeight = Param.number("Chassis thickness", 4, { min: 3, max: 8, unit: "mm" });
const mountHeight = Param.number("Mount height", 8, { min: 4, max: 18, unit: "mm" });

const chassis = box(chassisLength, chassisWidth, chassisHeight)
  .translate(-chassisLength / 2, -chassisWidth / 2, 0)
  .color("#38bdf8");
const controllerMount = box(69, 54, mountHeight).translate(-55, -27, chassisHeight).color("#00f0ff");
const batteryMount = box(65, 36, mountHeight + 2).translate(4, -18, chassisHeight).color("#facc15");
const regulatorMount = box(43, 21, mountHeight).translate(8, -38, chassisHeight).color("#a855f7");
const driverMount = box(44, 44, mountHeight).translate(-35, -42, chassisHeight).color("#c026d3");
const sensorMount = box(8, 45, 22).translate(-chassisLength / 2 + 4, -22.5, chassisHeight).color("#39ff14");
const rightMotorBracket = box(70, 25, 25).translate(10, chassisWidth / 2, -10).color("#f97316");
const leftMotorBracket = box(70, 25, 25).translate(10, -chassisWidth / 2 - 25, -10).color("#fb923c");
const servoBracket = box(23, 12, 29).translate(-48, -35, chassisHeight).color("#ff5e00");

return {
  "Chassis": chassis,
  "Arduino Uno mount": controllerMount,
  "18650 battery holder": batteryMount,
  "LM2596 mount": regulatorMount,
  "L298N mount": driverMount,
  "HC-SR04 mount": sensorMount,
  "Right motor bracket": rightMotorBracket,
  "Left motor bracket": leftMotorBracket,
  "SG90 servo bracket": servoBracket,
};
