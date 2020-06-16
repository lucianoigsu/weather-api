'use strict';

const express = require('express');
const request = require('request-promise');

// Constants
const PORT = 3100;
const HOST = '0.0.0.0';
const BASE_ROUTE = "/v1"

const OPEN_WEATHER_URL = "http://api.openweathermap.org/data/2.5/"
const OPEN_WEATHER_KEY = "aacb5b06a886774afe32e7a3bee6dbd9"

const IP_API_URL = "http://ip-api.com/json/"

const UNIT_SYSTEM = "metric"
const LANG = "es"

const DEFAULT_LAT = "-58.38"
const DEFAULT_LON = "-34.61"

var getCityLocation = function(city){
    var lat,lon;
    switch (city) {
        case "bsas":
            lat = DEFAULT_LAT;
            lon = DEFAULT_LON;
            break;
        case "londres":
            lat = "51.50";
            lon = "-0.12";
            break;
        case "paris":
            lat = "48.85";
            lon = "2.35";
            break;
        case "tokio":
            lat = "35.68";
            lon = "139.74";
            break;
        case "newyork":
            lat = "40.63";
            lon = "-74.07";
            break;

        default:
            lat = DEFAULT_LAT;
            lon = DEFAULT_LON;
            break;
    }
    return {lat,lon}
}

// App
const app = express();

app.get(BASE_ROUTE+'/location', async function(req, res) {
    try {
        res.send(JSON.parse(await request(IP_API_URL+'?lang=es')));
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

app.get(BASE_ROUTE+'/current/:city?', async function(req, res) {

    var lat
    var lon
    var path
    var exclude = "minutely,hourly,daily"

    if(!req.params.city)
    {
        try {
            var ipCity = await request(IP_API_URL+'?fields=lat,lon&lang=es')
            ipCity = JSON.parse(ipCity);

            if(ipCity && ipCity.lat && ipCity.lon)
            {
                lat = ipCity.lat
                lon = ipCity.lon
                path = OPEN_WEATHER_URL+'onecall?lat='+lat+"&lon="+lon+"&exclude="+exclude+"&units="+UNIT_SYSTEM+"&lang="+LANG+"&appid="+OPEN_WEATHER_KEY
                var weather = await request(path)
                res.send(JSON.parse(weather));
            }
            else
            {
                throw new Error("Missing data");
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
    else
    {
        var location = getCityLocation(req.params.city)
        lat = location.lat
        lon = location.lon;
        try {
            path = OPEN_WEATHER_URL+'onecall?lat='+lat+"&lon="+lon+"&exclude="+exclude+"&units="+UNIT_SYSTEM+"&lang="+LANG+"&appid="+OPEN_WEATHER_KEY
            res.send( JSON.parse( await request(path) ) )
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
});

app.get(BASE_ROUTE+'/forecast/:city?', async function(req, res) {

    var lat
    var lon
    var path
    var exclude = "minutely,hourly"

    if(!req.params.city)
    {
        try {
            var ipCity = await request(IP_API_URL+'?fields=lat,lon&lang=es')
            ipCity = JSON.parse(ipCity);

            if(ipCity && ipCity.lat && ipCity.lon)
            {
                lat = ipCity.lat
                lon = ipCity.lon
                path = OPEN_WEATHER_URL+'onecall?lat='+lat+"&lon="+lon+"&exclude="+exclude+"&units="+UNIT_SYSTEM+"&lang="+LANG+"&appid="+OPEN_WEATHER_KEY
                var weather = await request(path)
                res.send(JSON.parse(weather));
            }
            else
            {
                throw new Error("Missing data");
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
    else
    {
        var location = getCityLocation(req.params.city)
        lat = location.lat
        lon = location.lon;
        try {
            path = OPEN_WEATHER_URL+'onecall?lat='+lat+"&lon="+lon+"&exclude="+exclude+"&units="+UNIT_SYSTEM+"&lang="+LANG+"&appid="+OPEN_WEATHER_KEY
            res.send( JSON.parse( await request(path) ) )
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);