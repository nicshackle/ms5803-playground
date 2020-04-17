var moment = require('moment-timezone');
console.log(moment().format('h:mm:ss a'))
console.log(moment().tz('America/Indiana/Indianapolis').format('h:mm:ss a'))

var oled = require('rpi-oled');
var font = require('oled-font-5x7');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C,
};

var oled = new oled(opts);

oled.clearDisplay(false);
oled.fillRect(1, 1, 128, 64, 0);
oled.setCursor(1, 1);
oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);

var ms5803 = require('ms5803')
var sensor = new ms5803(addr = 0x76)

let PT = {}

sensor.reset()
  .then(sensor.begin)
  .then((c) => {
    console.log("calibration array: " + c)
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
    setInterval(() => {
      sensor.measure()
        .then((r) => {
          if(r.temperature > 100 || r.temperature < 0 || r.pressure > 5000 || r.pressure < 0){
            console.log("sensor error")
          }
          else{
            PT = r
            oled.fillRect(1, 1, 128, 64, 0);
            oled.setCursor(1, 1);
            oled.writeString(font, 1, `${PT.temperature}C ${PT.pressure}hPa`, 1, true);
            oled.setCursor(1, 20);
            oled.writeString(font, 1, moment().tz('America/Indiana/Indianapolis').format('h:mma'), 1, true);
            oled.writeString(font, 1, moment().format('h:mma'), 1, true);
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }, 500)
  })
  .catch((error) => {
    console.error(error)
  })

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/pt', (req, res) => {
   res.send(JSON.stringify(PT))
})

