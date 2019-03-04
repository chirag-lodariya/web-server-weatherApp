const request = require('request');

var geocodeAddress = (address,callback) =>{
        
    var encodedAddress = encodeURIComponent(address);

    const url =  `http://www.mapquestapi.com/geocoding/v1/address?key=KrbB41xksE7VZUXktaRCg2rNkoXtASfc&location=${encodedAddress}`

    request({
        url,
        json : true
    },(error,responce,body)=>{
        if(error){
            callback('Unable to connect with Server');
        }else if(body.info.statuscode === 400){
            callback.log('Address is not found');
        }
        else{
            callback(undefined,{
                state : body.results[0].locations[0].adminArea3,
                country : body.results[0].locations[0].adminArea1,
                pincode : body.results[0].locations[0].postalCode,
                latitude : body.results[0].locations[0].latLng.lat,
                longitude : body.results[0].locations[0].latLng.lng
            });
        }
    });
};

 //url:'http://sarvad7025.000webhostapp.com/getContacts.php',
module.exports = {geocodeAddress};