"use strict";

const { httpify } = require("caseless");
const fs = require("fs");
const request = require("request");
const http = require("http");

function reqStart(req, res) {
  console.log("Start function was called");
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  fs.createReadStream("../client/index.html", "utf-8").pipe(res);
}

function indexCSS(req, res) {
  console.log("Index CSS function was called");
  res.writeHead(200, {
    "Content-Type": "text/css",
  });
  fs.createReadStream("../css/index.css").pipe(res);
}

function clientJS(req, res) {
  console.log("Client JS function was called");
  res.writeHead(200, {
    "Content-Type": "text/js",
  });
  fs.createReadStream("../client/client.js").pipe(res);
}

function search(req, res) {
  console.log("Search function was called");

  var data = "";
  req.on("data", function (chunk) {
    data += chunk;
    console.log("Data from client: " + data);
  });

  req.on("end", function () {
    const obj = JSON.parse(data);
    const year = obj.year; // String
    const startMonth = parseInt(obj.startMonth); // store as int
    const endMonth = parseInt(obj.endMonth); // store as int

    const intYear = parseInt(year);

    if (intYear >= 2007 && intYear <= 2009) {
      // XML files
    } else if (intYear >= 2010 && intYear <= 2016) {
      // JSON files
      // Request module to get remote file and store into a variable
      request.get(
        `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.json`,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("Retrieving JSON file");
            var data = body;
            var objJSON = JSON.parse(data);
            var processedObj = processDataJSON(objJSON, startMonth, endMonth);
            var toReturn = JSON.stringify(processedObj);
            res.end(toReturn);
          }
        }
      );
    }
  });
}
var processDataXML = function (obj, startMonth, endMonth) {};
var processDataJSON = function (obj, startMonth, endMonth) {
  console.log("Function processDataJSON called");
  var totalSolarRadiation = 0; // w/m^2
  var totalWindSpeed = 0; // m/s
  var count = 0;
  var avgWindSpeed = 0;
  var solarRadiationConverted = 0; // kWh/m^2
  var avgWindSpeedConverted = 0; // km/h

  var solarRadiationMap = new Map();
  var windSpeedMap = new Map();

  var objLength = obj.weather.record.length; // Object --> Weather --> Record

  for (var i = startMonth; i <= endMonth; i++) {
    // For each month
    console.log(`Retriving month: ${i}`);
    count = 0; // To reset values for 'new' month
    totalSolarRadiation = 0;
    totalWindSpeed = 0;

    for (var j = 0; j < objLength; j++) {
      // For record in the object
      var month = parseInt(obj.weather.record[j].date.substring(3, 5)); // Get the int value of the month dd/mm/yyyy
      if (month == i) {
        count++;
        if (obj.weather.record[j].sr >= 100) {
          // Only take in readings >= W/m^2
          totalSolarRadiation += obj.weather.record[j].sr;
        }
        totalWindSpeed += obj.weather.record[j].ws;
      }
    }
    solarRadiationConverted = totalSolarRadiation / 1000 / 60;
    solarRadiationConverted = solarRadiationConverted.toFixed(2);

    avgWindSpeed = totalWindSpeed / count;
    avgWindSpeedConverted = (avgWindSpeed * 60 * 60) / 1000;
    avgWindSpeedConverted = avgWindSpeedConverted.toFixed(2);

    solarRadiationMap[i] = solarRadiationConverted;
    windSpeedMap[i] = avgWindSpeedConverted;
  }

  var toReturn = {
    sr: solarRadiationMap,
    ws: windSpeedMap,
  };
  console.log("End of processDataJSON");
  return toReturn;
};

function error(req, res) {
  console.log("Error function was callled");
  res.writeHead(404, {
    "Content-Type": "text/html",
  });
  res.write("<h1>404 not found</h1>\n");
  res.end();
}

exports.reqStart = reqStart;
exports.indexCSS = indexCSS;
exports.clientJS = clientJS;
exports.search = search;
exports.error = error;
