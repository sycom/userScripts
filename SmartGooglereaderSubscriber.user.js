// ==UserScript==
// @name		Smart Google Subscriber
// @namespace	http://sylvain.comte.online.fr
// @description	display a small icon for subscribing to the feeds of the current page. based upon Jasper's Google Reader subscribe. see http://browservulsel.blogspot.com/2006/05/google-reader-subscribed-indicator.html for more informations
// @version	0.4
// @licence	ask Jasper de Vries please. I don't know...
// ==/UserScript==.

/*
  Author: Jasper de Vries, jepsar@gmail.com
	Date:   2006-04-13
  
  Change for version 0.3 by Mihai Parparita: 
	Check if the user is already subscribed, and modify the appearance of the image accordingly.
  
  Change for version 0.4 by Sylvain Comte:
	Date : 2006-12-01
	Change the image for subscribed feeds into a smaller one. Control also if all feeds are subscribed or only some of them.
*/
const logoRssVert = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDicM/u2nkQAAAnNJREFUeNqlk0tIVGEUx3/f3O/eGXXGJjN1ohaF6Wha0iLxxUQIRbXJlUYLayEtokW4iLYu3NQuMILCTa16gEqFCBGi0EvNNHxBND2cGR8zdzTHnDv3azEUDiUEHThndTjn8Dv/P/xniNKwL0+PrQ0lNuJ+mVQA6Fs0W7pA0z0zG6OewGzL1wUgJR3mytC6S/n3ewJUJ6vBANMd5zkDhJzzCAlKqN9Dcr+kSrRKcwioByJUjKN8KadqnjqpTNPMyJ6Vh6ohVqV8KafyqXQW2YaqGEcBZYAhpQVCJBl3vqV58jgkBSWucpr2tBDIaSQgGmlfbuOp+xHKZYMAaQEgNxWbROES0xtxhBDMbh+jN3afpsRZLnmvcd24jYpYDPgeY0s7g4tDBwwLtM8ao0UhRgrnuWP0UJdfT1/OPVrnTxFNLXDDe5d9q8UYP0QGZAeAboEmLYbX+3kffU0VR7jpeMA5LhLOm6Mr2gFAu96B+K5lvqZ2BOWPo/xRoUrDQvknUGd6q9XHxTllmqZqDR1VZTOowW/9yjRN1RDdoWpHUEAlYKQvsEEmFU5Toe+CT9UvuTLWDMAF4youN/RZ3emFnMhkACDXoCv7GYOFJrfcT0BCcPcbJmKvOKTVIGIwp78DwLPq/RPitkg+B1M1AFQk6nAuQ5YXEs5o+l8RkJ5kWroqlQFRCgm2a5FJa5gDspYP2hBZbhAGdIbayM8tILsYItEw3UudhPLmEI5NXjg2xbTmosS2wAqC0w9a9t+9YK9Dag2SMYIvDnMamJbhMQI7yxnWYa/uBTsE9lbOk5C0CI5f5jxgAQhAAwoA7y9l/kNYQAyI/AQmfwNkA+F+mQAAAABJRU5ErkJggg==';

const logoRssBleu = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDigBB8TH4wAAAoBJREFUeNqlk11Ik2EUx3/P8z7bdK41XToCNe1jKRKKBUIIRlCXYUIEURcVIX0ggUh33tdF4lV6IUEQBBH0CUFXUQaFpUlbHxTZLMvpcpvOOfe879OFYWgFQefqcDic8///OAf+M0TDsdGSeZMcnM3lahyhl6rqz83SKHzS/c49HW2J3js1ZYyx1aydGsR4anZWFNOwRSKki0yukMejC8TTCiEsDGJ5iOZbOFu8dRBoFkLE1ZxYqPE5lXg8X+k4UPtr3SE/jyOL9N6Y4UPcA0ICYEyIjJXcCASAhEJqtIFX43CwexBh8oTLfbTt3kxzXYDmuhDnBia5PyJBun960ctGFYBtCVImSDq+iBTwNh3g9kiM1p3f6Wgt5/zxEPn+MR68kTirAEkUYGnIT/Cyr57hS/VcPruepob13ByGwxeiJGbzXGyvYkNpDiFzKyBLAGPZ2JbFw0iK4fdTNFS76W8v5ciuImIZHz13xgHo2h9EONkVChQK0Bo8AU4OJLAXE2wLPqW/cw+d+0JEvua5/jRBW1OSltoA/hLF1PwqBSgHR2hsMYvlCxHJ13Gi5xEAp/cGkV4v15+lANhVU7BKAWDIcvVMNY2ViuefBUf6PhHJBHnxYZrtm9bh6DSvJ4MArHFnf4e4Vs3QWLlEZnu5wSGJ9PlJ66WabSewPUVLOWYFRIVUzOBhKDbPjkovQ180wluEsFx0XftIWYkfVVLF5PQMvXfjjCW9y0cFoITleieUK3z4ynv03ASu4k2IwkIAMu5SPmqQRTAH9EVzmHwGjBNbHpAfi7SoivATFNWywI+dnYLsX17PUrCoY8lb3UcBDSCEEBZQ9vO21T9+sQaSQPwH/oTte3BfqX4AAAAASUVORK5CYII=';

var result = document.evaluate('//link[@rel="alternate"][contains(@type, "rss") or contains(@type, "atom") or contains(@type, "rdf") or contains(@type, "xml")]', document, null, 0, null);
var item;
var thisFeed;
var Feeds = new Array();
while (item = result.iterateNext()) Feeds.push(item);

if (Feeds.length > 0) {
  GM_addStyle('#JGRSmain { position: fixed; z-index: 32767; top: 0; right: 0; padding: 0 0 0 20px; min-height: 20px; background: 2px 2px url("chrome://browser/skin/page-livemarks.png") no-repeat; }');
  GM_addStyle('#JGRSmain.subscribed { background:2px 2px url('+logoRssBleu+') no-repeat; }');
  GM_addStyle("#JGRSmain.subscribed:hover { background: transparent;}");
  GM_addStyle('#JGRSmain.partSubscribed { background:2px 2px url('+logoRssVert+') no-repeat; }');
  GM_addStyle("#JGRSmain.partSubscribed:hover { background: transparent;}");
  GM_addStyle('#JGRSmain:hover { padding: 0; }');
  GM_addStyle('#JGRSmain > div { display: none; }');
  GM_addStyle('#JGRSmain:hover > div { display: block; padding: 1px 0; background: #f8f8f8; -moz-border-radius: 0 0 0 10px; border: solid #ccc; border-width: 0 0 1px 1px; }');
  GM_addStyle('#JGRSmain a { display: block; margin: 4px 0; padding: 0 10px; font-family: "Verdana"; font-size: 11px; line-height: 14px; font-weight: normal; color: #669; text-decoration: underline; text-align: left; background: #f8f8f8; border: 0; }');
  GM_addStyle('#JGRSmain a:hover { color: #f66; }');
  GM_addStyle('#JGRSmain a.abonne { font-style: italic; }');

  var JGRSmain = document.createElement('div');
  JGRSmain.setAttribute('id', 'JGRSmain');
  document.body.appendChild(JGRSmain);

  var JGRSfeeds = document.createElement('div');
  JGRSmain.appendChild(JGRSfeeds);
  
for (i in Feeds) {
	var feed=Feeds[i];
	var encodedFeedUrl=encodeURIComponent(feed.href);
	var thisFeed=document.createElement("a");
		thisFeed.setAttribute("href","https://www.google.com/reader/view/feed/"+encodedFeedUrl);
		thisFeed.setAttribute("id",encodedFeedUrl);
		thisFeed.innerHTML=feed.title;
	JGRSfeeds.appendChild(thisFeed);
	var doc=document;
	GM_xmlhttpRequest({
      method: "GET",
      url: "https://www.google.com/reader/api/0/subscribed?s=feed%2F"+encodedFeedUrl,
	  onload: function(response) {
			if (response.responseText=="true") {
				doc.getElementById(encodedFeedUrl).className="abonne";
				if(JGRSmain.className=="notSubscribed" || JGRSmain.className=="partSubscribed") JGRSmain.className="partSubscribed";
				else JGRSmain.className="subscribed";
				}
			else {
				if(JGRSmain.className=="subscribed" || JGRSmain.className=="partSubscribed") JGRSmain.className="partSubscribed";
				else JGRSmain.className="notSubscribed";
				}
		},
	  });
	
	}
}