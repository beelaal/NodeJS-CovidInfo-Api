/*
-- Author: M Bilal
-- Created on 16 December, 2020
-- All Covid routes
*/
const covidController = require('./covid.controller');  
module.exports = function (app, base) {
      // list all the details of covid 
     app.get(`${base}/covidInfo`, covidController.covidInfo);
      
}