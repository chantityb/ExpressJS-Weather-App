//using express framework
const express = require('express');
// body-parser allows us to make use of the key-value pairs stored on the req-body object
const bodyParser = require('body-parser');
//using simplified HTTP client
const request = require('request');

//set up listening port
const port = process.env.PORT || 3000;

const app = express();
//using OpenWeatherMap API 
const apiKey = '73f73aecd54d6498254972fdb875ab42';



//exposes style.css file in public/css folder as well as img folder
//To have /img in your request URL, use: app.use("/styles", express.static(__dirname + '/styles'));
//app.use('/img', express.static(__dirname + '/img'));

// GET /style.css and img
app.use(express.static('public'));
//app.use(express.static(__dirname + 'public'));

//accessing bootstrap
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Mount the middleware at "/static" to serve static content only when their request path is prefixed with "/static".

// GET /static/style.css etc.
//app.use('/static', express.static(__dirname + 'public'));

//extends req-body object.  allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true)
app.use(bodyParser.urlencoded({ extended: true }));

/* sets up ejs template engine. A template engine enables you to use static template files in your application. 
At runtime, the template engine replaces variables in a template file with actual values, and transforms the 
template into an HTML file sent to the client. This approach makes it easier to design an HTML page */
app.set('view engine', 'ejs')

//sets up get route
app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

//sets up post route. Also sets up URL. When post request is received it grabs the city off of "req.body" then a url is created as a string that will access the OpenWeatherMap API
app.post('/', function (req, res) {
	let city = req.body.city;
  	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`


/* makes API call. When callback is received errors are checked first, if error render index page "error message"
if our user inputs a string that isn’t a city render index "error message" 
if all is good then app sends back the weather to the client */
request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
}) 

//create server
app.listen(port, function () {
  console.log('Hey queen, the app  is listening on port 8080!')
})