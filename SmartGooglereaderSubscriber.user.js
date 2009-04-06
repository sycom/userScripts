// ==UserScript==
// @name		Smart Google Subscriber
// @namespace	http://sylvain.comte.online.fr
// @description	display a small icon for subscribing to the feeds of the current page. 
//			based upon Jasper's Google Reader subscribe.
//			see http://browservulsel.blogspot.com/2006/05/google-reader-subscribed-indicator.html for more informations
// @version	S-1.2
// @licence	ask Jasper de Vries please. I don't know...
// ==/UserScript==.
/******* PARAMETERS ********/

/****************** About ************************
Author: Jasper de Vries, jepsar@gmail.com	Date:   2006-04-13
Change for version 0.3 by Mihai Parparita :
	Check if the user is already subscribed, and modify the appearance of the image accordingly.
Change for version 0.4 and S-* by Sylvain Comte :
	see http://userscripts.org/scripts/show/33600 for more informations
**************************************************/

/********* CUSTOMIZATION **************/
// if you like to tweak your GM scripts
/* use Diffbot to generate artificial feed for current page which don't have any other feed */
SGSDiffbot=1;	// set to 0 if you don't want this
/* colorpalettes */
// feel free to create your own. color in this order : back, highlight, front, light.
// You may like to share them by commenting http://userscripts.org/scripts/show/33600
var cpChrome=new colorPalette("#E1ECFE","#FD2","#4277CF","#FFF");	// but for Firefox ;-)
var cpUserscript=new colorPalette("#FFF","#F80","#000","#EEE");		// javascrgeek only
var cpFlickr=new colorPalette("#FFF","#FF0084","#0063DC","#FFF");	// pink my blue
// choose yours
var colPal=cpChrome;

/********** SCRIPT VERSION CONTROL *************/
//  http://userscripts.org/scripts/show/35611 - version 0.2
/* This script parameters */
/* SET YOUR OWN SCRIPT VALUES */
var thisId=33600;			// your script userscript id
var thisVersion="S-1.2";		// the @version metadata value
/* script version control parameters */
var GMSUCtime=11;			// delay before alert disapears. Set to 0 if you don't want it to disapear (might be a bit intrusive!)
var GMSUCbgColor="black";	// background color
var GMSUCfgColor="white";	// foreground color
/* This script version control  */
// avoid script execution in each frame of the page
if(window.parent) GM_scriptVersionControl(thisId,thisVersion);

// define function
function GM_scriptVersionControl(scriptId,version) {
	var scriptUrl="http://userscripts.org/scripts/show/"+scriptId;
	// go to script home page to get official release number and compare it to current one
	GM_xmlhttpRequest({
		method: 'GET',
		url: scriptUrl,
		headers: {
			 'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
			 'Accept': 'text/html,application/xml,text/xml',
			 },
		onload: function(responseDetails) {
			var textResp=responseDetails.responseText;
			// temp hack for correcting userscript homepage when not logged in (google ads)
			textResp=textResp.replace(/<!-- \*/g,"/*");
			textResp=textResp.replace(/\*\/ -->/g,"*/");
			// end of hack
			var parser=new DOMParser();
			var dom=parser.parseFromString(textResp,"text/xml");
			var ad=dom.getElementById('header').getElementsByTagName('div')[0];
			var offRel=dom.getElementById('summary').getElementsByTagName('b')[1].nextSibling.textContent;
			offRel=offRel.replace(/[\0\n\f\r\t\v\s]/g,"");
			var scriptName=dom.getElementById('content').getElementsByTagName('h1')[0].textContent;
			if(offRel!=version) {
				// Styling
				GM_addStyle("#GMSUC-alerte {position:absolute;top:5px;left:50%;margin:20px 0 0 -128px;padding:6px;width:250px;background:"+GMSUCbgColor+";border:"+GMSUCfgColor+" 1px solid;color:"+GMSUCfgColor+";font-size:1em;text-align:center} #GMSUC-alerte a {font-weight:bold;font-size:1em} #GMSUC-alerte * {color:"+GMSUCfgColor+";} #GMSUC-alerte table {width:100%} #GMSUC-alerte td {width:33%;border:solid 1px "+GMSUCfgColor+"} #GMSUC-alerte td:hover{background:"+GMSUCfgColor+"} #GMSUC-alerte td:hover a {color:"+GMSUCbgColor+"} #GMSUC-timer {font:big bolder} #GMSUC-info {text-align:right} #GMSUC-info a {font:small sans-serif;text-decoration:none}  #GMSUC-info a:hover {background:"+GMSUCfgColor+";color:"+GMSUCbgColor+"}");
				// Lang detection and apply
				var Langues="en, fr";
				var lang=navigator.language;
				var reg=new RegExp(lang,"g");
				if(!Langues.match(lang)) lang="en";
				/* traductions / translations */
					var Txt=new Array();
					for(i=1;i<7;i++) {Txt[i]=new Array();} 
					// français
					Txt[1]["fr"]="Vous utilisez la version";
					Txt[2]["fr"]="du script";
					Txt[3]["fr"]="La version officielle est différente";
					Txt[4]["fr"]="installer";
					Txt[5]["fr"]="voir le code";
					Txt[6]["fr"]="propulsé par";
					// english
					Txt[1]["en"]="You're using";
					Txt[2]["en"]="version of";
					Txt[3]["en"]="script. Official release version is different";
					Txt[4]["en"]="install";
					Txt[5]["en"]="view code";
					Txt[6]["en"]="powered by";
				/* ------------------------------- */	
				var alerte=document.createElement('div');
				alerte.setAttribute('id','GMSUC-alerte');
				var GMSUCtextAlerte=Txt[1][lang]+" "+version+" "+Txt[2][lang]+" <i><b>"+scriptName+"</b></i>";
				GMSUCtextAlerte+=". "+Txt[3][lang]+" (<a href='http://userscripts.org/scripts/show/"+scriptId+"'>"+offRel+"</a>)";
				GMSUCtextAlerte+="";
				GMSUCtextAlerte+="<table><tr><td><a href='http://userscripts.org/scripts/show/"+scriptId+"'>v."+offRel+"</a></td><td><a href='http://userscripts.org/scripts/review/"+scriptId+"'>"+Txt[5][lang]+"</a></td><td><a  href='http://userscripts.org/scripts/source/"+scriptId+".user.js'>"+Txt[4][lang]+"</a></td></tr></table>"
				if(GMSUCtime>0) GMSUCtextAlerte+="<div id='GMSUC-timer'>"+GMSUCtime+" s</div>";
				GMSUCtextAlerte+="<div id='GMSUC-info'>"+Txt[6][lang]+" <a href='http://userscripts.org/scripts/show/35611'>GM Script Update Control</a></div>";
				document.body.appendChild(alerte);
				document.getElementById('GMSUC-alerte').innerHTML=GMSUCtextAlerte;
				if(GMSUCtime>0) {
					function disparition() {
						if(GMSUCtime>0) {
							document.getElementById("GMSUC-timer").innerHTML=GMSUCtime+" s";
							GMSUCtime+=-1;
							setTimeout(disparition,1000)
							}
						else document.getElementById("GMSUC-alerte").setAttribute("style","display:none");
						}
					disparition();
					}
				}
			}
		});
	}
/******* END OF SCRIPT VERSION CONTROL **********/

/***********************************************************************************************************/
/***************************************  *****  ***** MAIN PROGRAM *****  *****  ****************************/
/***********************************************************************************************************/
/*********** VARIABLES ****************/
var item;					// a feed found under <link>
var control="";				// used to avoid multiple occurence for one unique feed (specialy <a href...)
var Feeds=new Array();		// all  feeds detected in the page
var FeedLinks=new Array(); 	// links to the feeds subscriber
var UrlList=new Array();	// all url used in the links
var subStatus="";			// global subscription status

/********* MAIN WINDOW ONLY ********/
// avoid the logo to be displayed in each iframe of the page

 if(window.parent) {
/********* CONSTANTES ****************/
// the waiting image
const waitLogo = 'data:image/png;base64,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';
// the four logos...
const logoRssOrange = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJnSURBVDiNpdNPSNNhHMfxj66SLFcOMis6dAoPXYooPIUdgqCi0Z8RK2gsDEcpVmSkJUZoGWJQEUURpNEfSjxElygiorLSLmW2X/ZbOjeVqTndouXeHbbGj6AI+sKH57k8r8/l+wjQ/0TD15Y6Bk7O7TYrs/CXCX+ZMP6QQGUWwZNzetqPLC6UZAOkgbq87pHG2YTbNhF80sDQs1NMvqxh4t5KErcWkryzCCwZbZyNeTzvk6QFkmwyfWLqegH+Vhe/T7zvKeN31zDVMh9aU0m2FGD6hKQiSTNkeEXyioPwucV0NK3l+ZkSOlsqiJhdGShyfy/fL+XDVQdcdWB4haRlKcAjuGgncd7OQH0uofpZxM7mEW7IJdBWSTw6CkD/HS9TF+xw0Y7hsQK7BM25hGpzMo2xYBdfb29l8vRMehqXEx8fAWDs8kqSzbkYu6yAW3A6h+EaGyPvHxH++CYDDT+oJVo3jcDN8hRsPCbRMB3DbQV2CE5kk6zLJnYsi0CFeFRVTCzdOnRlE+GDImKk4LFTSzB2WAGXSFaLeJUIl4vEURE/LF5UrwYgar5h4pAItvoA+HpvH4bLCmwT0Qrx7Uuq4Ud/J4mDIlgqBj+8BqBvjxg8UwxA6O5R/NuswBZh7J+HdQa9IlYmIm8fAvDKKSabVgEQvFmF32kBTKcIucW4/xUA33pfE/OKH6Wiz5fPQO0Kxj1i7ICDdzfqCZ510msFgi71jLjEkEt0rBNRt0h6BJ7U+es+tVvEdorh7cLYokAGaF+vws9O9ZobhbHh7zE3CmOzAmsWqCSzypJs6Y9RlFb/JUXpN7afIVhSDdLWIM4AAAAASUVORK5CYII=';

const logoRssVert = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDicM/u2nkQAAAnNJREFUeNqlk0tIVGEUx3/f3O/eGXXGJjN1ohaF6Wha0iLxxUQIRbXJlUYLayEtokW4iLYu3NQuMILCTa16gEqFCBGi0EvNNHxBND2cGR8zdzTHnDv3azEUDiUEHThndTjn8Dv/P/xniNKwL0+PrQ0lNuJ+mVQA6Fs0W7pA0z0zG6OewGzL1wUgJR3mytC6S/n3ewJUJ6vBANMd5zkDhJzzCAlKqN9Dcr+kSrRKcwioByJUjKN8KadqnjqpTNPMyJ6Vh6ohVqV8KafyqXQW2YaqGEcBZYAhpQVCJBl3vqV58jgkBSWucpr2tBDIaSQgGmlfbuOp+xHKZYMAaQEgNxWbROES0xtxhBDMbh+jN3afpsRZLnmvcd24jYpYDPgeY0s7g4tDBwwLtM8ao0UhRgrnuWP0UJdfT1/OPVrnTxFNLXDDe5d9q8UYP0QGZAeAboEmLYbX+3kffU0VR7jpeMA5LhLOm6Mr2gFAu96B+K5lvqZ2BOWPo/xRoUrDQvknUGd6q9XHxTllmqZqDR1VZTOowW/9yjRN1RDdoWpHUEAlYKQvsEEmFU5Toe+CT9UvuTLWDMAF4youN/RZ3emFnMhkACDXoCv7GYOFJrfcT0BCcPcbJmKvOKTVIGIwp78DwLPq/RPitkg+B1M1AFQk6nAuQ5YXEs5o+l8RkJ5kWroqlQFRCgm2a5FJa5gDspYP2hBZbhAGdIbayM8tILsYItEw3UudhPLmEI5NXjg2xbTmosS2wAqC0w9a9t+9YK9Dag2SMYIvDnMamJbhMQI7yxnWYa/uBTsE9lbOk5C0CI5f5jxgAQhAAwoA7y9l/kNYQAyI/AQmfwNkA+F+mQAAAABJRU5ErkJggg==';

const logoRssBleu = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDigBB8TH4wAAAoBJREFUeNqlk11Ik2EUx3/P8z7bdK41XToCNe1jKRKKBUIIRlCXYUIEURcVIX0ggUh33tdF4lV6IUEQBBH0CUFXUQaFpUlbHxTZLMvpcpvOOfe879OFYWgFQefqcDic8///OAf+M0TDsdGSeZMcnM3lahyhl6rqz83SKHzS/c49HW2J3js1ZYyx1aydGsR4anZWFNOwRSKki0yukMejC8TTCiEsDGJ5iOZbOFu8dRBoFkLE1ZxYqPE5lXg8X+k4UPtr3SE/jyOL9N6Y4UPcA0ICYEyIjJXcCASAhEJqtIFX43CwexBh8oTLfbTt3kxzXYDmuhDnBia5PyJBun960ctGFYBtCVImSDq+iBTwNh3g9kiM1p3f6Wgt5/zxEPn+MR68kTirAEkUYGnIT/Cyr57hS/VcPruepob13ByGwxeiJGbzXGyvYkNpDiFzKyBLAGPZ2JbFw0iK4fdTNFS76W8v5ciuImIZHz13xgHo2h9EONkVChQK0Bo8AU4OJLAXE2wLPqW/cw+d+0JEvua5/jRBW1OSltoA/hLF1PwqBSgHR2hsMYvlCxHJ13Gi5xEAp/cGkV4v15+lANhVU7BKAWDIcvVMNY2ViuefBUf6PhHJBHnxYZrtm9bh6DSvJ4MArHFnf4e4Vs3QWLlEZnu5wSGJ9PlJ66WabSewPUVLOWYFRIVUzOBhKDbPjkovQ180wluEsFx0XftIWYkfVVLF5PQMvXfjjCW9y0cFoITleieUK3z4ynv03ASu4k2IwkIAMu5SPmqQRTAH9EVzmHwGjBNbHpAfi7SoivATFNWywI+dnYLsX17PUrCoY8lb3UcBDSCEEBZQ9vO21T9+sQaSQPwH/oTte3BfqX4AAAAASUVORK5CYII=';

const logoRssTransp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gLDhUULdQqmHsAAAH3SURBVCjPjZBNS+NQGIWf9947wZqWWisWXAyCzcJaiXT+Qf+G6O/UvVtBMLa1XyLFD3QRpWk1SZM7CzHDwCzmwOGFA4fz8sjp6akDtK21DqAAKyL8Q99hDFwboF2tVitpmnJ0dESSJLy/vxOGIVprjDEopdBaA2Ct/XF/f39orLWlPM+p1+t0u92/JkajEVdXV6RpitYaESHLMoCyERExxiAinJ+fIyK4rsvOzg6e5+F5Hjc3NwRBgIiglALAABZgPp+ztrZGHMekacrt7S3D4ZBOp8PBwQFaa4IgKL7Rvu//LJVKqlwuc3x8jO/71Ot1kiTh+fmZ6XRKo9Fgd3eXIAhYLpfM5/OvYqVSUY7jEMcxYRjieR57e3skScLd3R0vLy+0222yLGM2m7FYLL6KtVpNAcXCeDxmY2ODVqvFw8MDj4+PiAidTofLy0sWiwXKWstqtWK5XJKmKcYYwjDk7OwMAN/3+WYAsLm5+QXHWksURXS7XXzfp9/vc3FxwcfHB71ej1arxfr6Op+fnwA4jgOAyvNc8jyn2WwCsL+/X2B/e3sDwHXdgubW1tYfqq7rqmq1SqPRoNfrMZvNAAo4T09PrFYrJpMJg8GAJEmQk5OTX9vb22UR4dvWWqy15Hle3CzLijyKosiIyPXr6+shUOb/FAHXvwGFg/gbBn5+xQAAAABJRU5ErkJggg==';

/*************** GO! ******************/
// check <link rel="alternate">
var xpathResult=document.evaluate('//link[@rel="alternate" or @rel="chapter" or @rel="section" or @rel="subsection"][contains(@type, "rss") or contains(@type, "atom") or contains(@type, "rdf") or contains(@type, "xml")]', document, null, 0, null);
while(item=xpathResult.iterateNext()) {
	Feeds.push(item);
	control+=", "+item.href;
	}
	
// check direct links to rss feeds not declared as <link>	
if(Feeds.length==0) {
	var xpathResult=document.evaluate('//a[contains(@href,".rss") or contains(@href,"=rss") or contains(@href, ".atom") or contains(@href, "=atom") or ((contains(@href,"feed") or contains(@href,"rss")) and (contains(@href, "rdf") or contains(@href, "xml")))]',document,null,0,null);
	while(item=xpathResult.iterateNext()) {
		Feeds.push(item);
		control+=", "+item.href;
		}
	}		

/* COMMON STYLES */
// styles
GM_addStyle('#SGSmain {position:fixed;z-index:32767;top:0;right:0;padding: 0 0 0 20px;min-height:20px;background:2px 2px url('+waitLogo+') no-repeat;}');
GM_addStyle('#SGSmain.subscribed {background:2px 2px url('+logoRssBleu+') no-repeat;}');
GM_addStyle("#SGSmain.subscribed:hover {background: transparent;}");
GM_addStyle('#SGSmain.notSubscribed {background:2px 2px url('+logoRssOrange+') no-repeat;}');
GM_addStyle("#SGSmain.subscribed:hover {background: transparent;}");	
GM_addStyle('#SGSmain:hover {padding:0;}');	
GM_addStyle('#SGSmain > div {display:none;}');
GM_addStyle('#SGSmain:hover > div {display:block;padding:1px 0;background:'+colPal.back+';-moz-border-radius: 0 0 0 3px;border:solid '+colPal.front+';border-width:0 0 2px 2px;}');
GM_addStyle('#SGSmain a {display:block;margin:0 0 0 3px;padding:2px 10px 2px 7px;font-family:"Verdana";font-size:11px;line-height:14px;font-weight:normal;text-decoration:none;color:'+colPal.front+';text-align:left;background:'+colPal.back+';border:0;}');
GM_addStyle('#SGSmain a:hover {background-color:'+colPal.high+';color:'+colPal.front+';}');
GM_addStyle('#SGSmain a.abonne {background-color:'+colPal.front+';color:'+colPal.light+';}');
GM_addStyle('#SGSmain a.abonne:hover {padding:0px 10px 0px 6px;background-color:'+colPal.light+';color:'+colPal.front+';border:solid '+colPal.high+'; border-width:2px 0 2px 2px}');
GM_addStyle('@media print {#SGSmain{display:none}}');

if (Feeds.length>0) {
	/* CONTEXTUAL STYLES */
	GM_addStyle('#SGSmain.partSubscribed {background:2px 2px url('+logoRssVert+') no-repeat;}');
	GM_addStyle("#SGSmain.partSubscribed:hover {background: transparent;}");
	// create list of link to subscribe to feeds
	var SGSmain=document.createElement('div');
		SGSmain.setAttribute('id','SGSmain');
	document.body.appendChild(SGSmain);
	var SGSfeeds=document.createElement('div');
	SGSmain.appendChild(SGSfeeds);
	for(var f in Feeds) {
		var feed=Feeds[f];	
		UrlList[f]=encodeURIComponent(feed.href);
		var feedTitle=feed.title;
		if(feedTitle=="") feedTitle=feed.textContent;
		FeedLinks[f]=document.createElement("a");
		FeedLinks[f].setAttribute("href","https://www.google.com/reader/view/feed/"+UrlList[f]);
		FeedLinks[f].setAttribute("id",UrlList[f]);
		FeedLinks[f].innerHTML=feedTitle;
		SGSfeeds.appendChild(FeedLinks[f]);
		}
	// verify if feed is already subscribed
	verifyFeed(0);
	}
	
else {
// create an artificial feed
	if(SGSDiffbot==1) {
		/* CONTEXTUAL STYLES */
		GM_addStyle('#SGSmain.noFeed {background:2px 2px url('+logoRssTransp+') no-repeat;}');
		GM_addStyle("#SGSmain.noFeed:hover {background: transparent;}");
		//create an artificial feed link through diffbot (http://www.diffbot.com)
		var SGSmain=document.createElement('div');
			SGSmain.setAttribute('id','SGSmain');
		document.body.appendChild(SGSmain);
		var SGSfeeds=document.createElement('div');
		SGSmain.appendChild(SGSfeeds);
	 	createdFeedUrl="http://api.diffbot.com/rss/"+window.location.href;
		createdFeedTitle=document.title;
		var encodedFeedUrl=encodeURIComponent(createdFeedUrl);
		var thisFeed=document.createElement("a");
			thisFeed.setAttribute("href","https://www.google.com/reader/view/feed/"+encodedFeedUrl);
			thisFeed.setAttribute("id",encodedFeedUrl);
			thisFeed.innerHTML=createdFeedTitle;
			SGSfeeds.appendChild(thisFeed);
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.google.com/reader/api/0/subscribed?s=feed%2F"+encodedFeedUrl,
			onload: function(response) {
				if (response.responseText=="true") {
					document.getElementById(encodedFeedUrl).className="abonne";
					subStatus="subscribed";
					}
				else {
					subStatus="noFeed";
					}
				SGSmain.className=subStatus;
				},
			});		
		}
	}
	} // end of Main Window only control

function colorPalette(b,h,f,l) {this.back=b;this.high=h;this.front=f;this.light=l;}
	
function verifyFeed(n) {
	if(n<FeedLinks.length) {
		GM_xmlhttpRequest({
			method:"GET",
			url:"https://www.google.com/reader/api/0/subscribed?s=feed%2F"+UrlList[n],
			onload: function(resp) {
				if (resp.responseText=="true") {
					if(subStatus=="notSubscribed" || subStatus=="partSubscribed") subStatus="partSubscribed";
					else subStatus="subscribed";
					FeedLinks[n].className="abonne";
					}
				else {
					if(subStatus=="subscribed" ||subStatus=="partSubscribed") subStatus="partSubscribed";
					else subStatus="notSubscribed";
					}
				n=n+1;
				verifyFeed(n);
				SGSmain.className=subStatus;			
				},});}}