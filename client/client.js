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

    if (inputStartMonth > inputEndMonth) {
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
        console.log(data);
        const objJSON = JSON.parse(data);
        console.log(objJSON);
      });
    }
  });
});
