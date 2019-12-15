const express = require('express')
app = express()
port = process.env.PORT || 5000

const cors = require('cors')
app.use(cors())

const addHours = require('date-fns/addHours')
startOfHour = require('date-fns/startOfHour')

const { getDataSMHI, parseDataSMHI } = require('./lib/smhi')
const { getDataYR, parseDataYR } = require('./lib/yr')
const { getDataFMI, parseDataFMI } = require('./lib/fmi')

app.get('/forecast/lat/:lat/lon/:lon', async (req, res) => {
  const dataSMHI = await getDataSMHI(req.params.lat, req.params.lon)
  dataYR = await getDataYR(req.params.lat, req.params.lon)
  dataFMI = await getDataFMI(req.params.lat, req.params.lon)

  let result = {}

  // forecast for 48 hours
  for (let i = 1; i < 49; i++) {
    const time = addHours(startOfHour(new Date()), i)

    result[i] = {
      time: time,
      smhi: parseDataSMHI(dataSMHI, time),
      yr: parseDataYR(dataYR, time),
      fmi: parseDataFMI(dataFMI, time)
    }
  }
  res.send(result)
})

const notFound = (req, res, next) => {
  const error = new Error('Not found')
  res.status(404)
  next(error)
}

const errorHandler = (error, req, res, next) => {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log('Server is up and listening on port', port))
