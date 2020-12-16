/*
-- Author: M Bilal
-- Created on 16 December, 2020
-- Test Controller for all Covid API's
*/
const utils_response = require('../../utils/utils_response');
const { Op } = require('../../../config/db');
const axios  = require('axios');
const {locationsData}= require('../../../config/covidCountries')
// Add Test API
let covidInfo = (req, res) => {
   axios.get('https://api.covid19api.com/summary').then(response=>{
    if (response.data) {
      
        let finalResponse = [];
        let status = '';
        locationsData.map(location=>{
            let filterData = response.data.Countries.filter(countryData=>  countryData.CountryCode == location.country).shift()
                if(filterData.NewConfirmed < 500){
                    status = 'LOW'
                }
                else if(filterData.NewConfirmed >  500 && filterData.NewConfirmed <= 2500){
                    status = 'MEDIUM'
                }
                else if(filterData.NewConfirmed > 2500 && filterData.NewConfirmed <= 10000){
                    status = 'HIGH'
                }
                else if(filterData.NewConfirmed > 10000){
                    status = 'EXTREME'
                }
                let  responseObj = {
                    city: location.city,
                    risk : status
                };
                finalResponse.push(responseObj);
           
        });
        return utils_response.makeResponse(res, true, 200, 'success', 'Fected User', 'Data Fetched Successfully.', finalResponse);
      }
      else {
        return utils_response.makeResponse(res, false, 200, 'error', 'Request not successful', 'No data available.');
    
      }
   }).catch(err=>{
    return utils_response.makeResponse(res, false, 200, 'error', 'Request not successful', err);
   })
     
}
let cronjobTriggered = ()=>{
console.log("******************* Cron job has been triggered *******************");
covidInfo();
}
module.exports = { 
    covidInfo, 
    cronjobTriggered
    
} 