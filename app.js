const express = require('express')
require('express-async-errors');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser');

const path = require('path'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multitenancy = require('./multitenancy');
// validation rules
global.Validator = require('validatorjs');
// config
const config = require('./config/configJs');
// database config
const db = require('./config/db');
const { httpLogger } = require('./app/helper/logger');
const { logger } = require('./app/utils');
const app = express();
app.use(httpLogger);
app.use(multitenancy);
let ori = `http` + (config.client.secure ? `s` : ``) + `://` + config.client.hostname + `:` + config.client.port;
var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'X-PINGOTHE', 'Origin', 'X-Requested-With','Access-Control-Allow-Origin', 'Referer','User-Agent','Content-Type', 'Accept', 'X-Custom-header', 'Set-Cookie'],
  exposeHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
  credentials: true,
  preflightContinue: false
  // If preflightContinue is set to true, it will remove the authorization from the request, and all other modification from the user
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
let sessionExpiryTime = 60 * 20 * 1000 // 20 minitus
app.use(session({
  key: 'user_sid',
  resave: true,
  saveUninitialized: false,
  secret: "MySecretKeyToBeChangedInProdWhenDeploy",
  store: new MemoryStore(),
  maxAge: sessionExpiryTime,
  expires: sessionExpiryTime,
  rolling: true,
  cookie: { expires: sessionExpiryTime, maxAge: sessionExpiryTime, httpOnly: false }
}));

// app routes
require('./app/routes/routes')(app, '/api'); 
const appAllRoutes = [];
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    appAllRoutes.push(`${Object.keys(middleware.route.methods)} -> ${middleware.route.path}`);
  }
});

app.listen(config.server.port, config.server.hostname, () => {
  logger.info(`App listening on ${config.server.hostname} port: ${config.server.port}`, '');
  app.emit('appStarted');
});


module.exports = app; 
