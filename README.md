# lifx-mqtt

With a prefix of `lifx/`, the following topics can be used:

- lifx/{id}/on
- lifx/{id}/off
- lifx/{id} - sets the light state based off the body data (JSON). Fields are `brightness`, `temp`, `color`, `duration`
