$(document).ready(function () {
  $(".table-container").hide();
  $(".graph-container").hide();
  $(".loader").hide();
});

$(function () {
  $("#submit").on("click", function (event) {
    $(".loader").show();
    $(".table-container").hide();
    $(".graph-container").hide();
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

        if (inputOutput == "table") {
          $(".graph-container").hide();
          createTable(
            objJSON,
            inputStartMonth,
            inputEndMonth,
            inputMeasurement
          );
        } else if (inputOutput == "graph") {
          $(".table-container").hide();
          createGraph(
            objJSON,
            inputStartMonth,
            inputEndMonth,
            inputMeasurement
          );
        } else {
          $(".table-container").show();
          $(".graph-container").show();
          createTable(
            objJSON,
            inputStartMonth,
            inputEndMonth,
            inputMeasurement
          );
          createGraph(
            objJSON,
            inputStartMonth,
            inputEndMonth,
            inputMeasurement
          );
        }
      });
    }
  });
});

const createTable = (data, startMonth, endMonth, dataType) => {
  $("table").remove();
  var table =
    "<div style='overflow-x:auto;'><table>" +
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
      solarradiation += "<td>&nbsp;</td>";
    } else {
      if (data.sr[srIterator] == "NaN" || data.sr[srIterator] <= 0) {
        solarradiation += "<td>No data</td>";
      } else {
        solarradiation += `<td>${data.sr[srIterator]}</td>`;
      }
      srIterator++;
    }
  }
  solarradiation += "</tr>";

  if (dataType == "windspeed") {
    table += windspeed;
  } else if (dataType == "solarradiation") {
    table += solarradiation;
  } else {
    table += windspeed;
    table += solarradiation;
  }
  table += "</table></div>";

  $(".table-container").show();
  $(".table-format").append(table);
  $(".loader").hide();
};

const createGraph = (data, startMonth, endMonth, dataType) => {
  // To ensure new graph is displayed
  $("#myChart").remove();
  $(".graph-container").append("<canvas id='myChart'></canvas>");

  var months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  startMonth = parseInt(startMonth);
  endMonth = parseInt(endMonth);

  var monthsRange = [];

  for (let i = startMonth; i <= endMonth; i++) {
    monthsRange.push(months[i - 1]);
  }

  var windspeedData = [];
  for (let i = 0; i < monthsRange.length; i++) {
    if (data.ws[i] == "NaN" || data.ws[i] <= 0) {
      windspeedData.push({ x: monthsRange[i], y: 0 });
    } else {
      windspeedData.push({ x: monthsRange[i], y: data.ws[i] });
    }
  }

  var solarradiationData = [];
  for (let i = 0; i < monthsRange.length; i++) {
    if (data.sr[i] == "NaN" || data.sr[i] <= 0) {
      solarradiationData.push({ x: monthsRange[i], y: 0 });
    } else {
      solarradiationData.push({ x: monthsRange[i], y: data.sr[i] });
    }
  }

  var ctx = document.getElementById("myChart").getContext("2d");

  if (dataType == "windspeed") {
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthsRange,
        datasets: [
          {
            data: windspeedData,
            backgroundColor: "rgba(224,251,252, 0.5)",
            label: "Wind Speed (km/h)",
            borderColor: "#e0fbfc",
            fill: true,
          },
        ],
      },
    });
  } else if (dataType == "solarradiation") {
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthsRange,
        datasets: [
          {
            data: solarradiationData,
            backgroundColor: "rgba(238,108,77, 0.5)",
            label: "Solar Radiation (kWh/m2)",
            borderColor: "#ee6c4d",
            fill: true,
          },
        ],
      },
    });
  } else {
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthsRange,
        datasets: [
          {
            data: solarradiationData,
            backgroundColor: "rgba(238,108,77, 0.5)",
            label: "Solar Radiation (kWh/m2)",
            borderColor: "#ee6c4d",
            fill: true,
          },
          {
            data: windspeedData,
            backgroundColor: "rgba(224,251,252, 0.5)",
            label: "Wind Speed (km/h)",
            borderColor: "#e0fbfc",
            fill: true,
          },
        ],
      },
    });
  }
  $(".graph-container").show();
  $(".loader").hide();
};
