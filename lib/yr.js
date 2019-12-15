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
  } else {
    return []
  }
}

const parseDataYR = (data, time) => {
  const filtered = data.filter(obj =>
    obj ? isEqual(new Date(obj.to), time) : false
  )[0]

  if (filtered) {
    return {
      temperature: parseFloat(filtered.location.temperature.value),
      precipitation: null,
      pressure: parseFloat(filtered.location.pressure.value),
      humidity: parseFloat(filtered.location.humidity.value),
      windDirection: parseFloat(filtered.location.windDirection.deg),
      windSpeed: parseFloat(filtered.location.windSpeed.mps),
      windGust: parseFloat(filtered.location.windGust.mps)
    }
  } else {
    return null
  }
}

module.exports = {
  getDataYR,
  parseDataYR
}
