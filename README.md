# lifx-mqtt

_Only allows for updating light state at present. Doesn't publish any events when light state is changed elsewhere. In the future will look at adding some events under /status._

Lights should be autodiscovered and logged. Check the output to see available IDs.

## Topics

With a prefix of `lifx`, the following topics can be used:

- lifx/set/{id}/on
- lifx/set/{id}/off
- lifx/set/{id} - sets the light state based off the body data (JSON). Fields are `brightness`, `temp`, `color`, `duration`

Examples:

- Topic: `lifx/set/d073e429c362`
- Payload: `{"brightness":100}`

- Topic: `lifx/set/d073e429c362/on`
- Payload: -

With optional duration...

- Topic: `lifx/set/d073e429c362/on`
- Payload: `{"duration":1000}`

You can turn a light off by setting its brightness to `0`

- Topic: `lifx/set/d073e429c362`
- Payload: `{"brightness":0}`

...or by 

- Topic: `lifx/set/d073e429c362/off`
- Payload: -


## Running

It is intended to be installed globally, ie `npm i -g lifx-mqtt`

Create a YAML file somewhere. See `config.example.yml`

Run (replace path)

```
CONFIG_PATH=/path/to/myconfig.yml lifx-mqtt
```

You can also use Consul for config. See [mqtt-usvc](https://www.npmjs.com/package/mqtt-usvc) for more details.

## Example Config

```
mqtt:
  uri: mqtt://localhost
  prefix: lifx
service: {}
```

## HTTP Status Endpoint

Add port to config:

```
mqtt:
  uri: mqtt://localhost
  prefix: lifx
http:
  port: 9876
service: {}
```

Then request `http://localhost:9876/status`


