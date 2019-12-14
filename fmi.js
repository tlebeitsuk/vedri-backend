const fetch = require('node-fetch')
const parser = require('fast-xml-parser')
const addDays = require('date-fns/addDays')
const startOfHour = require('date-fns/startOfHour')
const formatISO = require('date-fns/formatISO')
const isEqual = require('date-fns/isEqual')

const getDataFMI = async (lat, lon) => {
  const endTime = formatISO(addDays(startOfHour(new Date()), 2))
  const data = await fetch(
    `https://opendata.fmi.fi/wfs?service=WFS&request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple&timestep=60&&latlon=${lat},${lon}&parameters=temperature,precipitation1h,pressure,humidity,windDirection,windSpeedMS,windGust&endTime=${endTime}`
  ).catch(() => {
    console.log('Error in fetching posts from FMI')
  })

  if (data) {
    const json = await data.text()

    if (parser.validate(json) === true) {
      //optional (it'll return an object in case it's not valid)
      var jsonObj = parser.parse(json, { ignoreNameSpace: true })
    }

    return jsonObj.FeatureCollection.member
  }
}

const parseDataFMI = (data, time) => {
  const filtered = data.filter(obj =>
    obj ? isEqual(new Date(obj.BsWfsElement.Time), time) : false
  )

  return {
    temperature: parseFloat(filtered[0].BsWfsElement.ParameterValue.toFixed(1)),
    precipitation: parseFloat(
      filtered[1].BsWfsElement.ParameterValue.toFixed(1)
    ),
    pressure: parseFloat(filtered[2].BsWfsElement.ParameterValue.toFixed(1)),
    humidity: parseFloat(filtered[3].BsWfsElement.ParameterValue.toFixed(1)),
    windDirection: parseFloat(
      filtered[4].BsWfsElement.ParameterValue.toFixed(1)
    ),
    windSpeed: parseFloat(filtered[5].BsWfsElement.ParameterValue.toFixed(1)),
    windGust: parseFloat(filtered[6].BsWfsElement.ParameterValue.toFixed(1))
  }
}

module.exports = {
  getDataFMI,
  parseDataFMI
}
