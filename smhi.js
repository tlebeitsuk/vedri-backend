const fetch = require('node-fetch')
const isEqual = require('date-fns/isEqual')

const getDataSMHI = async (lat, lon) => {
  const data = await fetch(
    `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
  ).catch(() => {
    console.log('Error in fetching posts from SMHI')
  })

  if (data) {
    const json = await data.json()
    return json.timeSeries
  }
}

const parseDataSMHI = (data, time) => {
  const filtered = data.filter(obj =>
    obj ? isEqual(new Date(obj.validTime), time) : false
  )[0].parameters

  return {
    temperature: filtered[1].values[0],
    precipitation: filtered[16].values[0],
    pressure: filtered[0].values[0],
    humidity: filtered[5].values[0],
    windDirection: filtered[3].values[0],
    windSpeed: filtered[4].values[0],
    windGust: filtered[11].values[0]
  }
}

module.exports = {
  getDataSMHI,
  parseDataSMHI
}
