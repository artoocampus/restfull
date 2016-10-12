$(document).ready(function() {


    var root = 'http://www.omdbapi.com/';
    var listOfMovies = [];
    var totalResults;

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
                $("#result").html(totalResults);
            }
            if(data.Response === "False") {
            	 $("#result").html(data.Error).css('color', 'red');
            }
        });

    });

});
