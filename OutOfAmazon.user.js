// ==UserScript==
// @name        OutOfAmazon
// @namespace   https://git.framasoft.org/sycom/userScripts
// @description Un script pour acheter ses livres ailleurs que chez amazon
// @include     http://amazon.fr*
// @include     https://amazon.fr*
// @include     http://www.amazon.fr*
// @include     https://www.amazon.fr*
// @version     0
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// ==/UserScript==

var boutique="Quai des mômes",
	boutLink="http://www.librairie-quaidesmomes.com/vel/recherche/resultats-recherche-rapide.html?search_keys="
// vérifie qu'on est dans la rubrique livre
var rubrique=$(".nav-b").text();
if(rubrique=="Livres") {
  // récupère le titre du livre et le prépare pour le mettre dans le lien de la boutique locale
  var itemTitle= encodeURIComponent($("#productTitle").text());
  console.log(itemTitle);
  // prépare le lien vers la boutique locale
  var itemSendTo='<li data-width="192" class="swatchElement selected" style="width:192px"><span class="a-list-item"><span id="" class="a-button a-button-selected a-spacing-mini a-button-toggle format"><span class="a-button-inner"><a id="" href="'+boutLink+''+itemTitle+'" class="a-button-text" role="button"><span>près de chez vous</span><br><span class="a-color-base"><span class="a-color-price"><a href="'+boutLink+''+itemTitle+'">'+boutique+'</a></span></span></a></span></span><span class="tmm-olp-links"></span><span class="tmm-olp-links"><span class="olp-used olp-link"><a class="a-size-mini a-link-normal" href="https://outOfAmazon.github.io"><span class="olp-from">Le lien ci-dessus est produit par</span> outOfAmazon</a></span><span class="olp-new olp-link"><span class="olp-from">un script greasemonkey local et solidaire</span></span></span></span></li>';
  // ajoute le lien à la liste des boutons amazon
  $("#tmmSwatches ul").append(itemSendTo);
  }
// on est pas dans la bonne rubrique
else console.log("bon ben c'est pour l'ogre alors :-/");
