const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

//views is the default directory that express uses for templates

hbs.registerPartials(__dirname + '/views/partials');

//handlebars is a view engine for express
app.set('view engine', 'hbs');


//next is for telling express when the middleware function is done
//if we do something asynchronous, the middleware is not gonna move on
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}:${req.method}  ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  next();                   //only when we do this, the application will continue to run
  //if the middleware doesnt come next, our handlers for each request are never going to fire
});


// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'We will be right back!',
//     maintenanceMessage: 'The site is being currently updated. We will be back soon'
//   });
// });

//express middleware (kind of like a third party add-on)
//app.use takes the middleware function you want to use
//dirname stores path to your project directory, in this case, to node-web-server
app.use(express.static(__dirname + '/public'));

//name of the helper is the first arg and the function to run is the second arg
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//setting up our HTTP route handlers
//second arg is the function that should be sent to the person who made the request
app.get('/',(req, res) => {             //registering a handler for a http get request
  //res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Snigdha',
  //   age: '23',
  //   hobby: ['singing','travelling']
  // });
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my website'
  });
});



app.get('/about', (req, res) => {
  // res.send('About page');
  res.render('about.hbs', {
    pageTitle: 'About page',
  });
});

app.get('/bad',(req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//binds the application to a port on our machine
//takes a function as a second arg which can let us do something once the server is up
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
