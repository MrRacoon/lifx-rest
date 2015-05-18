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


| Method  | route               | action |
|:--------|:--------------------|:------:|
| GET     | /lighting/bulbs     | Get the current state of bulbs that are currently seen by the server |
| GET     | /lighting/on        | Turn all the lights on  |
| GET     | /lighting/off       | Turn all the lights off |
| GET     | /lighting/:bulb/on  | Turn (all or bulbName) on  |
| GET     | /lighting/:bulb/off | Turn (all or bulbName) off |
| POST    | /lighting/change    | Change the state of the bulbs using [this paylod][bulbState]


**Bulb Payloads** #BulbPayloads

| parameter | values |
|-----------|--------|
| hue       | 


[bulbState]: /#BulbPayloads "payloads for changing bulb state"
