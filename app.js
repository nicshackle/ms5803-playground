var ms5803 = require('ms5803');
var sensor = new ms5803(addr=0x76);

sensor.reset()
	.then(sensor.begin)
	.then((c)=>{
		console.log("calibration array: " + c);
	})
	.catch((error)=>{
		console.error(error);
	});
	
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/temp', (req, res) => {
	sensor.measure()
			.then((r)=>{
				res.send(JSON.stringify(r));
			})
	})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
