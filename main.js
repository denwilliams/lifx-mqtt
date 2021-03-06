#!/usr/bin/env node
"use strict";

const mqttusvc = require("mqtt-usvc");
const LifxClient = require("node-lifx").Client;

async function main() {
  const client = new LifxClient();

  client.on("light-new", light => {
    console.log("FOUND LIGHT", light.id, light.address);
  });

  client.init({
    startDiscovery: true,
    debug: false
  });

  const service = await mqttusvc.create();

  service.on("message", (topic, data) => {
    try {
      console.log("message", topic);
      if (!topic.startsWith("~/set/")) return;

      const [, , lifxId, action] = topic.split("/");
      console.info("SET DEVICE", lifxId, action, data);
      const light = client.light(lifxId);

      if (action === "off") return light.off(5000);
      if (action === "on") return light.on(5000);

      const request = JSON.parse(data);

      if (!request) return light.off(5000);
      if (request.brightness === 0) return light.off(request.duration || 5000);
      if (request.color)
        light.colorRgbHex(request.color, request.duration || 2000);
      else if (request.temp)
        light.color(
          0,
          0,
          request.brightness,
          request.temp,
          request.duration || 2000
        );

      light.on(request.duration || 5000);
    } catch (err) {
      console.error(`Unable to handle message. topic=${topic} data=${data}`);
    }
  });

  service.subscribe("~/set/#");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
