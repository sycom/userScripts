// ==UserScript==
// @name      Out Of Am*z*n
// @namespace   https://git.framasoft.org/sycom/userScripts
// @description Un script pour acheter ses livres ailleurs que chez amazon
// @downloadURL https://git.framasoft.org/sycom/userScripts/raw/master/OutOfAmazon.user.js
// @include   *://*.amazon.fr*
// @include   https://sycom.github.io/userScripts/outOfAm-z-n/*
// @include   https://sycom.gitlab.io/userScripts/outOfAm-z-n/*
// @author    Sylvain Comte
// @version   0.3.1
// @require   https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// @grant     GM_getValue
// @grant     GM_setValue
// @grant     GM_addStyle
// @noframes
// ==/UserScript==

console.log("OoA > started");
this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery

// boutique par défaut. Pour le cas où il n'y en aurait pas d'autre
var OoAdefault = {
    "active": true,
    "name": "Quai des mômes",
    "url": "http://www.librairie-quaidesmomes.com",
    "search": "",
    "addresse":"3, rue du quai",
    "mail":"contact@librairie-quaidesmomes.com",
    "lat": "49.2132699",
    "long": "1.1703296",
    "city": "Louviers",
    "country": "France",
    "phone": "+33 2 32 50 25 25"
};

// réglage et variables
var OaAnbStores = 0, // nombre de boutiques actives
    OoAcolor = "#008A00", // couleur des boutons
    OoAsetOpen, // indicateur d'ouverture des réglages
    OoAStores = []; // liste des boutiques

// construction des styles
GM_addStyle("#OoA-settings{z-index:200;width:100%;background-color:rgba(255,255,255,0.8);height:150%;position:fixed;top:0;left:auto}#OoA-list{width:600px;max-width:100%;margin:100px auto;min-height:8em;background-color:" + OoAcolor + ";opacity:0.8;box-shadow:15px 15px 5px gray;color:white;padding:.5em}#OoA-list h3{color:white;text-align:center}#OoA-list a{color:white}#OoA-closeSetButton{float:right;margin:10px 10px 0 0;padding:0px 4px 2px;box-sizing:border-box;border-radius:50%;color:white;background-color:white;color:" + OoAcolor + "}#OoA-stores{padding:50px 5px 1em 5px}.OoA-store{color:white}.OoA-store>a{font-size:1.75em}.OoA-store *{vertical-align:middle;padding:0 2px}.OoA-help{color:white;padding:1.5em 0 0 0;text-align:right;font-size:12px;font-style:italic}.hidden{display:none}.fa{font-size:12px}");

// installe font-awesome
$('head').append('<link href="https://cdn.jsdelivr.net/fontawesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">');
// vérifie les paramètres de l'utilisateur
// a-t-il défini une (ou plusieurs) boutique
if (GM_getValue("Stores")) {
    OoAStores = GM_getValue("Stores");
    console.log(OoAStores);
}
// si ce n'est pas le cas, on met la valeur par défaut (quai des mômes)
if (OoAStores.length == 0) {
    OoAStores.push(OoAdefault);
    // on sauvegarde dans GM
    GM_setValue("Stores", OoAStores);
}

// Ce qui se passe quand on est sur la page du script...
if (window.location.href.match(/(b\.io\/userScripts\/outOfAm-z-n\/)/) != null ) {
    console.log("OoA > on est sur la page carte des libraires");
    // ajout du bouton réglage sur la page map
    var OoASettingsButtons = '<li><a class="fa fa-2x fa-list OoA-setButton" href="#"></a></li>';
    $("#navigation .buttons").append(OoASettingsButtons);
    // laisse apparaitre les boutons dans les popupopen : on change la classe du div de dialogue (masqué)
    console.log("OoA > relache les boutons dans les popup");
    $("#OoAdialogDiv").addClass("OoArunning");
    console.log(OoAStores);
    for (var b in OoAStores) {
        console.log("OoA > ajout de url("+ b +")="+OoAStores[b].url);
        var spanBout = "<span class='librairie' title='" + OoAStores[b].url + "'></span>";
        $("#OoAdialogDiv").append(spanBout);
    }
    $("#OoAdialogDiv").click(OoAaddStore);

    function OoAaddStore() {
        $(".OoAdata").each(function() {
            var theBoutId = $(this).attr("id");
            var hasBout = false;
            for (var b in OoAStores) {
                console.log("!!!- "+OoAStores[b].url+" - "+theBoutId);
                if (OoAStores[b].url == theBoutId) hasBout = true;
            }
            // si on n'a pas la boutique dans notre liste. On ajoute.
            if (hasBout == false) {
                console.log("OoA > ajout de la boutique :"+theBoutId);
                var theBout = {
                    "active": true,
                    "name": $(this).find(".name").html(),
                    "addresse": $(this).find(".addresse").html(),
                    "mail": $(this).find(".mail").html(),
                    "url": theBoutId,
                    "search": $(this).find(".search").attr("href"),
                    "phone": $(this).find(".phone").html(),
                    "lat": $(this).find(".lat").html(),
                    "long": $(this).find(".long").html(),
                    "city": $(this).find(".city").html(),
                    "country": $(this).find(".country").html()
                };
                // console.log(theBout);
                OoAStores.push(theBout);
                var spanBout = "<span class='librairie' title='" + theBoutId + "'></span>";
                $("#OoAdialogDiv").append(spanBout);
                $(".addThisStore .fa-plus").addClass("fa-minus");
                $(".addThisStore .fa-plus").removeClass("fa-plus");
                GM_setValue("Stores", OoAStores);
            }
            // ou si on l'a, on l'enlève
            else {
                console.log("OoA > suppression de la boutique :"+theBoutId);
                for (var b in OoAStores) {
                    if (OoAStores[b].url == theBoutId) delete OoAStores[b];
                }
                $("#OoAdialogDiv .librairie").each(function() {
                    if($(this).attr("title") == theBoutId) $(this).remove();
                });
                $(".addThisStore .fa-minus").addClass("fa-plus");
                $(".addThisStore .fa-minus").removeClass("fa-minus");
                GM_setValue("Stores", OoAStores);
            }
        });
    }
}

// Ce qui se passe quand on est sur Amazon...
if (window.location.href.match(/(\/\/www\.amazon\.fr\/)/) != null) {
    // vérifie qu'on est dans la rubrique livre sur amazon.fr
    var rubrique = $(".nav-b").text();
    if (rubrique === "Livres") {
        console.log("OoA > On est bien dans les livres");
        // récupère le titre du livre et le prépare pour le mettre dans le lien de la boutique locale
        var OoATitle = escape($("#productTitle").text());
        var OoAAuthor = "";
        $(".author > span > a").each(function() {
            OoAAuthor += $(this).text() + "+";
        });
        OoAAuthor = escape(OoAAuthor);
        console.log("OoA > Livre cherché : " + OoAAuthor + " - " + OoATitle);
        // vérifie qu'au moins une boutique est active et active la première de la liste sinon
        if (OaAnbStores === 0) {
            OoAStores[0].active = true;
        }
        // prépare le lien vers la boutique locale
        for (var s in OoAStores) {
            if (OoAStores[s].active === true) {
                var itemSendTo = '<li id="OoA'+ s +'" data-width="192" class="swatchElement selected" style="width:192px">';
                itemSendTo += '<span class="a-button a-button-selected a-spacing-mini a-button-toggle format" style="box-shadow:3px 3px 6px gray;border-color:' + OoAcolor + '">';
                itemSendTo += '<span class="a-button-inner" style="background-image:linear-gradient(145deg,#fff,#f8fef2)">';
                itemSendTo += '<span class="fa fa-wrench OoA-setButton" title="réglages" style="float:right;margin:2px 2px 0 0;padding:2px;box-sizing:border-box;border-radius:50%;color:white;background-color:' + OoAcolor + '"></span>';
                if(OoAStores[s].search == "") {
                    itemSendTo += '<span id="OoAname'+s+'" class="a-list-item">';
                    itemSendTo += '<a href="#" class="a-button-text" role="button">';
                    itemSendTo += '<span>près de chez vous';
                    itemSendTo += '<span class="a-color-base"><span class="a-color-price">';
                    itemSendTo += '<a href="#">'+ OoAStores[s].name +', ' + OoAStores[s].city +'</a>';
                    itemSendTo += '</span></span></span></a>';
                    itemSendTo += '<a id="OoACoord'+ s +'" class="hidden"><ul>';
                    if(OoAStores[s].phone!==0) {
                        itemSendTo += '<li style="display:block"><i class="fa fa-phone"></i><a href="phone:' + OoAStores[s].phone + '">' + OoAStores[s].phone + '</a></li>'}
                    if(OoAStores[s].mail!==0) {
                        itemSendTo += '<li style="display:block"><i class="fa fa-envelope"></i><a href="mailto:' + OoAStores[s].mail + '">' + OoAStores[s].mail + '</a></li>'}
                    itemSendTo += '</ul></a></span></span></span>';
                }
                else {
                    itemSendTo += '<span class="a-list-item"><a id="" href="' + OoAStores[s].search + '' + OoATitle + ',' + OoAAuthor + '&amp;from=OoAsycom" class="a-button-text" role="button">';
                    itemSendTo += '<span>près de chez vous</span><span class="a-color-base"><span class="a-color-price">';
                    itemSendTo += '<a href="' + OoAStores[s].search + '' + OoATitle + ',' + OoAAuthor + '&amp;from=OoAsycom">' + OoAStores[s].name + '</a></span></span></a></span></span>';
                }
                itemSendTo += '<span class="tmm-olp-links"></span><span class="tmm-olp-links"><span class="olp-used olp-link">';
                itemSendTo += '<a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/" target="_blank"><span class="olp-from">Le lien ci-dessus est produit par</span></a></span>';
                itemSendTo += '<span class="olp-new olp-link" style="text-align:center">';
                itemSendTo += '<a class="a-size-mini a-link-normal" href="http://sycom.github.io/outOfAm-z-n/">outOfAm*z*n <span class="olp-from"></span></a></span></span></li>';
                console.log(itemSendTo);
                // ajoute le lien à la liste des boutons amazon
                $("#tmmSwatches ul").append(itemSendTo);
                $("#OoA"+s).click(function(){
                    console.log("OoA > cliqué, mais où sont les coordonnées");
                    $("#OoAname"+s).toggleClass("hidden");
                    $("#OoACoord"+s).toggleClass("hidden");
                })
            }
        }
    }
    // on est pas dans la bonne rubrique
    else console.log("OoA > on n'est pas dans les livres...");
}
// ajoute la fonction d'ouverture des réglages aux boutons associés
$(".OoA-setButton").click(toggleSettings);
// fonction d'ouverture des réglages
function toggleSettings() {
    // si ouvert, on cache
    if (OoAsetOpen == 1) {
        // console.log("OoA >> je cache (" + OoAsetOpen + ")");
        $("#OoA-settings").css('display', 'none');
        OoAsetOpen = 0;
    } else {
        // si n'existe pas, on crée
        if (OoAsetOpen === undefined) {
            // console.log("OoA >> je crée");
            var OoAsettings = '<div id="OoA-settings"><div id="OoA-list"><span id="OoA-closeSetButton" class="fa fa-2x fa-times"></span><h3>Vos boutiques</h3></div></div>';
            $("body").append(OoAsettings);
            $("#OoA-list").append("<ul id='OoA-stores'></ul>");
        }
        // populate store list with users store list
        var html = "";
        for (var i in OoAStores) {
            var OoAli = "<li class='OoA-store fa' id='OoA-store-" + i + "'>";
            if (OoAStores[i].active === true) OoAli += "<span class='fa fa-2x fa-check-square' id='active-" + i + "'></span>&nbsp;&nbsp;&nbsp;&nbsp;";
            else OoAli += "<span class='fa fa-2x fa-square'></span>&nbsp;&nbsp;&nbsp;&nbsp;";
            OoAli += "<a href='" + OoAStores[i].url + "'>" + OoAStores[i].name + "</a>&nbsp;&nbsp;&nbsp;&nbsp;";
            OoAli += "<a class='fa fa-2x fa-map-marker' target='_blank' href='http://www.openstreetmap.org/?mlat=" + OoAStores[i].lat + "&mlon=" + OoAStores[i].long + "#map=16/" + OoAStores[i].lat + "/" + OoAStores[i].long + "' style='text-decoration:none'></a>&nbsp;" + OoAStores[i].city + ",&nbsp;" + OoAStores[i].country + "&nbsp;&nbsp;&nbsp;";
            /*if (OoAStores.length > 1) */
            OoAli += "<span class='fa fa-2x fa-trash' id='trash-" + i + "'></span>";
            OoAli += "</li>";
            html += OoAli;
        }
        html += "<div class='OoA-help'>Trouver <a href='https://sycom.github.io/userScripts/outOfAm-z-n/map.html' target='_blank'>d\'autres boutiques</a></div>";
        $("#OoA-stores").html(html);
        // add functions to buttons
        $(".OoA-store .fa-check-square").click(OoAtoggleStore);
        $(".OoA-store .fa-square").click(OoAtoggleStore);
        $(".OoA-store .fa-trash").click(OoATrashStore);
        $("#OoA-closeSetButton").click(toggleSettings);
        // dans tous les cas, on le fait apparaitre
        OoAsetOpen = 1;
        // console.log("OoA >> je montre (" + OoAsetOpen + ")");
        $("#OoA-settings").css('display', 'block');
    }
}

function OoAtoggleStore() {
    var OoAStoreNum = this.id.split("-")[1];
    if (OoAStores[OoAStoreNum].active === false) {
        console.log('>> j\'active ' + OoAStores[OoAStoreNum].name);
        OoAStores[OoAStoreNum].active = true;
    } else if (OoAStores[OoAStoreNum].active === true) {
        console.log('>> je désactive ' + OoAStores[OoAStoreNum].name);
        OoAStores[OoAStoreNum].active = false;
    }
    GM_setValue("Stores", OoAStores);
    $(this).toggleClass("fa-check-square fa-square");
    //$(this).toggleClass("fa-square");
}

function OoATrashStore() {
    // todo! ajouter une exception si il n'y a plus qu'un site
    var OoAStoreNum = this.id.split("-")[1];
    console.log(OoAStoreNum);
    $("#OoA-store-" + OoAStoreNum).fadeOut();
    //$("#OoA-store-" + OoAStoreNum).remove();
    OoAStores.splice(OoAStoreNum, OoAStoreNum + 1);
    GM_setValue("Stores", OoAStores);
}
