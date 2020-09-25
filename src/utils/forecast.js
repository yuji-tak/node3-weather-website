const request = require('request')

const forecast = (latitude, longitude, callback) => {
  const url = 'http://api.weatherstack.com/current?access_key=3b004c537bf525350a841b286ca93b42&query=' + latitude + ',' + longitude

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
      callback('Unable to find location.', undefined)
    } else {
      callback(undefined, body.current.weather_descriptions[0])
      // callback(undefined, body.current.temperature)
    }
  })
}

module.exports = forecast
