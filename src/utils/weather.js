const request = require('request');


var getWeather = (lat,lng,callback) =>{
    request({
        url : `https://api.darksky.net/forecast/e964612ca2066ceb90585f93016ff890/${lat},${lng}`,
        json : true
    },(error , responce , body)=>{
        if(error){
            callback('Unable to Connect with Server');
        }
        else if(responce.statusCode === 400){
            callback('Unable to fetch Weather');
        }
        else if(responce.statusCode === 200){
            callback(undefined, {
                temperature : body.currently.temperature ,
                apparentTemperature : body.currently.apparentTemperature
            });
        }
    });
};

module.exports = {getWeather};