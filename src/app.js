const express = require('express');
const path = require('path');
const fs = require('fs');
const geocode = require('./utils/geocode.js');
const weather = require('./utils/weather.js');
const hbs = require('hbs');
const app = express();
 
//define paths 
const publicDirPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

app.set('view engine','hbs');
app.set('views',viewsPath);

//middleware
app.use((req ,resp ,next)=>{
    //console.log(req);
    var requestinfo = `${new Date().toString()} >>  Method : ${req.method} , Url : ${req.url} `;
    fs.appendFile('clientRequsetData.log',requestinfo+"\n",(error)=>{
        if(error){
            console.log('Unable to Write Clinet Request Data');
        }
    });
    next();
});

var getWeather = (address,callback)=>{
    console.log('getWeather is Start');
    geocode.geocodeAddress(address,(errorMessage , {state ,country , pincode ,latitude ,longitude }) =>{
        if(errorMessage){
           callback(errorMessage);
        }
        else{
            weather.getWeather(latitude ,longitude ,(errorMessage , {temperature ,apparentTemperature})=>{
                if(errorMessage){
                    callback(errorMessage);
                }
                else{
                    callback(undefined,{
                        state,
                        country,
                        latitude,
                        longitude,
                        temperature,
                        apparentTemperature
                    });
                }
            });
        }
    });
};

hbs.registerPartials(partialsPath);
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
})

 
var name = "Chirag Lodariya";
app.get('',(req,resp)=>{
    resp.render('index',{
        title : 'Weather App',
        name 
    })
});
app.use(express.static(publicDirPath));


app.get('/help',(req,resp)=>{
    resp.render('help',{
        title: 'Help',
        message : 'This is Help Page',
        name 
    });
})

app.get('/about',(req,resp)=>{
    resp.render('about',{
        title : 'About',
        name 
    });
})


app.get('/weatherdisplay',(req,resp)=>{
    if(!req.query.address)
    {
        return resp.render('weatherdisplay',{
            title : 'Weather',
            message :'You need To Enter Address',
            name
        });
         
    }
    getWeather(req.query.address,(error,{temperature , apparentTemperature})=>{
        if(error){
            return resp.render('weatherdisplay',{
                title : req.query.address+' Weather',
                message :error,
                name
            });
        }
        else{
            return resp.render('weatherdisplay',{
                title : req.query.address+' Weather',
                message :'Temperature : '+temperature+' ApparentTemperature : '+apparentTemperature,
                name
            });
        }
    });
   
})

app.get('/weather',(req,resp)=>{
    if(!req.query.address)
    {
        return resp.send('You need To Enter Address');
    }
    getWeather(req.query.address,(error,{temperature , apparentTemperature})=>{
        if(error){
            resp.send(error);
        }
        else{
            resp.send({temperature,apparentTemperature});
        }
    });
})

app.get('*',(req , resp)=>{
    resp.render('404',{
        title : '404 Error',
        errorMessage : 'Page is not Found',
        name 
    });
})

app.listen(3000,()=>{
    console.log('Server is on port 3000');
})