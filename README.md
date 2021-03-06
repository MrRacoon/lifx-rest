lifx-rest
=========

Minimal rest server using nodejs/restify.


**Installation**

```bash
git clone https://github.com/MrRacoon/lifx-rest.git
cd lifx-rest
npm install
```

**Running**

`npm run start`

**EndPoints**

| Method  | route                  | action |
|:--------|:-----------------------|:------:|
| GET     | /lighting/bulbs        | Get the current state of bulbs that are currently seen by the server |
| GET     | /lighting/on/:bulbName | Turn all the lights on  |
| GET     | /lighting/off/:bulbName| Turn all the lights off |
| POST    | /lighting/change       | Change the state of the bulbs using the following payload |

**Bulb POST Payload**
-----------------

| parameter | description                   | values |
|-----------|-------------------------------|--------|
| hue       | color of the bulb             | red, orange, gold, yellow, yelloGreen, greem, cyan, skyBlue, blue, lightBlack, black, pink, darkPink, hotPink, salmon |
| sat       | whether to do color or whites | white, color                                     |
| lum       | brightness of the bulb        | off, low, medium, high, on                       |
| whi       | warmness, when using whites   | off, low, medium, high, on                       |
| fad       | fade time                     | now, quick, fast, soon, walk, mosey, slow, creep |


[bulbState]: https://github.com/MrRacoon/lifx-rest#bulb-payload "payloads for changing bulb state"
