"use strict";

const srv = require("./server");
const router = require("./router");
const handlers = require("./handler");

var handle = {
  "/": handlers.reqStart,
  "/indexCss": handlers.indexCss,
  error: handlers.error,
};

srv.startServer(router.route, handle);
