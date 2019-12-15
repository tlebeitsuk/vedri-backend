const fetch = require('node-fetch')
isEqual = require('date-fns/isEqual')

const getDataSMHI = async (lat, lon) => {
  const data = await fetch(
    `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
  ).catch(() => {
    console.log('Error in fetching posts from SMHI')
  })

  if (data) {
    const json = await data.json()
    return json.timeSeries
  } else {
    return []
  }
}

const parseDataSMHI = (data, time) => {
  const filtered = data.filter(obj =>
    obj ? isEqual(new Date(obj.validTime), time) : false
  )[0]

  if (filtered) {
    return {
      temperature: filtered.parameters[1].values[0],
      precipitation: filtered.parameters[16].values[0],
      pressure: filtered.parameters[0].values[0],
      humidity: filtered.parameters[5].values[0],
      windDirection: filtered.parameters[3].values[0],
      windSpeed: filtered.parameters[4].values[0],
      windGust: filtered.parameters[11].values[0]
    }
  } else {
    return null
  }
}

module.exports = {
  getDataSMHI,
  parseDataSMHI
}
