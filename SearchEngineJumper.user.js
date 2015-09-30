// ==UserScript==
// @name        Search Engine Jumper
// @namespace   http://sylvain.comte.online.fr
// @description search engine kangaroo. Did you know that Google is not the only one? try those...
// @downloadURL https://git.framasoft.org/sycom/userScripts/raw/master/SearchEngineJumper.user.js
// @include     https://*
// @include     http://*
// @author	    Sylvain Comte
// @version     0.1
// @require     https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

var SEJ_q; /* search query */
/* alternative search engine list - see ./SearchEngineJumper/engineList.json */
var SEJ_SeList = [
  {
    'type': 'autres moteurs',
    'liste': [
      {
        'name': 'Searx',
        'url': 'https://searx.com/?q='
      },
      {
        'name': 'Duck Duck Go',
        'url': 'https://duckduckgo.com/?q='
      },
      {
        'name': 'Qwant',
        'url': 'https://qwant.com/?q='
      },
      {
        'name': 'Ixquick',
        'url': 'https://ixquick.fr/do/search?q='
      },
      {
        'name': 'Ask',
        'url': 'https://ask.com/web/?q='
      },
      {
        'name': 'Google',
        'url': 'https://google.com/?q='
      },
      {
        'name': 'Yahoo',
        'url': 'https://search.yahoo.com/?p='
      },
      {
        'name': 'Bing',
        'url': 'https://bing.com/?q='
      },
      {
        'name': 'Exalead',
        'url': 'https://www.exalead.com/search/web/results/?q='
      },
      {
        'name': 'Orange',
        'url': ' https://lemoteur.orange.fr/?profil=lemoteur&module=lemoteur&bhv=web_mondial&kw='
      }
    ]
  },
  {
    'type': 'images',
    'liste': [
      {
        'name': 'Searx',
        'url': 'https://searx.com/?category_images&q='
      },
      {
        'name': 'Duck Duck Go',
        'url': 'https://duckduckgo.com/?ia=images&q='
      },
      {
        'name': 'Qwant',
        'url': 'https://qwant.com/?t=images&q='
      },
      {
        'name': 'Ask',
        'url': 'https://ask.com/pictures/?q='
      },
      {
        'name': 'Google',
        'url': 'https://google.com/search?site=imghp&?q='
      },
      {
        'name': 'Yahoo',
        'url': 'https://images.search.yahoo.com/?p='
      },
      {
        'name': 'Bing',
        'url': 'https://bing.com/images/?q='
      },
      {
        'name': 'Exalead',
        'url': 'https://www.exalead.com/search/image/results/?q='
      }
    ]
  },
  {
    'type': 'cartes',
    'liste': [
      {
        'name': 'OpenStreetMap',
        'url': 'https://www.openstreetmap.org/search?query='
      },
      {
        'name': 'Google',
        'url': 'https://maps.google.com/?q='
      },
      {
        'name': 'Bing',
        'url': 'https://bing.com/maps/?q='
      }
    ]
  },
  {
    'type': 'vidéos',
    'liste': [
      {
        'name': 'Duck Duck Go',
        'url': 'https://duckduckgo.com/?ia=videos&q='
      },
      {
        'name': 'Qwant',
        'url': 'https://qwant.com/?t=videos&q='
      },
      {
        'name': 'Ask',
        'url': 'https://ask.com/youtube/?q='
      },
      {
        'name': 'Google',
        'url': 'https://google.com/search?tbm=vid&?q='
      },
      {
        'name': 'Yahoo',
        'url': 'https://video.search.yahoo.com/?p='
      },
      {
        'name': 'Bing',
        'url': 'https://bing.com/videos/?q='
      },
      {
        'name': 'Exalead',
        'url': 'https://www.exalead.com/search/video/results/?q='
      }
    ]
  },
  {
    'type': 'personnes',
    'liste': [
      {
        'name': 'Qwant',
        'url': 'https://www.qwant.com/people?q='
      },
      {
        'name': 'Yatedo',
        'url': 'https://www.yatedo.fr/search/profil?q='
      }
    ]
  }
];
/* search engine eligible to search elsewhere */
var SEJ_destList = [
  {
    'name': 'Searx',
    'url': '//framabee.org,//searx.me,www.privatesearch.io,searx.laquadrature.net,//trouvons.org,//tontonroger.org',
    'searchField': 'q',
    'includeId': 'sidebar_results',
    'containerClass': 'panel panel-default',
    'containerStyle':'',
    'htmlBefore': '<div class=\'panel-heading\'><h4 class=\'panel-title\'>Chercher ailleurs</h4></div><div class=\'panel-body\'>',
    'linkClass': 'btn btn-default btn-xs',
    'linkStyle': 'margin:0px 5px 3px 0',
    'linkSepar':'',
    'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.85rem;font-style:italic\'>powered by Search Engine Jumper userscript</div></div></div>'
  },
  {
    'name': 'Google',
    'url': 'www.google.com,www.google.fr',
    'searchField': 'lst-ib',
    'includeId': 'rhs_block',
    'containerClass': 'rhstc5 xpdopen',
    'containerStyle':'margin:5px;padding:5px;border-color:gray;border:solid .5px #ddd;border-radius:3px;box-shadow: 0px .75px 1px lightgray;',
    'htmlBefore': '<div class=\'panel-heading\'><h4 class=\'panel-title\'>Chercher ailleurs</h4></div><div class=\'panel-body\'>',
    'linkClass': 'btn btn-default btn-xs',
    'linkStyle': 'margin:0px 5px 3px 0',
    'linkSepar':' | ',
    'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.85rem;font-style:italic\'>powered by Search Engine Jumper userscript</div></div></div>'
  },
  {
    'name': 'Yahoo',
    'url': 'search.yahoo.com,search.yahoo.fr',
    'searchField': 'yschsp',
    'includeId': 'right div',
    'containerClass': '',
    'containerStyle':'margin:5px;padding:5px;border-color:gray;border:solid .5px #ddd;border-radius:3px;box-shadow: 0px .75px 1px lightgray;',
    'htmlBefore': '<div class=\'\'><h4 class=\'\'>Chercher ailleurs</h4></div><div class=\'\'>',
    'linkClass': 'btn btn-default btn-xs',
    'linkStyle': 'margin:0px 5px 3px 0',
    'linkSepar':' | ',
    'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.85rem;font-style:italic\'>powered by Search Engine Jumper userscript</div></div></div>'
  },
  {
    'name': 'Bing',
    'url': 'www.bing.com,www.bing.fr',
    'searchField': 'sb_form_q',
    'includeId': 'b_context',
    'containerClass': '',
    'containerStyle':'',
    'htmlBefore': '<div class=\'\'><h2 class=\'\'>Chercher ailleurs</h4></div><div class=\'\'>',
    'linkClass': '',
    'linkStyle': 'margin:0px 5px 3px 0',
    'linkSepar':' | ',
    'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.7rem;font-style:italic\'>powered by Search Engine Jumper userscript</div></div></div>'
  }
];
/* getting current search engine */
var SEJ_url=location.hostname;
var SEJm;
for (var m in SEJ_destList) {
  if (SEJ_destList[m].url.search(SEJ_url) > -1) SEJm = m;
}

/* creating links to alt search engines */
function SEJ_suggest(s) {
	if (SEJ_destList[s]) {
		SEJ_q = $("#"+SEJ_destList[s].searchField).attr("value");
		$("#"+SEJ_destList[s].includeId).ready(function() {
      console.log("#"+SEJ_destList[s].includeId);
			var SEJ_Se_div = $("#"+SEJ_destList[s].includeId);
      console.log(SEJ_Se_div);
      var html= '<div class=\''+SEJ_destList[s].containerClass+'\' style=\''+SEJ_destList[s].containerStyle+'\'>';
			html += SEJ_destList[s].htmlBefore;
			   for (var m in SEJ_SeList) {
					  html += '<h5>' + SEJ_SeList[m].type + '</h5>';
					  var SEJmot = SEJ_SeList[m].liste;
					  for (var i in SEJmot) {
						if(i>0) html+=SEJ_destList[s].linkSepar;
						html += '<a href=\'' + SEJmot[i].url + '' + SEJ_q + '\' class=\'' + SEJ_destList[s].linkClass + '\' style=\'' + SEJ_destList[s].linkStyle + '\'>' + SEJmot[i].name + '</a>';
						}
					  }
					html += SEJ_destList[s].htmlAfter;
					SEJ_Se_div.prepend(html);
		})
	}
  else console.log("moteur pas dans la liste");
}
if (SEJm) SEJ_suggest(SEJm);
