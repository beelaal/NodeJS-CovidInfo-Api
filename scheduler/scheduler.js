const schedule = require('node-schedule'),
    jobCron = require('../app/controllers/covidInfo/covid.controller');
schedule.scheduleJob('*/1 * * * *', jobCron.cronjobTriggered);
