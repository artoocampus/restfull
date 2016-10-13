$(document).ready(function() {


    var root = 'http://www.omdbapi.com/';
    var listOfMovies = [];
    var totalResults;
    $('.listaMovies').hide();
    $('.dettaglio').hide();

    //DISABILITA IL BOTTONE DI RICERCA E INVALIDA l'INPUT
    $("#buttonSearch").prop('disabled', true);
    $("#formTitle").addClass('has-error');

    //VERIFICA SE L'INPUT NON E' VUOTA
    $('#title').keyup(function() {
        if ($(this).val().length != 0) {
            $('#buttonSearch').attr('disabled', false);
            $("#formTitle").removeClass('has-error');
        } else {
            $('#buttonSearch').attr('disabled', true);
            $("#formTitle").addClass('has-error');
        }

    })

    //TRIGGER DELL' EVENTO CLICK
    $("#buttonSearch").click(function() {
        var title = $("#title").val();

        //CHIAMATA AJAX AL SERVIZIO OMDB
        $.ajax({
            url: root + '?s=' + title,
            method: 'GET'
        }).then(function(data) {
            if (data.Response === "True") {
                totalResults = data.totalResults;
                listOfMovies = data.Search;

                $("#result").html("Risultati: " + totalResults).css('color', 'black');
                $('.dettaglio').hide();
                $('.listaMovies').show();
                drawTable(listOfMovies);
            }
            if (data.Response === "False") {
                $('.listaMovies').hide();
                $("#result").html(data.Error).css('color', 'red');
            }
        });

    });

    //DRAW TABLE
    function drawTable(movies) {
        $('.res').remove();
        for (i in movies) {
            drawRow(movies[i]);
        }
    } 

    //DRAW ROW
    function drawRow(movie) {
        var row = $('<tr class="res" style="cursor:pointer" title="' + movie.Title + '"/>');
        $("#bodyMovies").append(row);
        row.append($('<td><img width="100" alt="poster" src="' + movie.Poster + '"/></td>'));
        row.append($('<td>' + movie.Title + '</td>'));
        row.append($('<td>' + movie.Type + '</td>'));
        row.append($('<td>' + movie.Year + '</td>'));
    }


    //TRIGGERA L'EVENTO CLICK SU UNA SINGOLA RIGA

    $('tbody').on("click", "tr", function() {
        var titleMovie = $(this).attr("title");

     //CHIAMATA AJAX AL DETTAGLIO DEL FILM
     $.ajax({
            url: root + '?t=' + titleMovie,
            method: 'GET'
        }).then(function(data) {
            if (data.Response === "True") {
            	$('.listaMovies').hide();
                $('.dettaglio').show();
                drawDettaglio(data);
            }
            if (data.Response === "False") {
                 $('.dettaglio').hide();
            }
        });
    });

});
