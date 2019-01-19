"use strict";

const mqttusvc = require("mqtt-usvc");
const LifxClient = require("node-lifx").Client;
const client = new LifxClient();

client.on("light-new", function(light) {
  console.log("FOUND LIGHT", light.id, light.address);
});

client.init({
  startDiscovery: true,
  debug: false
});

const service = mqttusvc.create();

service.on("message", (topic, data) => {
  console.log("message", topic);
  if (!topic.startsWith("set/")) return;

  const [_, lifxId, action] = topic.split("/");
  console.info("SET DEVICE", lifxId, action, data);
  const light = client.light(lifxId);

  if (action === "off") return light.off();
  if (action === "on") return light.on();

  if (data.color) light.colorRgbHex(data.color);
  else if (data.temp) light.color(0, 0, data.brightness, data.temp, 5000);

  light.on();
});

service.subscribe("set/#");
