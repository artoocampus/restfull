$(document).ready(function() {


    var root = 'http://www.omdbapi.com/';
    var listOfMovies = [];
    var totalResults;
    $('.table').hide();

    //DISABILITA IL BOTTONE DI RICERCA
    $("#buttonSearch").prop('disabled', true);

    //VERIFICA CHE IL CAMPO TITLE NON SIA VUOTO
    $("#title").change(function() {
        var validate = false;
        if ($("#title").val().length > 0) {
            validate = true;
        }
        if (validate) {
            $("#buttonSearch").prop('disabled', false);
        } else {
            $("#buttonSearch").prop('disabled', true);
        }
    });

    //TRIGGER DELL' EVENTO CLICK
    $("#buttonSearch").click(function() {
        var title = $("#title").val();

        $.ajax({
            url: root + '?s=' + title,
            method: 'GET'
        }).then(function(data) {
            
            if (data.Response === "True") {
                totalResults = data.totalResults;
                listOfMovies = data.Search;
                
                $("#result").html("Risultati: " + totalResults).css('color', 'black');
    			$('.table').show();
                drawTable(listOfMovies);
            }
            if(data.Response === "False") {
            	$('.table').hide();
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
    }//DRAW TABLE
    function drawRow(movie) {
    	var row = $('<tr class="res" title="'+ movie.Title +'"/>');
    	$("#bodyMovies").append(row);
    	row.append($('<td><img width="100" alt="poster" src="' + movie.Poster + '"/></td>' ));
    	row.append($('<td>' + movie.Title + '</td>' ));
    	row.append($('<td>' + movie.Type + '</td>' ));
    	row.append($('<td>' + movie.Year + '</td>' ));
    }

    $('tbody').on("click", "tr", function(){
    	var title = $(this).attr("title");
    });

});
