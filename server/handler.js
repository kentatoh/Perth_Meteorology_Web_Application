"use strict";

const fs = require("fs");
const request = require("request");
const parser = require("xml2json");

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

function reqLoadingImage(req, res) {
  console.log("Loading Image function was called");
  res.writeHead(200, {
    "Content-Type": "image/gif",
  });
  fs.createReadStream("../images/loading.gif").pipe(res);
}

function reqDropdownArrowImage(req, res) {
  console.log("Dropdown Arrow Image function was called");
  res.writeHead(200, {
    "Content-Type": "image/gif",
  });
  fs.createReadStream("../images/dropdown-arrow.png").pipe(res);
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
      // Request module to get remote file, process then store into a variable
      // Variable to be returned to the client side
      request.get(
        `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.xml`,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // No error and good status code
            console.log("Retrieving XML file ...");
            var data = parser.toJson(body); // XML data to JSON using xml2json module
            var objJSON = JSON.parse(data); // Parse JSON to JSON object
            var processedObj = processData(startMonth, endMonth, objJSON, 1); // 1 to indicate XML file
            var toReturn = JSON.stringify(processedObj); // Return to client as a string
            res.end(toReturn);
          } else {
            // Error or bad status code
            console.log(error);
          }
        }
      );
    } else if (intYear >= 2010 && intYear <= 2016) {
      // JSON files
      // Request module to get remote file, process then store into a variable
      // Variable to be returned to the client side
      request.get(
        `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.json`,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // No error and good status code
            console.log("Retrieving JSON file ...");
            var objJSON = JSON.parse(body); // Parse JSON into JSON object
            var processedObj = processData(startMonth, endMonth, objJSON, 0); // 0 to indicate JSON file
            var toReturn = JSON.stringify(processedObj);
            res.end(toReturn);
          } else {
            // Eerror or bad status code
            console.log(error);
          }
        }
      );
    }
  });
}

var processData = function (startMonth, endMonth, JSONobj, flag) {
  // Processing the data, with the starting month, ending month, json object, and the flag to determine if the data is from the XML or JSON file
  console.log("Function processData called");
  var totalSolarRadiation = 0; // w/m^2
  var totalWindSpeed = 0; // m/s
  var count = 0;
  var avgWindSpeed = 0;
  var solarRadiationConverted = 0; // kWh/m^2
  var avgWindSpeedConverted = 0; // km/h

  var solarRadiationArr = [];
  var windSpeedMapArr = [];

  var objLength = JSONobj.weather.record.length; // Object --> Weather --> Record

  for (var i = startMonth; i <= endMonth; i++) {
    // For each month
    console.log(`Retriving month: ${i}`);
    count = 0; // To reset values for 'new' month
    totalSolarRadiation = 0;
    totalWindSpeed = 0;

    for (var j = 0; j < objLength; j++) {
      // For record in the object
      var month = parseInt(JSONobj.weather.record[j].date.substring(3, 5)); // Get the int value of the month dd/mm/yyyy
      if (month == i) {
        count++;
        if (flag == 1) {
          // XML file stored the ws and sr as string, while JSON file stored ws and sr as integer
          if (JSONobj.weather.record[j].sr >= 100) {
            // Only take in readings >= W/m^2
            totalSolarRadiation += parseFloat(JSONobj.weather.record[j].sr);
          }
          totalWindSpeed += parseFloat(JSONobj.weather.record[j].ws);
        } else {
          if (JSONobj.weather.record[j].sr >= 100) {
            // Only take in readings >= W/m^2
            totalSolarRadiation += JSONobj.weather.record[j].sr;
          }
          totalWindSpeed += JSONobj.weather.record[j].ws;
        }
      }
    }
    solarRadiationConverted = totalSolarRadiation / 1000 / 60; // Formula given
    solarRadiationConverted = solarRadiationConverted.toFixed(2); // 2 dp

    avgWindSpeed = totalWindSpeed / count; // To find average
    avgWindSpeedConverted = (avgWindSpeed * 60 * 60) / 1000; // Formula given
    avgWindSpeedConverted = avgWindSpeedConverted.toFixed(2); // 2 dp

    // Store into a map
    solarRadiationArr.push(solarRadiationConverted);
    windSpeedMapArr.push(avgWindSpeedConverted);
  }

  // Return both map as an object
  var toReturn = {
    sr: solarRadiationArr,
    ws: windSpeedMapArr,
  };

  console.log("End of processData ...");
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
exports.reqLoadingImage = reqLoadingImage;
exports.reqDropdownArrowImage = reqDropdownArrowImage;
exports.search = search;
exports.error = error;
