$(document).ready(function () {
    $("#changeMode").click(function () {
      $("body").toggleClass("light-theme");
      if (
        $("#changeMode img").attr("src") ===
        "../../images/moon.svg"
      ) {
        $("#changeMode img").attr(
          "src",
          "../../images/sun.svg"
        );
      } else {
        $("#changeMode img").attr(
          "src",
          "../../images/moon.svg"
        );
      }
    });
  });
  