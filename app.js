require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require("method-override")
const mongoose = require('mongoose')
const connectDB = require('./server/config/db')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')

const app = express()
const port = process.env.PORT || 59080

// Connect to Database first
mongoose.set('strictQuery', false)
connectDB()

// Configure session store with proper options for connect-mongo v4+
// For connect-mongo v4+, use clientPromise with mongoose connection
const sessionStore = MongoStore.create({
    clientPromise: new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            // Already connected
            resolve(mongoose.connection.client)
        } else {
            // Wait for connection
            mongoose.connection.once('connected', () => {
                resolve(mongoose.connection.client)
            })
            mongoose.connection.once('error', (err) => {
                reject(err)
            })
        }
    }),
    touchAfter: 24 * 3600 // lazy session update
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
    // Date.now() - 30 * 24 * 60 * 60 * 1000
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))

// Static Files
app.use(express.static('public'))

// Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})



// Routes
app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))

// Handle 404
app.get('*', function (req, res) {
    //res.status(404).send('404 Page Not Found.')
    res.status(404).render('404')
})


app.listen(port, () => {
    console.log(`App listening on port http://localhost:${ port }`)
})