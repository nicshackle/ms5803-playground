var ms5803 = require('ms5803')
var sensor = new ms5803(addr = 0x76)

sensor.reset()
  .then(sensor.begin)
  .then((c) => {
    console.log("calibration array: " + c)
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
  })
  .catch((error) => {
    console.error(error)
  })

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/temp', (req, res) => {
  sensor.measure()
    .then((r) => {
      if(r.temperature > 100) res.status(500).send("sensor error")
      else res.send(JSON.stringify(r))
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get('/pressure', (req, res) => {
  sensor.measure()
    .then((r) => {
      if(r.pressure > 5000 || r.pressure < 0) res.status(500).send("sensor error")
      else res.send(JSON.stringify(r))
    })
    .catch((error) => {
      console.error(error)
    })
})
