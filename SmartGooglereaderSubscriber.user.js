// ==UserScript==
// @name		Smart Google Subscriber
// @namespace	http://userscripts.org/scripts/show/33600
// @description	display a small icon for subscribing to the feeds of the current page. 
//			based upon Jasper's Google Reader subscribe.
//			see http://browservulsel.blogspot.com/2006/05/google-reader-subscribed-indicator.html for more informations
// @version	S-0.5
// @licence	ask Jasper de Vries please. I don't know...
// ==/UserScript==.
/********** SCRIPT VERSION CONTROL *************/
/* This script parameters */
var thisId=33600;
var thisVersion="S-0.5";
/* This script version control  */
GM_scriptVersionControl(thisId,thisVersion);
// define function
function GM_scriptVersionControl(scriptId,version) {
// version 0.0.3
//  http://userscripts.org/scripts/show/35611
	// Styling
	GM_addStyle("#alerte {position:absolute;top:5px;left:50%;margin:20px 0 0 -128px;padding:6px;width:250px;background:black;border:white 1px solid;color:white;font-size:12px;text-align:center} #alerte a {color:white;font-weight:bold;font-size:12px}");
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
		Txt[4]["fr"]="Voulez-vous";
		Txt[5]["fr"]="l'installer";
		Txt[6]["fr"]="voir le code";
		// english
		Txt[1]["en"]="You're using";
		Txt[2]["en"]="version of";
		Txt[3]["en"]="script. Official release version is different";
		Txt[4]["en"]="Do you want to";
		Txt[5]["en"]="install it";
		Txt[6]["en"]="view code";
	/* ------------------------------- */	
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
		//alert(responseDetails.responseText);
			var parser=new DOMParser();
			var dom=parser.parseFromString(responseDetails.responseText,"application/xml");
			var offRel=dom.getElementById('right').getElementsByTagName('code')[0].getElementsByTagName('b')[0].textContent;
			var scriptName=dom.getElementById('content').getElementsByTagName('h1')[0].textContent;
			if(offRel!=version) {
				var alerte=document.createElement('div');
				alerte.setAttribute('id','alerte');
				var textAlerte=Txt[1][lang]+" "+version+" "+Txt[2][lang]+" <i><b>"+scriptName+"</b></i>";
				textAlerte+=". "+Txt[3][lang]+" (<a href='http://userscripts.org/scripts/show/"+scriptId+"'>"+offRel+"</a>)";
				textAlerte+=" "+Txt[4][lang]+" <a  href='http://userscripts.org/scripts/source/"+scriptId+".user.js'>"+Txt[5][lang]+"</a>? (<a href='http://userscripts.org/scripts/review/"+scriptId+"'>"+Txt[6][lang]+"</a>)";
				document.body.appendChild(alerte);
				document.getElementById('alerte').innerHTML=textAlerte;
				}
			}
		});
	}

/* About 
  Author: Jasper de Vries, jepsar@gmail.com
	Date:   2006-04-13
  
  Change for version 0.3 by Mihai Parparita: 
	Check if the user is already subscribed, and modify the appearance of the image accordingly.
  
  Change for version 0.4 by Sylvain Comte:
	Date : 2006-12-01
	Change the image for subscribed feeds into a smaller one. Control also if all feeds are subscribed or only some of them.
*/

/********* CONSTANTES ****************/
// the three logos...
const logoRssOrange = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJnSURBVDiNpdNPSNNhHMfxj66SLFcOMis6dAoPXYooPIUdgqCi0Z8RK2gsDEcpVmSkJUZoGWJQEUURpNEfSjxElygiorLSLmW2X/ZbOjeVqTndouXeHbbGj6AI+sKH57k8r8/l+wjQ/0TD15Y6Bk7O7TYrs/CXCX+ZMP6QQGUWwZNzetqPLC6UZAOkgbq87pHG2YTbNhF80sDQs1NMvqxh4t5KErcWkryzCCwZbZyNeTzvk6QFkmwyfWLqegH+Vhe/T7zvKeN31zDVMh9aU0m2FGD6hKQiSTNkeEXyioPwucV0NK3l+ZkSOlsqiJhdGShyfy/fL+XDVQdcdWB4haRlKcAjuGgncd7OQH0uofpZxM7mEW7IJdBWSTw6CkD/HS9TF+xw0Y7hsQK7BM25hGpzMo2xYBdfb29l8vRMehqXEx8fAWDs8kqSzbkYu6yAW3A6h+EaGyPvHxH++CYDDT+oJVo3jcDN8hRsPCbRMB3DbQV2CE5kk6zLJnYsi0CFeFRVTCzdOnRlE+GDImKk4LFTSzB2WAGXSFaLeJUIl4vEURE/LF5UrwYgar5h4pAItvoA+HpvH4bLCmwT0Qrx7Uuq4Ud/J4mDIlgqBj+8BqBvjxg8UwxA6O5R/NuswBZh7J+HdQa9IlYmIm8fAvDKKSabVgEQvFmF32kBTKcIucW4/xUA33pfE/OKH6Wiz5fPQO0Kxj1i7ICDdzfqCZ510msFgi71jLjEkEt0rBNRt0h6BJ7U+es+tVvEdorh7cLYokAGaF+vws9O9ZobhbHh7zE3CmOzAmsWqCSzypJs6Y9RlFb/JUXpN7afIVhSDdLWIM4AAAAASUVORK5CYII=';
const logoRssVert = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDicM/u2nkQAAAnNJREFUeNqlk0tIVGEUx3/f3O/eGXXGJjN1ohaF6Wha0iLxxUQIRbXJlUYLayEtokW4iLYu3NQuMILCTa16gEqFCBGi0EvNNHxBND2cGR8zdzTHnDv3azEUDiUEHThndTjn8Dv/P/xniNKwL0+PrQ0lNuJ+mVQA6Fs0W7pA0z0zG6OewGzL1wUgJR3mytC6S/n3ewJUJ6vBANMd5zkDhJzzCAlKqN9Dcr+kSrRKcwioByJUjKN8KadqnjqpTNPMyJ6Vh6ohVqV8KafyqXQW2YaqGEcBZYAhpQVCJBl3vqV58jgkBSWucpr2tBDIaSQgGmlfbuOp+xHKZYMAaQEgNxWbROES0xtxhBDMbh+jN3afpsRZLnmvcd24jYpYDPgeY0s7g4tDBwwLtM8ao0UhRgrnuWP0UJdfT1/OPVrnTxFNLXDDe5d9q8UYP0QGZAeAboEmLYbX+3kffU0VR7jpeMA5LhLOm6Mr2gFAu96B+K5lvqZ2BOWPo/xRoUrDQvknUGd6q9XHxTllmqZqDR1VZTOowW/9yjRN1RDdoWpHUEAlYKQvsEEmFU5Toe+CT9UvuTLWDMAF4youN/RZ3emFnMhkACDXoCv7GYOFJrfcT0BCcPcbJmKvOKTVIGIwp78DwLPq/RPitkg+B1M1AFQk6nAuQ5YXEs5o+l8RkJ5kWroqlQFRCgm2a5FJa5gDspYP2hBZbhAGdIbayM8tILsYItEw3UudhPLmEI5NXjg2xbTmosS2wAqC0w9a9t+9YK9Dag2SMYIvDnMamJbhMQI7yxnWYa/uBTsE9lbOk5C0CI5f5jxgAQhAAwoA7y9l/kNYQAyI/AQmfwNkA+F+mQAAAABJRU5ErkJggg==';
const logoRssBleu = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDigBB8TH4wAAAoBJREFUeNqlk11Ik2EUx3/P8z7bdK41XToCNe1jKRKKBUIIRlCXYUIEURcVIX0ggUh33tdF4lV6IUEQBBH0CUFXUQaFpUlbHxTZLMvpcpvOOfe879OFYWgFQefqcDic8///OAf+M0TDsdGSeZMcnM3lahyhl6rqz83SKHzS/c49HW2J3js1ZYyx1aydGsR4anZWFNOwRSKki0yukMejC8TTCiEsDGJ5iOZbOFu8dRBoFkLE1ZxYqPE5lXg8X+k4UPtr3SE/jyOL9N6Y4UPcA0ICYEyIjJXcCASAhEJqtIFX43CwexBh8oTLfbTt3kxzXYDmuhDnBia5PyJBun960ctGFYBtCVImSDq+iBTwNh3g9kiM1p3f6Wgt5/zxEPn+MR68kTirAEkUYGnIT/Cyr57hS/VcPruepob13ByGwxeiJGbzXGyvYkNpDiFzKyBLAGPZ2JbFw0iK4fdTNFS76W8v5ciuImIZHz13xgHo2h9EONkVChQK0Bo8AU4OJLAXE2wLPqW/cw+d+0JEvua5/jRBW1OSltoA/hLF1PwqBSgHR2hsMYvlCxHJ13Gi5xEAp/cGkV4v15+lANhVU7BKAWDIcvVMNY2ViuefBUf6PhHJBHnxYZrtm9bh6DSvJ4MArHFnf4e4Vs3QWLlEZnu5wSGJ9PlJ66WabSewPUVLOWYFRIVUzOBhKDbPjkovQ180wluEsFx0XftIWYkfVVLF5PQMvXfjjCW9y0cFoITleieUK3z4ynv03ASu4k2IwkIAMu5SPmqQRTAH9EVzmHwGjBNbHpAfi7SoivATFNWywI+dnYLsX17PUrCoY8lb3UcBDSCEEBZQ9vO21T9+sQaSQPwH/oTte3BfqX4AAAAASUVORK5CYII=';

/*********** VARIABLES ****************/
var item;				// a feed found under <link>
var control="";			// used to avoid multiple occurence for one unique feed (specialy <a href...)
var thisFeed;			// the feed being processed
var Feeds=new Array();	// all  feeds detected in the page

/*************** GO! ******************/
// check <link rel="alternate">
var result=document.evaluate('//link[@rel="alternate"][contains(@type, "rss") or contains(@type, "atom") or contains(@type, "rdf") or contains(@type, "xml")]', document, null, 0, null);
while (item=result.iterateNext()) {
	Feeds.push(item);
	control+=", "+item.href;
	}
	
// check direct links to rss feeds not declared as <link>	
if(Feeds.length==0) {
	function fd(adresse,titre) {this.href=adresse;this.title=titre;}	// define feed objects as fd
	var Links=document.getElementsByTagName("a");					
	for(var i=0;i<Links.length;i++) {
	    var url=Links[i].getAttribute("href");
		var name=Links[i].text;
		var UrlParts=url.split(".");
		var ext=UrlParts[UrlParts.length-1];
		if(ext=="rss" || ext=="xml" || ext=="rdf" || ext=="atom") {
		/* nb : with this method, we can't get some dynamic feed like http://yoursite.net/feed.php?type=rss */
			var reg=new RegExp(url,"g");
			if(!control.match(reg)) {
				var flux=new fd(url,name);
				Feeds.push(flux);
				control+=", "+url;
				}
			}
		}
	}		

if (Feeds.length>0) {
	GM_addStyle('#SGSmain { position: fixed; z-index: 32767; top: 0; right: 0; padding: 0 0 0 20px; min-height: 20px; background: 2px 2px url('+logoRssOrange+') no-repeat; }');
	GM_addStyle('#SGSmain.subscribed { background:2px 2px url('+logoRssBleu+') no-repeat; }');
	GM_addStyle("#SGSmain.subscribed:hover { background: transparent;}");
	GM_addStyle('#SGSmain.partSubscribed { background:2px 2px url('+logoRssVert+') no-repeat; }');
	GM_addStyle("#SGSmain.partSubscribed:hover { background: transparent;}");
	GM_addStyle('#SGSmain:hover { padding: 0; }');
	GM_addStyle('#SGSmain > div { display: none; }');
	GM_addStyle('#SGSmain:hover > div { display: block; padding: 1px 0; background: #f8f8f8; -moz-border-radius: 0 0 0 10px; border: solid #ccc; border-width: 0 0 1px 1px; }');
	GM_addStyle('#SGSmain a { display: block; margin: 4px 0; padding: 0 10px; font-family: "Verdana"; font-size: 11px; line-height: 14px; font-weight: normal; color: #669; text-decoration: underline; text-align: left; background: #f8f8f8; border: 0; }');
	GM_addStyle('#SGSmain a:hover { color: #f66; }');
	GM_addStyle('#SGSmain a.abonne { font-style: italic; }');

	var SGSmain=document.createElement('div');
		SGSmain.setAttribute('id','SGSmain');
	document.body.appendChild(SGSmain);
	var SGSfeeds=document.createElement('div');
	SGSmain.appendChild(SGSfeeds);
  
	for (i in Feeds) {
		var feed=Feeds[i];
		var encodedFeedUrl=encodeURIComponent(feed.href);
		var thisFeed=document.createElement("a");
			thisFeed.setAttribute("href","https://www.google.com/reader/view/feed/"+encodedFeedUrl);
			thisFeed.setAttribute("id",encodedFeedUrl);
			thisFeed.innerHTML=feed.title;
		SGSfeeds.appendChild(thisFeed);
		var doc=document;
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.google.com/reader/api/0/subscribed?s=feed%2F"+encodedFeedUrl,
			onload: function(response) {
				if (response.responseText=="true") {
					doc.getElementById(encodedFeedUrl).className="abonne";
					if(SGSmain.className=="notSubscribed" || SGSmain.className=="partSubscribed") SGSmain.className="partSubscribed";
					else SGSmain.className="subscribed";
					}
				else {
					if(SGSmain.className=="subscribed" || SGSmain.className=="partSubscribed") SGSmain.className="partSubscribed";
					else SGSmain.className="notSubscribed";
					}
				},
			});
		}
	}