Zepto(function($){
// essaye de récupérer les données sur github
d3.csv('https://github.com/michelbl/RCAUAF/raw/master/glossary.csv',
function(error, data) {
   if (error) {
       // si ça ne marche pas, utilisation de la copie locale
       d3.csv("RCAUAF.csv", function(er, da) {
           if (er) throw er;
           createDataListe(da);
       });
   } else {
       createDataListe(data);
   }
});

function createDataListe(d) {
    var html = "";
    for (var a in d) {
        if(d[a]["term"] !== undefined) html += "<p class='"+d[a]["term"]+"'><span class='title'>"+d[a]["term"]+"</span> : "+d[a]["definition"]+"</p>";
    }
    $('#laListe').append(html);
}

// bascule entre les onglets
$('#onglets li').on('click', function (e) {
    var target = $(this).attr("target");
    $('#onglets li').removeClass('active');
    $(this).addClass('active');
    $('#main > div').removeClass('active');
    $('#'+target).addClass('active');
})

// recherche dans les acronymes
$('#Explorer input').on('change input', function(e) {
    var q = $(this)[0].value.toUpperCase();
    $("#laListe p").each(function() {
        var classe = $(this).attr('class').toUpperCase();
        if(classe.match(q)) $(this).show();
        else $(this).hide();
    });
});

});
