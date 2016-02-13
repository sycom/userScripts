// ==UserScript==
// @name      Out Of Am*z*n
// @namespace   https://git.framasoft.org/sycom/userScripts
// @description Un script pour acheter ses livres ailleurs que chez amazon
// @downloadURL https://git.framasoft.org/sycom/userScripts/raw/master/OutOfAmazon.user.js
// @include   *://*.amazon.fr*
// @author     Sylvain Comte
// @version   0.2.2
// @require   https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @grant     GM_getValue
// @grant     GM_setValue
// @grant     GM_addStyle
// @noframes
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery

var OoAdefName = "Quai des mômes",
   OoAdefUrl = "http://www.librairie-quaidesmomes.com/vel/recherche/resultats-recherche-rapide.html?search_keys=",
   OoAcolor = "#008A00",
   OoAsetOpen,
   OoAStores = [];

GM_addStyle("#OoA-settings{z-index:200;width:100%;background-color:rgba(255,255,255,0.8);height:150%;position:fixed;top:0;left:auto}#OoA-list{width:600px;max-width:100%;margin:100px auto;min-height:450px;background-color:"+OoAcolor+";opacity:0.8;box-shadow:15px 15px 5px gray}#OoA-closeSetButton{float:right;margin:10px 10px 0 0;padding:0px 4px 2px;box-sizing:border-box;border-radius:50%;color:white;background-color:white;color:"+OoAcolor+"}#OoA-stores{padding:50px 5px 5px 5px}.OoA-store{color:white}.OoA-store *{vertical-align:middle;padding:0 2px}");
   
// vérifie qu'on est dans la rubrique livre sur amazon.fr
var rubrique = $(".nav-b").text();
if (rubrique === "Livres") {
   console.log("OoA > On est bien dans les livres");
   // installe font-awesome
   $('head').append('<link href="https://cdn.jsdelivr.net/fontawesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">');
   // vérifie les paramètres de l'utilisateur
   // 1. a-t-il défini une (ou plusieurs) boutique
  if (GM_getValue("Stores")) {
      OoAStores = GM_getValue("Stores");
   }
   // si ce n'est pas le cas, on met quai des momes    
   else {
      OoAStores.push({active: true, name: OoAdefName, url: OoAdefUrl});
	// on sauvegarde dans GM
	GM_setValue("Stores",OoAStores);
   }
   // récupère le titre du livre et le prépare pour le mettre dans le lien de la boutique locale
   var OoATitle = escape($("#productTitle").text());
   var OoAAuthor = "";
   $(".author > span > a").each(function() {OoAAuthor+=$(this).text() + "+"});
   OoAAuthor = escape(OoAAuthor);
   console.log(OoAAuthor + " - " + OoATitle);
   // prépare le lien vers la boutique locale
   
   for (var s in OoAStores) {
      var itemSendTo = '<li data-width="192" class="swatchElement selected" style="width:192px"><span id="" class="a-button a-button-selected a-spacing-mini a-button-toggle format" style="box-shadow:3px 3px 6px gray;border-color:' + OoAcolor + '"><span class="a-button-inner" style="background-image:linear-gradient(145deg,#fff,#f8fef2)"><span id="OoA-setButton" class="fa fa-wrench" style="float:right;margin:2px 2px 0 0;padding:2px;box-sizing:border-box;border-radius:50%;color:white;background-color:' + OoAcolor + ';"></span><span class="a-list-item"><a id="" href="' + OoAStores[s].url + '' + OoATitle + ',' + OoAAuthor  + '&amp;from=OoAsycom" class="a-button-text" role="button"><span>près de chez vous</span><span class="a-color-base"><span class="a-color-price"><a href="' + OoAStores[s].url + '' + OoATitle + ',' + OoAAuthor  + '&amp;from=OoAsycom">' + OoAStores[s].name + '</a></span></span></a></span></span><span class="tmm-olp-links"></span><span class="tmm-olp-links"><span class="olp-used olp-link"><a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/"><span class="olp-from">Le lien ci-dessus est produit par</span></a></span><span class="olp-new olp-link" style="text-align:center"><a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/">outOfAm*z*n <span class="olp-from"></span></a></span></span></span></li>';
      // ajoute le lien à la liste des boutons amazon
      $("#tmmSwatches ul").append(itemSendTo);
   }
   // ajoute la fonction d'ouverture des réglages
   function toggleSettings() {
      // si ouvert, on cache
      if (OoAsetOpen == 1) {
         console.log(">> je cache (" + OoAsetOpen + ")");
         $("#OoA-settings").css('display', 'none');
         OoAsetOpen = 0
      } else {
         // si n'existe pas, on crée  
         if (OoAsetOpen == undefined) {
            console.log(">> je crée (" + OoAsetOpen + ")");
            var OoAsettings = '<div id="OoA-settings"><div id="OoA-list"><span id="OoA-closeSetButton" class="fa fa-2x fa-times"></div></div>';
			$("body").append(OoAsettings);
            // populate store list with users store list
            $("#OoA-list").append("<ul id='OoA-stores'><ul>");
            for (var i in OoAStores) {
               var OoAli = "<li class='OoA-store'>";
               if (OoAStores[i].active == true) OoAli += "<span class='fa fa-2x fa-check-square'></span>"
               else OoAli += "<span class='fa fa-2x fa-square'></span>&nbsp;";
               OoAli += "<input type='text' value='" + OoAStores[i].name + "'></input>&nbsp;";
               OoAli += "<input type='text' value='" + OoAStores[i].url + "'></input>&nbsp;";
               OoAli += "<span class='fa fa-2x fa-trash'></span></li>";
               $("#OoA-stores").append(OoAli);
            }
            $("#OoA-closeSetButton").click(toggleSettings);
         }
         // dans tous les cas, on le fait apparaitre
         console.log(">> je montre (" + OoAsetOpen + ")");
         $("#OoA-settings").css('display', 'block');
         OoAsetOpen = 1
      }
   }
   $("#OoA-setButton").click(toggleSettings);
}
// on est pas dans la bonne rubrique
else console.log("OoA > on n'est pas dans les livres...");