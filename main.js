#!/usr/bin/env node
"use strict";

const mqttusvc = require("mqtt-usvc");
const LifxClient = require("node-lifx").Client;

const DEFAULT_ONOFF_DURATION = 5000;
const DEFAULT_CHANGE_DURATION = 2000;

function parseData(data) {
  if (!data) return null;

  // For backward compat
  return (typeof data === "string" ? JSON.parse(data) : data) || null;
}

async function main() {
  const client = new LifxClient();

  client.on("light-new", (light) => {
    console.log("FOUND LIGHT", light.id, light.address);
  });

  client.init({
    startDiscovery: true,
    debug: false,
  });

  const service = await mqttusvc.create();

  service.on("message", (topic, data) => {
    try {
      console.log("message", topic);
      if (!topic.startsWith("~/set/")) return;

      const [, , lifxId, action] = topic.split("/");
      console.info("SET DEVICE", lifxId, action || "", data);
      const light = client.light(lifxId);

      const request = parseData(data);
      const { color, duration, brightness, temp } = request || {};

      if (action === "off")
        return light.off(duration || DEFAULT_ONOFF_DURATION);
      if (action === "on") return light.on(duration || DEFAULT_ONOFF_DURATION);

      if (!request) return light.off(duration || DEFAULT_ONOFF_DURATION);
      if (brightness === 0)
        return light.off(duration || DEFAULT_ONOFF_DURATION);
      if (color) light.colorRgbHex(color, duration || DEFAULT_CHANGE_DURATION);
      else if (temp)
        light.color(
          0,
          0,
          request.brightness,
          request.temp,
          request.duration || DEFAULT_CHANGE_DURATION
        );

      light.on(duration || DEFAULT_ONOFF_DURATION);
    } catch (err) {
      console.error(
        `Unable to handle message. err="${
          err.message
        }" topic=${topic} data=${JSON.stringify(data)}`
      );
    }
  });

  service.subscribe("~/set/#");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
