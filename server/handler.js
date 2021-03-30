"use strict";

const fs = require("fs");

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
    console.log(data);
  });
}

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
