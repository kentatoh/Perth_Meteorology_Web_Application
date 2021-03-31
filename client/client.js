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
  windspeed += "<tr><td>Wind Speed km/h </td>";
  for (let i = 1; i <= 12; i++) {
    if (i < startMonth || i > endMonth) {
      windspeed += "<td><td>";
    } else {
      windspeed += `<td>${data.ws[i - 1]}</td>`;
      console.log(data.ws[i - 1]);
    }
  }
  windspeed += "</tr>";

  var solarradiation = "";
  solarradiation += "<tr><td>Solar Radiation kWh/m<sup>2</sup></td>";
  for (let i = 1; i <= 12; i++) {
    if (i < startMonth || i > endMonth) {
      solarradiation += "<td><td>";
    } else {
      solarradiation += `<td>${data.sr[i - 1]}</td>`;
      console.log(data.sr[i - 1]);
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
  $(".table-container").append(table);
};

const createGraph = () => {};
