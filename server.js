const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.use(express.static('public'))

var db
// MongoClient.connect('mongodb://root:admin@ds013946.mlab.com:13946/star-wars-quotes', (err, database) => {
MongoClient.connect('mongodb://localhost:27017/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)

  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

// app.listen(3000, function() {
//   console.log('listening on 3000')
// })

// app.get('/', function(req, res) {
//   res.send('Hello World')
// })

// app.get('/form', (req, res) => {
//   res.sendFile('/home/vinicius/Documents/code/express' + '/index.html')
// })

app.get('/', (req, res) => {
  // var cursor = db.collection('quotes').find().toArray(function(err, results) {
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) return console.log(err)

    res.render('index.ejs', {quotes: result})
  })

  // console.log(cursor)
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
    .findOneAndUpdate({
      name: 'Yoda'
    }, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
    })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes')
    .findOneAndDelete({name: req.body.name},
    (err, result) => {
      if (err) return res.send(500, err)

      res.send('A darth vader quote got deleted')
    })
})
