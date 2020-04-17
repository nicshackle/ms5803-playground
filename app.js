var moment = require('moment-timezone');
console.log(moment().format('h:mm:ss a'))
console.log(moment().tz('America/Indiana/Indianapolis').format('h:mm:ss a'))
// entries (timestamp DATETIME, temp NUMBER, pressure NUMBER);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var schedule = require('node-schedule');

var oled = require('rpi-oled');
var font = require('oled-font-5x7');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C,
};

var oled = new oled(opts);

const updateOled = () => {
  db.get(`SELECT * FROM entries ORDER BY timestamp DESC LIMIT 1`, (err, data) => {
    if(!err){
      oled.fillRect(1, 1, 128, 64, 0);
      oled.setCursor(1, 1);
      oled.writeString(font, 1, `${data.temp}C ${data.pressure}hPa`, 1, true);
      oled.setCursor(1, 20);
      oled.writeString(font, 1, 'IND: ' + moment().tz('America/Indiana/Indianapolis').format('h:mma'), 1, true);
      oled.setCursor(1, 40);
      oled.writeString(font, 1, 'SA: ' + moment().format('h:mma'), 1, true);
    } else {
      console.warn(err)
    }
  })
}

updateOled()
schedule.scheduleJob('*/1 * * * *', updateOled()); // every min

var ms5803 = require('ms5803')
var sensor = new ms5803(addr = 0x76)

const update = () => {
  sensor.measure()
    .then((r) => {
      if(r.temperature > 100 || r.temperature < 0 || r.pressure > 5000 || r.pressure < 0){
        console.warn("sensor error")
      }
      else{
        db.run(
          "INSERT INTO entries (timestamp, temp, pressure) VALUES (?,?,?)",
          new Date().toISOString(),
          r.temperature,
          r.pressure,
          err => {if(err) console.warn(err)}
        );
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

sensor.reset()
  .then(sensor.begin)
  .then((c) => {
    console.log("calibration array: " + c)
    update()
    schedule.scheduleJob('*/5 * * * *', update); // every 5 min
  })
  .catch((error) => {
    console.error(error)
  })

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/pt', (req, res) => {
  db.all(`SELECT * FROM entries LIMIT 500`, (err, rows) => {
    if(!err) res.send(JSON.stringify(rows))
    else res.status(500).send(err)
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


