"use strict";

const srv = require("./server");
const router = require("./router");
const handlers = require("./handler");

var handle = {
  "/": handlers.reqStart,
  "/indexCSS": handlers.indexCSS,
  "/clientJS": handlers.clientJS,
  "/search": handlers.search,
  error: handlers.error,
};

srv.startServer(router.route, handle);
