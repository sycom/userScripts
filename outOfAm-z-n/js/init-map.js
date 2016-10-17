// récupération des informations sur les sources de données
var sources='sources : '+data.source+' - '+data.date;
var context='map';

// ajout des couches de fonds dans la liste des couches disponibles
var Couches=new Array(); 	// couches de tiles leaflet
var tiles={};				// désignation des tiles pour le control
	// remplissage de la liste
for(i in fonds) {
	var couche=new L.TileLayer(fonds[i].url, {
		attribution: sources+fonds[i].attrib,
		minZoom : fonds[i].zMin,
		maxZoom : fonds[i].zMax,
		unloadInvisibleTiles:true
		});
	Couches[fonds[i].id]=couche;
	tiles[fonds[i].nom]=couche;
	}

// waitings
(function($) {
	$(function() { 										// let's wait for jQuery
		setTimeout(function(){if(L) letsStart()}, 250); // let's wait for Leaflet
	})
})(jQuery);

function letsStart() {
	/* affichage de la carte uniquement avec l'ajout de ?carteSeule */
	if(document.location.href.match(/\?carteSeule/g)) {
		context='full';
		$('#title').css('display','none');
		$('#main, #page').css('width','100%');
		$('#page').css('max-width','none');
		$('#main, #page').css('margin','0');
		$('#main, #page').css('padding','0');
		}
	// resizing map when resizing window
	$(window).resize(function() {
		clearTimeout(window.resizedFinished);
		window.resizedFinished = setTimeout(function(){
			getWidth(context);
			$('#map')
				.css('width',rW)
				.css('height',rH);
			}, 250);
		});
	// carte mise à la taille de l'espace disponible
	getWidth(context);
	$('#map')
		.css('width',rW)
		.css('height',rH);
	// mise à une échelle permettant de voir la Haute-Normandie en entier
	if(knwrmdZoom==null) knwrmdZoom=Math.sqrt(rW)/3.75;
	carte=L.map('map');//.setView([knwrmdLat,knwrmdLong],Math.round(knwrmdZoom));
	// ajout des couches de fonds dans la liste des couches disponibles
	// remplissage de la liste
	for(i in fonds) {
		var couche=new L.TileLayer(fonds[i].url, {
			attribution: sources+' | '+fonds[i].attrib,
			minZoom : fonds[i].zMin,
			maxZoom : fonds[i].zMax,
			unloadInvisibleTiles:true
			});
		Couches[fonds[i].id]=couche;
		tiles[fonds[i].nom]=couche;
		}
	// Installation du fond par défaut (premier de la liste dans fonds.json)
	if(knwrmdFond==null) knwrmdFond=fonds[0].id;
	Couches[knwrmdFond].addTo(carte);

    /* Création de l'icone */
    var bsIcon = L.icon({
        iconUrl: './img/bsIcon.png',
        iconRetinaUrl: './img/bsIcon.png',
        iconSize: [20, 38],
        iconAnchor: [15, 38],
        popupAnchor: [-5, -39],
        shadowUrl: './img/bs-ombre.png',
        shadowRetinaUrl: './img/bs-ombre.png',
        shadowSize: [40, 20],
        shadowAnchor: [0,20]
        });

/* Construction des légendes
	// contenus des légendes - initialisation
	var HtmlLeg=new Array();
		HtmlLeg['Labellisation']='<div style="background-color:white;border:1px solid #ddd;opacity:0.8;padding:5px">';
		HtmlLeg['Avancement']='<div style="background-color:white;border:1px solid #ddd;opacity:0.8;padding:5px">';
	// liste des états de labellisation et éléments de légende. Point d'ancrage au milieu bas de l'icone
	var Labellisation = [
		{"id":"caap","icone":"la0-aap","string":"candidat aux appels à projet (2009 et 2011)"},
		{"id":"clab","icone":"la1-clab","string":"candidat au label"},
		{"id":"elab","icone":"la2-elab","string":"<i>engagé</i> dans la démarche de labellisation"},
		{"id":"label","icone":"la3-label","string":"projet labellisé écoquartier"},
		{"id":"autres","icone":"la9-autre","string":"autres projets"}
		];
	var PinCat=new Array;
	for(i in Labellisation) {
		var url=Labellisation[i].icone+'.png';
		PinCat[Labellisation[i].id] = L.icon({
			iconUrl: './img/'+url,
			iconRetinaUrl: './img/'+url,
			iconSize: [20, 38],
			iconAnchor: [15, 38],
			popupAnchor: [-5, -39],
			shadowUrl: './img/la-ombre.png',
			shadowRetinaUrl: './img/la-ombre.png',
			shadowSize: [40, 20],
			shadowAnchor: [0,20]
			});
		HtmlLeg['Labellisation']+='<img src="./img/'+url+'" style="height:16px"/>&nbsp;'+Labellisation[i].string+'<br/>';
		}
	HtmlLeg["Labellisation"]+='</div>';
	// liste des niveaux d'avancement et éléments de légende
	var Avancement=[
		{"id":"inconnu","icone":"av0-int","string":"avancement inconnu"},
		{"id":"intention","icone":"av0-int","string":"intention d'écoquartier"},
		{"id":"projet","icone":"av1-pro","string":"écoquartier en projet"},
		{"id":"chantier","icone":"av2-chan","string":"écoquartier en chantier"},
		{"id":"réalisé","icone":"av3-real","string":"écoquartier réalisé"}];
	var PinAv=new Array;
	for(i in Avancement) {
		var url=Avancement[i].icone+'.png';
		PinAv[Avancement[i].id] = L.icon({
			iconUrl: './img/'+url,
			iconRetinaUrl: './img/'+url,
			iconSize: [29, 37],
			iconAnchor: [20, 37],
			popupAnchor: [-6, -32],
			shadowUrl: './img/av-ombre.png',
			shadowRetinaUrl: './img/av-ombre.png',
			shadowSize: [37, 23],
			shadowAnchor: [0,20]
			});
		HtmlLeg["Avancement"]+='<img src="./img/'+url+'" style="height:20px"/>&nbsp;'+Avancement[i].string+'<br/>';
		}
	HtmlLeg["Avancement"]+='</div>';*/
// Clusterisation des couches
	// Couche Librairies
	var bookStoresL=L.markerClusterGroup({
		name:"Librairies",
		maxClusterRadius:69,
		iconCreateFunction:function (cluster) {
			var cC=cluster.getChildCount(); //cluster number of entities
			var cS=Math.sqrt(cC*450);		//cluster size
			var cF=4*Math.log(cC*100);		//cluster font-size
			if(cF<12) cF=12;
			return new L.DivIcon({
				html:'<div style="border:2px dotted;width:'+cS+'px;height:'+cS+'px;border-radius:'+cS+'px;font-size:'+cF+'px;"><div><span style="line-height:'+cS+'px">'+cC+'</span></div></div>',
				className:'marker-cluster marker-cluster-'+cC,
				iconSize: new L.Point(cS,cS)
				})},
		});
	bookStoresL.name="Librairies";

// insertion des points dans la couche
	var dataLib=data.liste;
	for(i in dataLib) {
		var html = '<div class="OoAdata" id="'+dataLib[i].url+'"><div class="addThisStore hidden"><span class="fa fa-plus"></span></div><h6><span class="name">'+dataLib[i].name+'</span> - <span class="city">'+dataLib[i].city+'</span><span class="hidden country">'+dataLib[i].country+'</span></h6>';
        html += '<div class="hidden">lat:<span class="lat">'+dataLib[i].lat+'</span>,long:<span class="lat">'+dataLib[i].long+'</span></div>';
		var addresse=dataLib[i].addresse,
            site=dataLib[i].url,
            mail=dataLib[i].mail,
			search=dataLib[i].search,
			phone=dataLib[i].phone,
            coord="";
        if(addresse!=="") {
            html+="<span class='addresse'>"+addresse+"</span>";
        }
		if(site!==0) {coord+='<li class="fa fa-globe"><a href="'+site+'" class="url">'+site.replace("http://","").replace("https://","").replace("www.","")+'</a></li>'}
        if(mail!==0) {coord+='<li class="fa fa-envelope"><a href="mailto:'+mail+'" class="mail">'+mail.replace("@","(à)")+'</a></li>'}
		if(search!==0) {coord+='<li class="fa fa-question hidden"><a class="search" href="'+search+'">adresse de recherche</a></li>'}
        if(phone!==0) {coord+='<li class="fa fa-phone"><a class="phone" href="tel:'+phone+'">'+phone+'</a></li>'}
        if(coord!=="") {html+="<ul>"+coord+"</ul>"}
        html+="</div>";
		/*var iconeCat,iconeAv;
		if(PinCat[dataLib[i].aap]==undefined) {iconeCat=PinCat["la9-autre"]} else {iconeCat=PinCat[dataLib[i].aap]}
		if(PinAv[dataLib[i].phase]==undefined) {iconeAv=PinAv["av0-int"]} else {iconeAv=PinAv[dataLib[i].phase]}*/
		var pointLib = new L.marker([dataLib[i].lat,dataLib[i].long],{icon: bsIcon}).bindPopup(html);
		pointLib.on("popupopen",function() {
            if($("#OoAdialogDiv").hasClass("OoArunning")) {
                var theId=$(".OoAdata").attr("id");
                console.log("OoA page : theId="+theId);
                var hasBoutique=false;
                $("#OoAdialogDiv .librairie").each(function() {
                    console.log("OoA page : title="+$(this).attr("title"));
                    if($(this).attr("title") == theId) hasBoutique = true;
                })
                $(".addThisStore").toggleClass("hidden");
                console.log("OoA page : hasBoutique="+hasBoutique);
                if (hasBoutique == true) {
                    $(".addThisStore .fa-plus").addClass("fa-minus");
                    $(".addThisStore .fa-plus").removeClass("fa-plus");
                }
                else {
                    $(".addThisStore .fa-minus").addClass("fa-plus");
                    $(".addThisStore .fa-minus").removeClass("fa-minus");
                }
                $(".addThisStore").click(function() {
                    $("#OoAdialogDiv").click();
                });
            }
        });
        bookStoresL.addLayer(pointLib);

		// var pointAv = new L.marker([dataLib[i].lat,dataLib[i].long],{icon:iconeAv}).bindPopup(html);
		// ecoQavancement.addLayer(pointAv);
		}

/* création de la légende
	var legende  = L.control({position: 'bottomleft'});
	legende.onAdd = function (map) {
		var div = L.DomUtil.create('div','info legend');
		div.setAttribute('id','legende');
		div.innerHTML = '';
		return div;
		};
	legende.addTo(carte);*/

	carte.addLayer(bookStoresL);
    carte.fitBounds(bookStoresL.getBounds());
    carte.setZoom(carte.getZoom()-2);
	};
