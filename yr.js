const fetch = require('node-fetch')
const isEqual = require('date-fns/isEqual')

const getDataYR = async (lat, lon) => {
  const data = await fetch(
    `https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=${lat}&lon=${lon}`
  ).catch(() => {
    console.log('Error in fetching posts from YR')
  })

  if (data) {
    const json = await data.json()
    return json.product.time
  }
}

const parseDataYR = (data, time) => {
  const filtered = data.filter(obj =>
    obj ? isEqual(new Date(obj.to), time) : false
  )[0].location

  return {
    temperature: parseFloat(filtered.temperature.value || null),
    precipitation: null,
    pressure: parseFloat(filtered.pressure.value) || null,
    humidity: parseFloat(filtered.humidity.value) || null,
    windDirection: parseFloat(filtered.windDirection.deg) || null,
    windSpeed: parseFloat(filtered.windSpeed.mps) || null,
    windGust: parseFloat(filtered.windGust.mps) || null
  }
}

module.exports = {
  getDataYR,
  parseDataYR
}
