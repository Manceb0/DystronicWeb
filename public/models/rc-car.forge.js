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
const controllerMount = box(42, 34, mountHeight).translate(-48, -17, chassisHeight).color("#00f0ff");
const batteryMount = box(44, 32, mountHeight + 2).translate(8, -16, chassisHeight).color("#facc15");
const driverMount = box(34, 22, mountHeight).translate(-17, -37, chassisHeight).color("#a855f7");
const sensorMount = box(8, 40, 22).translate(-chassisLength / 2 + 6, -20, chassisHeight).color("#39ff14");

return {
  "Chassis": chassis,
  "Arduino mount": controllerMount,
  "Battery holder": batteryMount,
  "Motor driver mount": driverMount,
  "Ultrasonic mount": sensorMount,
};
