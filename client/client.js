$(function () {
  $("#submit").on("click", function (event) {
    event.preventDefault();

    var inputMeasurement = $("input[name='measurement']:checked").val();
    var inputStartMonth = $("#start-month").val();
    var inputEndMonth = $("#end-month").val();
    var inputYear = $("#year").val();
    var inputOutput = $("input[name='output']:checked").val();

    var obj = {
      year: inputYear,
      startMonth: inputStartMonth,
      endMonth: inputStartMonth,
    };

    var json = JSON.stringify(obj);
    console.log(json);
  });
});
