$(document).ready(function () {
  var htmlGiorno = $("#calendar-template").html();
  var templateGiorno = Handlebars.compile(htmlGiorno);

  // Stampare il mese di Gennaio 2018
  // Tramite click stampare il mese successivo

  var dataVisualizzata = moment("2018-01-01");
  stampaGiorniMese(dataVisualizzata); // Inizializzazione Calendario
  stampaFestivi();

  $(".mese-succ").click(function () {
    dataVisualizzata.add(1, "month");
    console.log(dataVisualizzata.format("YYYY-MM-DD"));
    stampaGiorniMese(dataVisualizzata);
    stampaFestivi();
  });

  $(".mese-prec").click(function () {
    dataVisualizzata.subtract(1, "month");
    console.log(dataVisualizzata.format("YYYY-MM-DD"));
    stampaGiorniMese(dataVisualizzata);
    stampaFestivi();
  });

  function stampaFestivi() {
    $.ajax({
      url: "https://flynn.boolean.careers/exercises/api/holidays",
      method: "GET",
      data: {
        year: dataVisualizzata.year(), //è il 2018 inquesto caso: non ci sono altri anni
        month: dataVisualizzata.month(),
      },
      success: function (data) {
        var giorniFestivi = data.response;
        for (var i = 0; i < giorniFestivi.length; i++) {
          var giornoFestivo = giorniFestivi[i];
          var nomeFestivo = giornoFestivo.name;
          var dataFestivo = giornoFestivo.date;
          $('#calendar li[data-day="' + dataFestivo + '"]')
            .addClass("festivo")
            .append(" - " + nomeFestivo);
        }
      },
    });
  }

  function stampaGiorniMese(meseDaStampare) {
    //meseDaStampare è dataVisualizzata in questo caso, con un altro nome
    $("#calendar").empty();
    var standardDay = meseDaStampare.clone(); // 1 gennaio 2018
    var giorniMese = meseDaStampare.daysInMonth();
    var nomeMese = meseDaStampare.format("MMMM");
    $("#nome-mese").text(nomeMese); // Aggiorniamo il nome del mese in top calendar
    controlloBottoni();
    for (var i = 1; i <= giorniMese; i++) {
      // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
      var giornoDaInserire = {
        day: i + " " + nomeMese,
        dataDay: standardDay.format("YYYY-MM-DD"),
      };
      var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
      $("#calendar").append(templateFinale);
      standardDay.add(1, "day");
    }
  }
});

function controlloBottoni() {
  if ($("#nome-mese").text().toLowerCase() == "gennaio") {
    $(".mese-prec").attr("disabled", true);
  } else {
    $(".mese-prec").attr("disabled", false);
    //$(".mese-prec").removeAttr("disabled");
  }

  if ($("#nome-mese").text().toLowerCase() == "dicembre") {
    $(".mese-succ").attr("disabled", true);
  } else {
    $(".mese-succ").attr("disabled", false);
    //$(".mese-succ").removeAttr("disabled");
  }
}
