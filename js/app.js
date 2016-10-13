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
   $('#search').submit(function(event) {
   		event.preventDefault();
        var title = $("#title").val();
        var genre =  $("#genre").val();

        //CHIAMATA AJAX AL SERVIZIO OMDB
        $.ajax({
            url: root + '?s=' + title + '&type=' + genre,
            method: 'GET'
        }).then(function(data) {
            if (data.Response === "True") {
                totalResults = data.totalResults;
                listOfMovies = data.Search;
                $("#resultError").hide();
                $("#result").html("Risultati: " + totalResults).css('color', 'black');
                $('.dettaglio').hide();
                $('.listaMovies').show();
                drawTable(listOfMovies);
            }
            if (data.Response === "False") {
                $('.listaMovies').hide();
                $('.dettaglio').hide();
                $("#resultError").html(data.Error).css('color', 'red').show();
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
                $("#resultError").hide();
                $('.listaMovies').hide();
                $('.dettaglio').show();
                drawDettaglio(data);
            }
            if (data.Response === "False") {
            	$("#resultError").hide();
                $('.listaMovies').hide();
                $('.dettaglio').hide();
            }
        });
    });

    //DRAW DETTAGLIO
    function drawDettaglio(dettaglio) {
        $('#titoloFilm').html(dettaglio.Title);
        $('#poster').html('<img width="200x350" src="' + dettaglio.Poster + '"/>');
        $('#lista1 li').remove();
        $('#lista2 li').remove();
        $('#cast li').remove();

        $('#lista1')
            .append('<li>' + dettaglio.imdbRating + '</li>')
            .append('<li>' + dettaglio.Year + '</li>')
            .append('<li>' + dettaglio.Director + '</li>')
            .append('<li>' + dettaglio.Writer + '</li>');
        $('#lista2')
            .append('<li>' + dettaglio.Country + '</li>')
            .append('<li>' + dettaglio.Genre + '</li>')
            .append('<li>' + dettaglio.Language + '</li>')
            .append('<li>' + dettaglio.Released + '</li>');
        $('#awards').html(dettaglio.Awards);

        var attori = listMe(dettaglio.Actors);

        for (attore of attori) {
            $('#cast').append('<li>' + attore + '</li>');

        }


    }


    //FUNZIONE PER AVERE UN ARRAY DI ATTORI DA UNA STRINGA
    function listMe(Stringactors) {
        var actors = Stringactors.split(",");
        var newActors = [];
        actors.forEach(function(el) {
            newActors.push(el.trim());
        });
        return newActors;
    }

});
