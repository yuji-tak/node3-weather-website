const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
// weather-appで作成したものを利用
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// ⭐️テンプレートエンジンを読み込み
// Home
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Yuji'
  })
})
// About
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Yuji'
  })
})
// Help
app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'sample',
    title: 'Help',
    name: 'Yuji'
  })
})
// Weather
app.get('/weather', (req, res) => {
  // queryに『?address=都市名』と記載するルールの定義元は？
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude,longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location,
        // 正しく検索クエリがリクエストされた場合、値を取得
        address: req.query.address
      })
    })
  })
})
// Products
app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})
// Help/*
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Yuji',
    errorMessage: 'Sorry! Help article not found.'
  })
})
// *
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Yuji',
    errorMessage: 'Sorry! Page not found.'
  })
})

// listen
app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})
