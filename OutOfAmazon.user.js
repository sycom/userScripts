// ==UserScript==
// @name        OutOfAm*z*n
// @namespace   https://git.framasoft.org/sycom/userScripts
// @description Un script pour acheter ses livres ailleurs que chez amazon
// @downloadURL https://git.framasoft.org/sycom/userScripts/raw/master/OutOfAmazon.user.js
// @include     http://amazon.fr*
// @include     https://amazon.fr*
// @include     http://www.amazon.fr*
// @include     https://www.amazon.fr*
// @author	    Sylvain Comte
// @version     0.2
// @require     https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @grant       none
// ==/UserScript==

var OoAboutName="Quai des mômes",
    OoAboutLink="http://www.librairie-quaidesmomes.com/vel/recherche/resultats-recherche-rapide.html?search_keys=",
    OoAcolor="#008A00",
    OoAsetOpen;
// vérifie qu'on est dans la rubrique livre
var rubrique=$(".nav-b").text();
if(rubrique=="Livres") {
  // installe font-awesome
  $('head').append('<link href="https://cdn.jsdelivr.net/fontawesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">');
  // récupère le titre du livre et le prépare pour le mettre dans le lien de la boutique locale
  var OoATitle=encodeURIComponent($("#productTitle").text());
  var OoAAuthor=encodeURIComponent($(".author > span > a").text());
  console.log(OoAAuthor+" - "+OoATitle);
  // prépare le lien vers la boutique locale
  var itemSendTo='<li data-width="192" class="swatchElement selected" style="width:192px"><span id="" class="a-button a-button-selected a-spacing-mini a-button-toggle format" style="box-shadow:3px 3px 6px gray;border-color:'+OoAcolor+'"><span class="a-button-inner" style="background-image:linear-gradient(145deg,#fff,#f8fef2)"><span id="OoA-setButton" class="fa fa-wrench" style="float:right;margin:2px 2px 0 0;padding:2px;box-sizing:border-box;border-radius:50%;color:white;background-color:'+OoAcolor+';"></span><span class="a-list-item"><a id="" href="'+OoAboutLink+''+OoATitle+','+OoAAuthor+'" class="a-button-text" role="button"><span>près de chez vous</span><span class="a-color-base"><span class="a-color-price"><a href="'+OoAboutLink+''+OoATitle+','+OoAAuthor+'">'+OoAboutName+'</a></span></span></a></span></span><span class="tmm-olp-links"></span><span class="tmm-olp-links"><span class="olp-used olp-link"><a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/"><span class="olp-from">Le lien ci-dessus est produit par</span></a></span><span class="olp-new olp-link" style="text-align:center"><a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/">outOfAm*z*n <span class="olp-from"></span></a></span></span></span></li>';
  // ajoute le lien à la liste des boutons amazon
  $("#tmmSwatches ul").append(itemSendTo);
  // ajoute la fonction d'ouverture des réglages
    function toggleSettings () {
    console.log("toggle");
    // si ouvert, on cache
    if(OoAsetOpen==1) {
      console.log(">> je cache ("+OoAsetOpen+")");
      $("#OoA-settings").css('display','none');
      OoAsetOpen=0
      }
    else {
      // si n'exsite pas, on crée  
      if(OoAsetOpen==undefined) {
        console.log(">> je crée ("+OoAsetOpen+")");
        var OoAsettings='<div id="OoA-settings" style="z-index:200;width:100%;background-color:white;opacity:0.8;height:150%;position:fixed;top:0;left:0"><div id="OoAList" style="width:80%;min-width:500px;margin:100px auto;min-height:450px;background-color:'+OoAcolor+';box-shadow: 15px 15px 5px gray"><span id="OoA-closeSetButton" class="fa fa-2x fa-times" style="float:right;margin:10px 10px 0 0;padding:0px 4px 2px;box-sizing:border-box;border-radius:50%;color:white;background-color:white;color:'+OoAcolor+';"></div></div>';
        $("body").append(OoAsettings);
        $("#OoA-closeSetButton").click(toggleSettings);
        }
      // dans tous les cas, on le fait apparaitre
        console.log(">> je montre ("+OoAsetOpen+")");
        $("#OoA-settings").css('display','block');
        OoAsetOpen=1
      }
    }
  $("#OoA-setButton").click(toggleSettings);
  

  }
// on est pas dans la bonne rubrique
else console.log("bon ben c'est pour l'ogre alors :-/");
