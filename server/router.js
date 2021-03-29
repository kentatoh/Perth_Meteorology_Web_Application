"use strict";

function route(handle, pathname, req, res) {
  if (typeof handle[pathname] === "function") {
    handle[pathname](req, res);
  } else {
    handle["error"](req, res);
  }
}

exports.route = route;
