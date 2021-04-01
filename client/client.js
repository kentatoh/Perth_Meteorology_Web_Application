$(document).ready(function () {
  $(".table-container").hide();
});

$(function () {
  $("#submit").on("click", function (event) {
    event.preventDefault();

    var inputMeasurement = $("#measurement").val();
    var inputStartMonth = $("#start-month").val();
    var inputEndMonth = $("#end-month").val();
    var inputYear = $("#year").val();
    var inputOutput = $("#output").val();

    console.log(inputMeasurement);
    console.log(inputStartMonth);
    console.log(inputEndMonth);
    console.log(inputYear);
    console.log(inputOutput);

    if (parseInt(inputStartMonth) > parseInt(inputEndMonth)) {
      alert("Starting month should be before ending month!");
    } else {
      const obj = {
        year: inputYear,
        startMonth: inputStartMonth,
        endMonth: inputEndMonth,
      };
      var json = JSON.stringify(obj);
      console.log(json);

      $.post("/search", json, function (data) {
        const objJSON = JSON.parse(data);
        console.log(objJSON);

        if (inputMeasurement === "table") {
          $("graph-container").hide();
          createTable(objJSON, inputOutput);
        } else if (inputMeasurement === "graph") {
          $("table-container").hide();
          createGraph(objJSON, inputStartMonth, inputEndMonth, inputOutput);
        } else {
          createTable(objJSON, inputStartMonth, inputEndMonth, inputOutput);
          createGraph(objJSON, inputStartMonth, inputEndMonth, inputOutput);
        }
      });
    }
  });
});

const createTable = (data, startMonth, endMonth, dataType) => {
  $("table").remove();
  var table =
    "<table>" +
    "<tr>" +
    "<th></th>" +
    "<th>Jan</th>" +
    "<th>Feb</th>" +
    "<th>Mar</th>" +
    "<th>Apr</th>" +
    "<th>May</th>" +
    "<th>Jun</th>" +
    "<th>Jul</th>" +
    "<th>Aug</th>" +
    "<th>Sep</th>" +
    "<th>Oct</th>" +
    "<th>Nov</th>" +
    "<th>Dec</th>" +
    "</tr>";

  var windspeed = "";
  windspeed += "<tr><td>Wind Speed km/h</td>";
  var wsIterator = 0;
  for (let i = 1; i <= 12; i++) {
    if (i < startMonth || i > endMonth) {
      windspeed += "<td></td>";
    } else {
      if (data.ws[wsIterator] == "NaN" || data.ws[wsIterator] <= 0) {
        windspeed += "<td>No data</td>";
      } else {
        windspeed += `<td>${data.ws[wsIterator]}</td>`;
        console.log(data.ws[wsIterator]);
      }
      wsIterator++;
    }
  }
  windspeed += "</tr>";

  var solarradiation = "";
  solarradiation += "<tr><td>Solar Radiation kWh/m<sup>2</sup></td>";
  var srIterator = 0;
  for (let i = 1; i <= 12; i++) {
    if (i < startMonth || i > endMonth) {
      solarradiation += "<td></td>";
    } else {
      if (data.sr[srIterator] == "NaN" || data.sr[srIterator] <= 0) {
        solarradiation += "<td>No data</td>";
      } else {
        solarradiation += `<td>${data.sr[srIterator]}</td>`;
        console.log(data.sr[srIterator]);
      }
      srIterator++;
    }
  }
  solarradiation += "</tr>";

  if (dataType === "windspeed") {
    table += windspeed;
  } else if (dataType === "solarradiation") {
    table += solarradiation;
  } else {
    table += windspeed;
    table += solarradiation;
  }
  table += "<table>";
  console.log(table);
  $(".table-container").show();
  $(".table-format").append(table);
};

const createGraph = () => {};
