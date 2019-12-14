const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors')
app.use(cors())

const addHours = require('date-fns/addHours')
const startOfHour = require('date-fns/startOfHour')

const { getDataSMHI, parseDataSMHI } = require('./smhi')
const { getDataYR, parseDataYR } = require('./yr')
const { getDataFMI, parseDataFMI } = require('./fmi')

app.get('/forecast/lat/:lat/lon/:lon', async (req, res) => {
  const dataSMHI = await getDataSMHI(req.params.lat, req.params.lon)
  const dataYR = await getDataYR(req.params.lat, req.params.lon)
  const dataFMI = await getDataFMI(req.params.lat, req.params.lon)

  let result = {}

  for (let i = 1; i < 49; i++) {
    let time = addHours(startOfHour(new Date()), i)

    result[i] = {
      time: time,
      smhi: parseDataSMHI(dataSMHI, time),
      yr: parseDataYR(dataYR, time),
      fmi: parseDataFMI(dataFMI, time)
    }
  }
  res.send(result)
})

function notFound(req, res, next) {
  const error = new Error('Not found')
  res.status(404)
  next(error)
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log('Server is up and listening on port', port))
