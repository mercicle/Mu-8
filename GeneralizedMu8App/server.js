
/* Load these classes to setup the server,db, and routes */
var express = require('express'),
    path = require('path'),
    http = require('http'),
    MongoStore = require('connect-mongo')(express);    

//require the users routes
var user = require('./routes/users');
var computations = require('./routes/computations');
var visual = require('./routes/visualdata');
var aaIndices = require('./routes/aaIndices');

var app = express();

/* Configure the application */
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: "temp" })),
    app.use(express.cookieParser()),
    app.use(express.session({
        store: new MongoStore({url: 'mongodb://localhost:27017/mu8'}),
        secret: '1234567890QWERTY'
    })),
    app.use(express.static(path.join(__dirname, 'public')));
});

/***************************************************************
  Setup routes for the user management 
 ***************************************************************/

app.post('/users', user.signup);

app.get('/users/:id', user.findById);
app.put('/users/:id', user.update);

app.get('/users/get/session', user.session);

app.post('/users/login', user.login);
app.post('/users/logout', user.logout);

app.get('/users/checkUsername/:username', user.checkUsername);
app.get('/users/checkUsernameAtLogin/:username', user.checkUsernameAtLogin);
app.get('/users/checkEmail/:email', user.checkEmail);
app.put('/users/changePassword/:id', user.changePassword);


/***************************************************************
  Setup routes for the computation management 
 ***************************************************************/

app.get('/computations/:id', computations.findByComputationId);
app.get('/computations/user/:user', computations.findByUser);
app.post('/computations', computations.addComputation);

app.get('/computations/checkComputationName/:netname', computations.checkComputationName);
app.delete('/computations/:id', computations.deleteComputation);

/***************************************************************
  Setup routes for visualizing results
 ***************************************************************/
app.get('/visualdata/:computationId', visual.getDataForVisualization); 

/***************************************************************
  Setup routes for  aaIndices access
 ***************************************************************/
app.get('/aaIndices', aaIndices.getAllIndexNames);
app.get('/aaIndices/:aaIndexName', aaIndices.getIndexValues);

// finally, create the server and output a console message
http.createServer(app).listen(app.get('port'), function () {
    console.log("Mu-8 Server Listening on Port " + app.get('port'));
});
