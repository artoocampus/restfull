$(document).ready(function() {


    var root = 'http://www.omdbapi.com/';

    $("#buttonSearch").click(function() {
        var title = $("#title").val();

        $.ajax({
            url: root + '?s=' + title,
            method: 'GET'
        }).then(function(data) {
            console.log(data);
        });

    });

});
