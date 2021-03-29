"use strict";

const fs = require("fs");

function reqStart(req, res) {
  console.log("Start function was called");
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  fs.createReadStream("../html/index.html", "utf-8").pipe(res);
}
