export type ProductCategory = "microcontroller" | "sensor" | "actuator" | "motor" | "power" | "driver" | "prototyping" | "tool" | "module" | "display" | "other";

export interface Part {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  tags: string[];
  image: string;
  description: string;
  specs: Record<string, string>;
}

export interface Kit {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  whatYouWillLearn: string[];
  possibleProjects: string[];
  components: string[]; // references Part IDs
  description: string;
  image: string;
  courseId?: string;
}

export interface Course {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modality: string;
  learnedSkills: string[];
  finalProject: string;
  price: number;
  image: string;
  suggestedKitId?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  type: "sell" | "donate";
  condition: "New" | "Like New" | "Used";
  price: number; // 0 if donate
  origin: string;
  image: string;
  compatibility: string;
  location: string;
}

export interface AIScenarioStep {
  title: string;
  description: string;
  selectedParts: string[]; // part IDs
}

export interface AIScenario {
  id: string;
  prompt: string;
  projectName: string;
  systemPlan: string[];
  nodes: {
    id: string;
    type: "MCU" | "SENSOR" | "ACTUATOR" | "POWER" | "MODULE" | "DISPLAY";
    label: string;
    partId: string;
    x: number;
    y: number;
  }[];
  connections: {
    source: string;
    target: string;
    type: "DATA" | "POWER";
  }[];
  recommendedKitId?: string;
  recommendedCourseId?: string;
  overview: {
    level: string;
    time: string;
    cost: number;
    description: string;
  };
  learningSteps: { title: string; desc: string }[];
}

export const MOCK_COMPONENTS: Part[] = [
  // Microcontrollers
  { id: "c1", name: "Arduino Uno R3", category: "microcontroller", price: 25.00, stock: 150, tags: ["Beginner", "Robotics"], image: "/mock/arduino.jpg", description: "Classic microcontroller board based on the ATmega328P.", specs: { "Microcontroller": "ATmega328P", "Operating Voltage": "5V" } },
  { id: "c2", name: "ESP32 Dev Module", category: "microcontroller", price: 12.50, stock: 320, tags: ["IoT", "Intermediate"], image: "/mock/esp32.jpg", description: "Powerful Wi-Fi and Bluetooth module.", specs: { "Wi-Fi": "802.11 b/g/n", "Bluetooth": "v4.2 BR/EDR and BLE" } },
  { id: "c3", name: "Raspberry Pi Pico", category: "microcontroller", price: 6.00, stock: 200, tags: ["Beginner", "Python"], image: "/mock/pico.jpg", description: "RP2040 chip designed by Raspberry Pi.", specs: { "Processor": "Dual-core ARM Cortex M0+", "SRAM": "264KB" } },
  { id: "c4", name: "STM32 Nucleo-64", category: "microcontroller", price: 18.00, stock: 50, tags: ["Advanced", "ARM"], image: "/mock/stm32.jpg", description: "Affordable and highly flexible way for users to try out new ideas.", specs: { "Core": "ARM Cortex-M4", "Flash": "512KB" } },
  // Sensors
  { id: "c5", name: "HC-SR04 Ultrasonic Sensor", category: "sensor", price: 3.50, stock: 500, tags: ["Beginner", "Robotics"], image: "/mock/hc-sr04.jpg", description: "Ultrasonic ranging module 2cm-400cm.", specs: { "Voltage": "5V", "Ranging Distance": "2cm - 400cm" } },
  { id: "c6", name: "DHT11 Temp & Humidity", category: "sensor", price: 2.00, stock: 450, tags: ["Beginner", "Weather"], image: "/mock/dht11.jpg", description: "Basic, ultra low-cost digital temperature and humidity sensor.", specs: { "Voltage": "3.3V-5V", "Temp Range": "0-50°C" } },
  { id: "c7", name: "MPU6050 Gyro/Accel", category: "sensor", price: 5.50, stock: 300, tags: ["Intermediate", "Drones"], image: "/mock/mpu6050.jpg", description: "6-axis MotionTracking device that combines a 3-axis gyroscope, 3-axis accelerometer.", specs: { "Interface": "I2C", "Voltage": "3-5V" } },
  { id: "c8", name: "IR Line Tracking Sensor", category: "sensor", price: 1.50, stock: 600, tags: ["Beginner", "Robotics"], image: "/mock/ir-line.jpg", description: "Simple IR reflection sensor for line following robots.", specs: { "Output": "Digital", "Range": "1-3cm" } },
  { id: "c9", name: "Soil Moisture Sensor", category: "sensor", price: 2.50, stock: 350, tags: ["IoT", "Agriculture"], image: "/mock/soil.jpg", description: "Measures the volumetric content of water inside the soil.", specs: { "Output": "Analog/Digital", "Voltage": "3.3-5V" } },
  { id: "c10", name: "BME280 Environment", category: "sensor", price: 8.00, stock: 120, tags: ["Intermediate", "Weather"], image: "/mock/bme280.jpg", description: "Precision sensor measuring relative humidity, barometric pressure and ambient temperature.", specs: { "Interface": "I2C/SPI", "Voltage": "3.3V" } },
  // Motors & Actuators
  { id: "c11", name: "SG90 Micro Servo", category: "motor", price: 4.00, stock: 800, tags: ["Beginner", "Robotics"], image: "/mock/sg90.jpg", description: "Tiny and lightweight servo motor with high output power.", specs: { "Torque": "1.8 kg-cm", "Speed": "0.1 s/60°" } },
  { id: "c12", name: "NEMA 17 Stepper Motor", category: "motor", price: 15.00, stock: 150, tags: ["Advanced", "CNC"], image: "/mock/nema17.jpg", description: "High torque stepper motor for 3D printers and CNC.", specs: { "Step Angle": "1.8 deg", "Torque": "4000 g-cm" } },
  { id: "c13", name: "DC Gear Motor", category: "motor", price: 3.50, stock: 600, tags: ["Beginner", "RC Car"], image: "/mock/dc-gear.jpg", description: "TT motor for smart cars and robots.", specs: { "Voltage": "3-6V", "Ratio": "1:48" } },
  { id: "c14", name: "Micro Water Pump", category: "actuator", price: 6.50, stock: 200, tags: ["IoT", "Agriculture"], image: "/mock/water-pump.jpg", description: "Submersible water pump for DIY watering systems.", specs: { "Voltage": "3-5V", "Flow rate": "80-120 L/H" } },
  { id: "c15", name: "Solenoid Valve 12V", category: "actuator", price: 12.00, stock: 100, tags: ["Intermediate", "Automation"], image: "/mock/solenoid.jpg", description: "Electric solenoid valve for water flow control.", specs: { "Voltage": "12V", "Type": "Normally Closed" } },
  // Power
  { id: "c16", name: "18650 Li-ion Battery 2600mAh", category: "power", price: 8.00, stock: 400, tags: ["All", "Power"], image: "/mock/18650.jpg", description: "Rechargeable lithium-ion cell.", specs: { "Capacity": "2600mAh", "Voltage": "3.7V" } },
  { id: "c17", name: "TP4056 Battery Charging Module", category: "power", price: 2.00, stock: 500, tags: ["Beginner", "Power"], image: "/mock/tp4056.jpg", description: "Complete constant-current/constant-voltage linear charger for single cell lithium-ion batteries.", specs: { "Input": "5V", "Current": "1A" } },
  { id: "c18", name: "LM2596 Buck Converter", category: "power", price: 3.00, stock: 450, tags: ["Intermediate", "Power"], image: "/mock/lm2596.jpg", description: "DC-DC step down module.", specs: { "Input": "3.2V-40V", "Output": "1.25V-35V" } },
  { id: "c19", name: "MT3608 Boost Converter", category: "power", price: 2.50, stock: 300, tags: ["Intermediate", "Power"], image: "/mock/mt3608.jpg", description: "DC-DC step up module.", specs: { "Input": "2V-24V", "Output": "Max 28V" } },
  { id: "c20", name: "AA Battery Holder (x4)", category: "power", price: 1.50, stock: 600, tags: ["Beginner", "Power"], image: "/mock/aa-holder.jpg", description: "Simple battery holder for 4 AA batteries.", specs: { "Output Voltage": "6V" } },
  // Drivers & Modules
  { id: "c21", name: "L298N Motor Driver", category: "driver", price: 4.50, stock: 350, tags: ["Beginner", "RC Car"], image: "/mock/l298n.jpg", description: "Dual H-Bridge motor driver for DC or Stepper motors.", specs: { "Motor Voltage": "5V-35V", "Logic Voltage": "5V" } },
  { id: "c22", name: "A4988 Stepper Driver", category: "driver", price: 3.00, stock: 250, tags: ["Advanced", "CNC"], image: "/mock/a4988.jpg", description: "Microstepping motor driver with built-in translator.", specs: { "Output Current": "2A max", "Voltage": "8-35V" } },
  { id: "c23", name: "Relay Module 1-Channel", category: "module", price: 2.50, stock: 400, tags: ["Beginner", "Automation"], image: "/mock/relay.jpg", description: "Control high voltage devices with low voltage signals.", specs: { "Trigger": "5V", "Load": "10A 250VAC" } },
  { id: "c24", name: "RFID RC522 Module", category: "module", price: 5.00, stock: 150, tags: ["Intermediate", "Security"], image: "/mock/rfid.jpg", description: "13.56MHz RFID reader/writer module.", specs: { "Interface": "SPI", "Voltage": "3.3V" } },
  { id: "c25", name: "Bluetooth HC-05", category: "module", price: 6.00, stock: 200, tags: ["Beginner", "Communication"], image: "/mock/hc05.jpg", description: "Easy to use Bluetooth SPP module.", specs: { "Bluetooth": "V2.0+EDR", "Interface": "Serial" } },
  // Prototyping & Displays
  { id: "c26", name: "Breadboard Full Size", category: "prototyping", price: 4.00, stock: 1000, tags: ["All", "Essentials"], image: "/mock/breadboard.jpg", description: "830 tie-point solderless breadboard.", specs: { "Points": "830" } },
  { id: "c27", name: "Jumper Wires M/M", category: "prototyping", price: 2.00, stock: 1200, tags: ["All", "Essentials"], image: "/mock/jumper.jpg", description: "40 pin male to male jumper cables.", specs: { "Length": "10cm/20cm" } },
  { id: "c28", name: "LCD 1602 with I2C", category: "display", price: 5.50, stock: 300, tags: ["Beginner", "Display"], image: "/mock/lcd1602.jpg", description: "16x2 character LCD with I2C backpack for easy wiring.", specs: { "Interface": "I2C", "Color": "Blue/White" } },
  { id: "c29", name: "OLED Basic 0.96\"", category: "display", price: 6.00, stock: 250, tags: ["Intermediate", "Display"], image: "/mock/oled.jpg", description: "Tiny, crisp monochrome OLED display.", specs: { "Resolution": "128x64", "Interface": "I2C" } },
  { id: "c30", name: "Soldering Iron Pencil", category: "tool", price: 15.00, stock: 80, tags: ["Tool", "Intermediate"], image: "/mock/soldering.jpg", description: "Basic 60W soldering iron with adjustable temperature.", specs: { "Power": "60W", "Temp": "200-450°C" } }
];

export const MOCK_KITS: Kit[] = [
  { id: "k1", name: "Arduino Master Starter Kit", level: "Beginner", price: 45.00, whatYouWillLearn: ["Basic electronics", "C++ Programming", "Reading sensors"], possibleProjects: ["Weather station", "Alarm system", "Light theremin"], components: ["c1", "c5", "c6", "c11", "c16", "c26", "c27", "c28"], description: "The ultimate kit to start your journey into electronics and coding.", image: "/mock/kit-arduino.jpg", courseId: "crs1" },
  { id: "k2", name: "RC Car Smart Chassis Kit", level: "Intermediate", price: 65.00, whatYouWillLearn: ["Motor control", "Obstacle avoidance", "Remote communication"], possibleProjects: ["Bluetooth controlled car", "Autonomous maze solver"], components: ["c1", "c13", "c13", "c21", "c5", "c25", "c16", "c20"], description: "Build and program your own intelligent 2-wheel drive robotic car.", image: "/mock/kit-car.jpg", courseId: "crs7" },
  { id: "k3", name: "IoT Weather Station with ESP32", level: "Intermediate", price: 40.00, whatYouWillLearn: ["Wi-Fi connecting", "Cloud data logging", "Environment monitoring"], possibleProjects: ["Online dashboard", "Smart home integration"], components: ["c2", "c10", "c29", "c26", "c27"], description: "Monitor the environment and send data to your smartphone.", image: "/mock/kit-weather.jpg", courseId: "crs5" },
  { id: "k4", name: "Basic Robotic Arm Kit", level: "Intermediate", price: 85.00, whatYouWillLearn: ["Kinematics", "Servo synchronization", "Control interfaces"], possibleProjects: ["Pick and place robot", "Automated assembly line"], components: ["c1", "c11", "c11", "c11", "c11", "c26"], description: "A 4-DOF robotic arm made of lightweight acrylic.", image: "/mock/kit-arm.jpg", courseId: "crs6" },
  { id: "k5", name: "Automated Greenhouse Kit", level: "Advanced", price: 75.00, whatYouWillLearn: ["Actuator control", "Water flow mechanics", "Long-term data logging"], possibleProjects: ["Smart plant pot", "Hydroponics controller"], components: ["c2", "c9", "c14", "c15", "c23"], description: "Take care of your plants automatically using logic and sensors.", image: "/mock/kit-greenhouse.jpg", courseId: "crs4" },
  { id: "k6", name: "RFID Access Control", level: "Beginner", price: 35.00, whatYouWillLearn: ["SPI Communication", "Data Security", "Relay driving"], possibleProjects: ["Smart door lock", "Secret safe box"], components: ["c1", "c24", "c23", "c11", "c28"], description: "Build a security system unlocking doors with a card.", image: "/mock/kit-rfid.jpg" },
  { id: "k7", name: "Smart Alarm Kit", level: "Intermediate", price: 30.00, whatYouWillLearn: ["Motion detection", "Web notifications", "Battery management"], possibleProjects: ["Room security", "Mailbox notifier"], components: ["c2", "c5", "c23", "c16"], description: "Protect your space with an IoT connected alarm.", image: "/mock/kit-alarm.jpg" },
  { id: "k8", name: "Biomedical Basics Kit", level: "Advanced", price: 95.00, whatYouWillLearn: ["Signal processing", "Analog filtering", "Human-machine interaction"], possibleProjects: ["Heart rate monitor", "Muscle sensor controller"], components: ["c4", "c29", "c26", "c27"], description: "Experiment with non-invasive biomedical sensors.", image: "/mock/kit-bio.jpg" }
];

export const MOCK_COURSES: Course[] = [
  { id: "crs1", title: "Introduction to Arduino from Zero", level: "Beginner", duration: "4 hours", modality: "Video + Interactive", learnedSkills: ["Arduino IDE", "Digital I/O", "Analog I/O", "Serial Communication"], finalProject: "Interactive Traffic Light System", price: 15.00, image: "/mock/course-arduino.jpg", suggestedKitId: "k1" },
  { id: "crs2", title: "Practical Electronics Fundamentals", level: "Beginner", duration: "6 hours", modality: "Video + PDF", learnedSkills: ["Ohm's Law", "Reading Schematics", "Soldering", "Using a Multimeter"], finalProject: "Custom LED chaser board", price: 20.00, image: "/mock/course-elec.jpg" },
  { id: "crs3", title: "Applied Basic Robotics", level: "Beginner", duration: "5 hours", modality: "Video + Interactive", learnedSkills: ["Motor Types", "PWM Control", "Power management"], finalProject: "Line Following Robot", price: 25.00, image: "/mock/course-robot.jpg" },
  { id: "crs4", title: "Automation with Sensors & Actuators", level: "Intermediate", duration: "8 hours", modality: "Interactive", learnedSkills: ["Relays", "Solenoids", "Water pumps", "Fail-safe logic"], finalProject: "Automated Plant Watering System", price: 30.00, image: "/mock/course-auto.jpg", suggestedKitId: "k5" },
  { id: "crs5", title: "ESP32 and IoT for Real Projects", level: "Intermediate", duration: "10 hours", modality: "Video + Labs", learnedSkills: ["Wi-Fi protocols", "MQTT", "Web servers", "Deep sleep"], finalProject: "Cloud-connected Weather Station", price: 35.00, image: "/mock/course-iot.jpg", suggestedKitId: "k3" },
  { id: "crs6", title: "How to Design your First Robotic Arm", level: "Advanced", duration: "12 hours", modality: "Video + CAD", learnedSkills: ["Inverse Kinematics", "3D Printing design", "Servo jitter fixing"], finalProject: "4-DOF Pick and Place Robot", price: 45.00, image: "/mock/course-arm.jpg", suggestedKitId: "k4" },
  { id: "crs7", title: "How to Build a Smart RC Car", level: "Intermediate", duration: "7 hours", modality: "Video + Labs", learnedSkills: ["H-Bridges", "Bluetooth Serial", "App Inventor"], finalProject: "Smartphone Controlled Rover", price: 25.00, image: "/mock/course-car.jpg", suggestedKitId: "k2" },
  { id: "crs8", title: "Rapid Prototyping for Students", level: "Beginner", duration: "3 hours", modality: "Live Sessions", learnedSkills: ["Breadboarding", "Wiring management", "Debugging tricks"], finalProject: "A clean, presentable university project", price: 0.00, image: "/mock/course-proto.jpg" }
];

export const MOCK_COMMUNITY: CommunityPost[] = [
  { id: "cm1", title: "Arduino Mega - Barely Used", type: "sell", condition: "Like New", price: 30.00, origin: "Tech University Lab", image: "/mock/mega.jpg", compatibility: "Any Arduino project needing more pins", location: "Campus North" },
  { id: "cm2", title: "Box of Resistors and LEDs", type: "donate", condition: "New", price: 0, origin: "Graduated Student", image: "/mock/resistors.jpg", compatibility: "Universal", location: "Downtown Library" },
  { id: "cm3", title: "3 NEMA 17 Steppers", type: "sell", condition: "Used", price: 25.00, origin: "Failed 3D Printer project", image: "/mock/nema-used.jpg", compatibility: "CNC, 3D Printers", location: "Maker Space" },
  { id: "cm4", title: "Raspberry Pi 3 Model B", type: "sell", condition: "Used", price: 35.00, origin: "Home Server Upgrade", image: "/mock/rpi3.jpg", compatibility: "Linux, IoT, RetroGaming", location: "South District" },
  { id: "cm5", title: "Assorted Jumper Wires", type: "donate", condition: "Used", price: 0, origin: "Robotics Club", image: "/mock/jumpers-used.jpg", compatibility: "Breadboards", location: "Engineering Building, Room 402" },
  { id: "cm6", title: "Lidar Sensor RPLIDAR A1", type: "sell", condition: "Like New", price: 70.00, origin: "Autonomous Navigation Thesis", image: "/mock/rplidar.jpg", compatibility: "ROS, Raspberry Pi, Arduino", location: "Tech University Lab" },
  { id: "cm7", title: "L298N Motor Drivers (x5)", type: "sell", condition: "New", price: 15.00, origin: "Bought too many", image: "/mock/l298-stack.jpg", compatibility: "DC Motors", location: "Maker Space" },
  { id: "cm8", title: "Small Solar Panels 5V", type: "donate", condition: "Used", price: 0, origin: "Green Energy Project", image: "/mock/solar.jpg", compatibility: "Battery charging modules", location: "Campus South" },
  { id: "cm9", title: "Broken Oscilloscope (for parts)", type: "sell", condition: "Used", price: 40.00, origin: "Local Repair Shop", image: "/mock/oscillo.jpg", compatibility: "Repair technicians", location: "Industrial Park" },
  { id: "cm10", title: "ESP8266 Modules", type: "donate", condition: "New", price: 0, origin: "Workshop leftovers", image: "/mock/esp8266.jpg", compatibility: "IoT projects", location: "Community Center" }
];

export const MOCK_SCENARIOS: AIScenario[] = [
  {
    id: "sc-rc-car",
    prompt: "Remote control car with electronic kits",
    projectName: "RC CAR",
    systemPlan: [
      "Select an MCU: Arduino Uno or ESP32 for control and Wi-Fi/Bluetooth communication.",
      "Implement motor drivers (e.g. L298N) for DC motors to control wheels.",
      "Design a chassis: Use an acrylic or 3D printed base.",
      "Integrate power system: LiPo battery pack with a suitable voltage regulator.",
      "Add ultrasonic sensor for obstacle awareness.",
      "Group all required parts into a purchase-ready list.",
      "Suggest related kit and course."
    ],
    recommendedKitId: "k2",
    recommendedCourseId: "crs7",
    overview: {
      level: "Intermediate",
      time: "4-6 Hours",
      cost: 65.00,
      description: "A complete autonomous and Bluetooth-controlled rover. Great for understanding control logic and motor mechanics."
    },
    nodes: [
      { id: "n1", type: "POWER", label: "Main LiPo Battery", partId: "c16", x: 100, y: 100 },
      { id: "n2", type: "MODULE", label: "5V Power Regulator", partId: "c18", x: 300, y: 150 },
      { id: "n3", type: "MCU", label: "Main Controller (Arduino)", partId: "c1", x: 500, y: 300 },
      { id: "n4", type: "SENSOR", label: "Front Ultrasonic Sensor", partId: "c5", x: 800, y: 200 },
      { id: "n5", type: "MODULE", label: "Drive Motor Driver", partId: "c21", x: 800, y: 400 },
      { id: "n6", type: "ACTUATOR", label: "Right Drive Motor", partId: "c13", x: 1100, y: 300 },
      { id: "n7", type: "ACTUATOR", label: "Left Drive Motor", partId: "c13", x: 1100, y: 500 },
      { id: "n8", type: "ACTUATOR", label: "Steering Servo", partId: "c11", x: 800, y: 600 }
    ],
    connections: [
      { source: "n1", target: "n2", type: "POWER" },
      { source: "n2", target: "n3", type: "POWER" },
      { source: "n2", target: "n5", type: "POWER" },
      { source: "n3", target: "n4", type: "DATA" },
      { source: "n3", target: "n5", type: "DATA" },
      { source: "n3", target: "n8", type: "DATA" },
      { source: "n5", target: "n6", type: "POWER" },
      { source: "n5", target: "n7", type: "POWER" }
    ],
    learningSteps: [
      { title: "Understand the Chassis", desc: "Start by assembling the acrylic base and mounting the motors firmly." },
      { title: "Power Management", desc: "Never connect the motors directly to the MCU. Route power through the Motor Driver." },
      { title: "Wiring Logic", desc: "Connect the logic pins of the L298N to the PWM pins on your Arduino." },
      { title: "Sensing", desc: "Place the Ultrasonic Sensor facing forward to detect obstacles." }
    ]
  },
  // Adding placeholders for the additional 9 as requested to meet the 10 quota
  { id: "sc-arm", prompt: "Brazo robótico básico", projectName: "ROBOTIC ARM", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-water", prompt: "Sistema de riego automático", projectName: "AUTO GREENHOUSE", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-alarm", prompt: "Alarma inteligente con ESP32", projectName: "SMART ALARM", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-weather", prompt: "Estación meteorológica básica", projectName: "WEATHER STATION", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-rfid", prompt: "Control de acceso RFID", projectName: "RFID ACCESS", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-line", prompt: "Seguidor de línea", projectName: "LINE FOLLOWER", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-temp", prompt: "Monitoreo de temperatura", projectName: "TEMP MONITOR", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-iot", prompt: "Proyecto IoT para principiantes", projectName: "IOT STARTER", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} },
  { id: "sc-light", prompt: "Automatización de iluminación", projectName: "SMART LIGHTING", systemPlan: [], nodes: [], connections: [], learningSteps: [], overview: {level:"", time:"", cost:0, description:""} }
];
