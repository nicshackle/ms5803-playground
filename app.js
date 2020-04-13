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
          if(r.temperature > 100 || r.temperature < 100 || r.pressure > 5000 || r.pressure < 0){
            console.log("sensor error")
          }
          else{
            PT = r
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
