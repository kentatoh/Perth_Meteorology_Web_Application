"use strict";

const srv = require("./server");
const route = require("./router");
const handlers = require("./handlers");

var handle = {};

srv.startServer(router.route, handle);

