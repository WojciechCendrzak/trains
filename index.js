const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

const HubUUID = {
  One: "10a90a2d2745f9efff0b0aee88750666",
  Two: "97b483a4c1d62207779404fa1d1e9bfd",
};

const KeyMapping = {
  [HubUUID.One]: {
    speedForwardMax: "up",
    speedBackwardMax: "down",
    speedUp: "right",
    speedDown: "left",
    stop: "space",
  },
  [HubUUID.Two]: {
    speedForwardMax: "]",
    speedBackwardMax: "[",
    speedUp: "\\",
    speedDown: "'",
    stop: 'return'
  },
};

var keypress = require("keypress");
const { HubTypeNames } = require("node-poweredup/dist/node/consts");

const devies = {
  DuploTrainBaseMotor: 0,
  DuploTrainBaseSpeaker: 1,
  HubLED: 2,
  DuploTrainBaseColorSensor: 3,
  DuploTrainBaseSpeedometer: 4,
  VoltageSensor: 5,
};

const colors = {
  BLACK: 0,
  PINK: 1,
  PURPLE: 2,
  BLUE: 3,
  LIGHT_BLUE: 4,
  CYAN: 5,
  GREEN: 6,
  YELLOW: 7,
  ORANGE: 8,
  RED: 9,
  WHITE: 10,
  NONE: 255,
};

const sounds = {
  BRAKE: 3,
  STATION_DEPARTURE: 5,
  WATER_REFILL: 7,
  HORN: 9,
  STEAM: 10,
};

const reverseObject = (obj) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [value]: key,
    }),
    {}
  );

const colorNames = reverseObject(colors);
const soundNames = reverseObject(sounds);

const STEP = 15;
const MAX_SPEED = 100;

poweredUP.on("discover", async (hub) => {
  let speed = 0;
  let color = 0;
  let tone = 0;

  // console.log("hub", JSON.stringify(hub, null, 2));
  // console.log("hub", JSON.stringify(hub, null, 2));
  console.log("hub", hub);

  console.log(`Discovered "${hub.name}", ${hub.id}`);
  // hub.setName('Train Base 2');
  // const uuid = hub.uuid;
  // console.log('uuid', uuid)

  // hub._characteristics[uuid].write(data, false, (error) => {
  //   console.log('error', error)
  // });

  // if (hub.uuid !== id1) {
  //   console.log(`Skipped "${hub.name}", ${hub.uuid}`);
  //   return;
  // }
  await hub.connect();
  console.log(`Connected "${hub.name}", ${hub.uuid}`);

  const devices = await hub.getDevices();
  const motor = devices[devies.DuploTrainBaseMotor];
  const lamp = devices[devies.HubLED];
  const speaker = devices[devies.DuploTrainBaseSpeaker];
  const colorSensor = devices[devies.DuploTrainBaseColorSensor];

  if (!motor) return;

  //  sensor

  colorSensor.on("color", async ({ color }) => {
    if (color === colors.RED) {
      speaker.playSound(sounds.BRAKE);
      speed = 0;
      motor.setPower(speed);
      console.log("speed:", speed);
    }
    if (color === colors.BLUE) {
      const lastSpeed = speed;
      speed = 0;
      motor.setPower(speed);
      console.log("speed:", speed);
      await hub.sleep(500);
      speaker.playSound(sounds.WATER_REFILL);
      await hub.sleep(2000);
      speed = lastSpeed;
      motor.setPower(speed);
      console.log("speed:", speed);
    }
    console.log("color found -> ", colorNames[color]);
  });

  //   colorSensor.on("intensity", ({ intensity }) => {
  //       console.log("intensity -> ", intensity);
  //   });

  //   colorSensor.on("reflect", (data) => {
  //     // console.log("reflect -> ", data);
  //   });

  //   colorSensor.on("rgb", (data) => {
  //     console.log("rgb -> ", data);
  //   });

  keypress(process.stdin);

  const keys = KeyMapping[hub.uuid];
  process.stdin.on("keypress", function (ch, keyObj) {
    // speed
    console.log('ch, keyObj', ch, keyObj)
    const key = keyObj?.name || ch;

    if (key == keys.speedUp) {
      speed = Math.min(speed + STEP, MAX_SPEED);
      motor.setPower(speed);
      console.log("speed:", speed);
    }

    if (key == keys.speedDown) {
      speed = Math.max(speed - STEP, -MAX_SPEED);
      motor.setPower(speed);
      console.log("speed:", speed);
    }

    if (key == keys.speedForwardMax) {
      speed = MAX_SPEED;
      motor.setPower(speed);
      console.log("speed:", speed);
    }

    if (key == keys.speedBackwardMax) {
      speed = -MAX_SPEED;
      motor.setPower(speed);
      console.log("speed:", speed);
    }

    if (key == keys.stop) {
      speed = 0;
      motor.setPower(speed);
      console.log("speed:", speed);
    }

    // lamp

    if (key == "z") {
      color = colors.GREEN;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "n") {
      color = colors.BLUE;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "f") {
      color = colors.PURPLE;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "c") {
      color = colors.RED;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "p") {
      color = colors.ORANGE;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "b") {
      color = colors.WHITE;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    if (key == "k") {
      color += 1;
      if (color > 10) color = 0;
      lamp.setColor(color);
      console.log(`lamp color: (${color}) -  ${colorNames[color]}`);
    }

    // speaker

    if (key == "t") {
      speaker.playSound(sounds.HORN);
      console.log("sound: HORN");
    }

    if (key == "s") {
      speaker.playSound(sounds.BRAKE);
      console.log("sound: BRAKE");
    }

    if (key == "o") {
      speaker.playSound(sounds.STATION_DEPARTURE);
      console.log("sound: STATION_DEPARTURE");
    }

    if (key == "w") {
      speaker.playSound(sounds.WATER_REFILL);
      console.log("sound: WATER_REFILL");
    }

    if (key == "g") {
      speaker.playSound(sounds.STEAM);
      console.log("sound: STEAM");
    }

    if (Number.isInteger(parseInt(ch), 10)) {
      console.log(`paly tone: (${ch})`);
      speaker.playTone(ch);
    }

    if (key == "d") {
      tone += 1;
      if (tone > 10) tone = 0;
      console.log(`paly tone: (${tone})`);
      speaker.playTone(tone);
    }

    if (key == "q") {
      process.exit();
    }
  });
});

process.stdin.setRawMode(true);
process.stdin.resume();

poweredUP.scan();
console.log("Scanning for Hubs...");
