const express = require('express')
const cors = require('cors')
const { getDataSMHI, parseDataSMHI } = require('./lib/smhi')
const { getDataYR, parseDataYR } = require('./lib/yr')
const { getDataFMI, parseDataFMI } = require('./lib/fmi')
const addHours = require('date-fns/addHours')
const startOfHour = require('date-fns/startOfHour')

app = express()

app.get('/forecast/lat/:lat/lon/:lon', async (req, res) => {
  const dataSMHI = await getDataSMHI(req.params.lat, req.params.lon)
  const dataYR = await getDataYR(req.params.lat, req.params.lon)
  const dataFMI = await getDataFMI(req.params.lat, req.params.lon)

  let result = {}

  // forecast for the next 24 hours
  for (let i = 1; i <= 25; i++) {
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

app.use(cors())
app.use(notFound)
app.use(errorHandler)

port = process.env.PORT || 5000
app.listen(port, () => console.log('Server is up and running on port', port))
