$(document).ready(function() {



    var listOfMovies = [];
    var totalResults;
    $('.listaMovies').hide();
    $('.dettaglio').hide();
    $('.maincontainer').css('min-height', $(document).height());

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
        var genre = $("#genre").val();

        //CHIAMATA AJAX AL SERVIZIO OMDB
        moviesService.getList(title, genre)
            .then(function(data) {
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
        // for (i in movies) {
        //     drawRow(movies[i]);
        // }

        movies.forEach(function(movie){
            drawRow(movie);
        });
    }

    //DRAW ROW
    function drawRow(movie) {
        var row = $('<tr class="res" style="cursor:pointer" title="' + movie.Title + '"/>');
        $("#bodyMovies").append(row);
        if (movie.Poster != 'N/A') {
            row.append($('<td><img width="100" alt="poster" src="' + movie.Poster + '"/></td>'));
        } else {
            row.append($('<td><img src="http://placehold.it/100x150"></td>'));
        }

        row.append($('<td>' + movie.Title + '</td>'));
        row.append($('<td>' + movie.Type + '</td>'));
        row.append($('<td>' + movie.Year + '</td>'));
    }


    //TRIGGERA L'EVENTO CLICK SU UNA SINGOLA RIGA

    $('tbody').on("click", "tr", function() {
        var titleMovie = $(this).attr("title");

        //CHIAMATA AJAX AL DETTAGLIO DEL FILM
        moviesService.getMovie(titleMovie)
            .then(function(data) {
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
        if (dettaglio.Poster != 'N/A') {
            $('#poster').html('<img width="200x350" src="' + dettaglio.Poster + '"/>');
        } else {
            $('#poster').html('<img width="200x350" src="http://placehold.it/200x350"/>');
        }

        $('#lista1 li').remove();
        $('#lista2 li').remove();
        $('#cast li').remove();

        $('#lista1')
            .append('<li><strong>Rating</strong> :' + dettaglio.imdbRating + '/10 ' + drawStar(dettaglio.imdbRating) + '</li>')
            .append('<li><strong>Year</strong> :' + dettaglio.Year + '</li>')
            .append('<li><strong>Director</strong> :' + dettaglio.Director + '</li>')
            .append('<li><strong>Writer</strong> :' + dettaglio.Writer + '</li>');
        $('#lista2')
            .append('<li><strong>Country</strong> :' + dettaglio.Country + '</li>')
            .append('<li><strong>Genre</strong> :' + dettaglio.Genre + '</li>')
            .append('<li><strong>Language</strong> :' + dettaglio.Language + '</li>')
            .append('<li><strong>Released</strong> :' + dettaglio.Released + '</li>');
        $('#awards').html(dettaglio.Awards);
        $('#plot').html(dettaglio.Plot);

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

    //FUNZIONE DRAWSTAR 
    function drawStar(rate) {
        var rating = '';
        rate = Math.floor(rate);

        for (i = 0; i < rate; i++) {
            rating += '<span class="glyphicon glyphicon-star" style="color:#a98605"></span>';
        }

        return rating;
    }

});
