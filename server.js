const { urlencoded } = require("body-parser")
let express = require("express")
let mongodb = require("mongodb")
let connectionString = 'mongodb+srv://francohandel:handel4464@projects-cluster.ypnau.mongodb.net/test-projects?retryWrites=true&w=majority'
let db
let port = process.env.PORT  // setting port to deployment site
if (port == null || port == "") {
  port = 3000
}
let sanitizeHTML = require("sanitize-html") 
const app = express() 
//database connection
mongodb.connect(connectionString,{useUnifiedTopology: true},(err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  db = client.db()
 app.listen (port) 
})
app.set('view engine', 'ejs') //using ejs as a templating engine to render html
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
//password authentication to use app
const passwordAuth = (req,res,next) => {
  res.set('WWW-Authenticate', 'Basic realm = "simple todo app"')
  if (req.headers.authorization == 'Basic aGFuZGVsOg==') {
    next()
  } else {
    res.status(401).send('!!! authentication required, please enter valid credentials')
  }
}
app.use(passwordAuth)
// getting contents from the database and displaying on the index page on load
app.get('/', (req, res) => {
    db.collection('todo-list').find().toArray( (err, itemList) => { 
      res.render('index.ejs', { itemList })
    })
   })
// making a post to the database i.e (inserting object gotten from the html form into the database)
app.post('/myAction', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, { allowedTags:[], allowedAttributes:[] })
  db.collection('todo-list').insertOne({task:safeText},(err, info) => res.json(info.ops[0]))
})
// updating the database
app.post('/updateItem', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, { allowedTags:[], allowedAttributes:[] })
  db.collection('todo-list').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)},{$set:{task:safeText}},() => res.send('success'))
})
// deleting from the database
app.post('/deleteItem', (req, res) => {
  db.collection('todo-list').deleteOne({_id: new mongodb.ObjectId(req.body.id)},() => res.redirect('/'))
})