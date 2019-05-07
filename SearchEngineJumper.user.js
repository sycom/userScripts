// ==UserScript==
// @name         Search Engine Jumper
// @namespace    http://sylvain.comte.online.fr
// @description  search engine kangaroo. Did you know that Google is not the only one? try those...
// @downloadURL  https://git.framasoft.org/sycom/userScripts/raw/master/SearchEngineJumper.user.js
// @include      https://*
// @include      http://*
// @author	     Sylvain Comte
// @version      0.1.5
// @require      https://cdn.jsdelivr.net/jquery/3.2.1/jquery.min.js
// @grant        none
// @noframes
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery
var SEJ_q, // search query
SEJ_homepage_text = 'powered by <a href=\'https://framagit.org/sycom/userScripts#search-engine-jumper\' target=\'_blank\'>Search Engine Jumper userscript</a>'; // this will be the script homepage
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
            },
            {
                'name': 'Tineye (by image)',
                'url': 'https://www.tineye.com/search/'
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
    },
    {
        'type': 'réseaux sociaux',
        'liste': [
            {
               'name': 'Mastodon',
                'url': 'https://cler.ical.ist/?q='
            },
            {
                'name': 'Google+',
                'url': 'https://plus.google.com/s/'
            },
            {
                'name': 'Twitter',
                'url': 'https://twitter.com/search?q='
            },
        ]
    }
];

/* search engine eligible to search elsewhere */
var SEJ_destList = [
    {
        'name': 'Searx',
        'url': '//framabee.org,//searx.me,www.privatesearch.io,searx.laquadrature.net,//trouvons.org,//tontonroger.org',
        'searchField': '#q',
        'includeIdClass': '#sidebar_results',
        'containerClass': 'panel panel-default',
        'containerStyle': '',
        'htmlBefore': '<div class=\'panel-heading\'><h4 class=\'panel-title\'>Chercher ailleurs</h4></div><div class=\'panel-body\'>',
        'typeBefore': '<h5>',
        'typeAfter': '</h5>',
        'linkClass': 'btn btn-default btn-xs',
        'linkStyle': 'margin:0px 5px 3px 0',
        'linkSepar': '',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.85rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    },
    {
        'name': 'Google',
        'url': 'www.google.com,www.google.fr',
        'searchField': 'input[name="q"]',
        'includeIdClass': '#rhs_block',
        'containerClass': 'g g-blk',
        'containerStyle': 'margin:5px;padding:15px;border-color:gray;border:solid .5px #ddd;border-radius:3px;box-shadow:0px .75px 1px lightgray;',
        'htmlBefore': '<div class=\'_pk\' style=\'font-size:18px;color:#222\'>Chercher ailleurs</div><div class=\'panel-body\'>',
        'typeBefore': '<div class=\'_gdf\' style=\'margin:4px 0;color:#777\'>',
        'typeAfter': '</div>',
        'linkClass': '', //btn btn-default btn-xs',
        'linkStyle': 'margin:0px 5px 3px 0;line-height: 1.75em',
        'linkSepar': ' | ',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.85rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    },
    {
        'name': 'Qwant',
        'url': 'www.qwant.com',
        'searchField': '.search_bar__form__input',
        'includeIdClass': '.results-column--social',
        'containerClass': '',
        'containerStyle': '',
        'htmlBefore': '<div class=\'dd\' style=\'\'><h2 class=\'\'><span class="icon icon-search"></span>Chercher ailleurs</h2><div class=\'\'>',
        'typeBefore': '<h3 style=\'color:#777;margin-top:.25em\'>',
        'typeAfter': '</h3>',
        'linkClass': '',
        'linkStyle': 'margin:0px 3px 3px 0;color:#0064be;line-height:1.5em',
        'linkSepar': ' | ',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.55rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    },
     {
        'name': 'Yahoo',
        'url': 'search.yahoo.com,search.yahoo.fr',
        'searchField': '#yschsp',
        'includeIdClass': '#right',
        'containerClass': ' cardReg searchRightTop',
        'containerStyle': '',
        'htmlBefore': '<div class=\'dd\' style=\'padding-top:18px\'><h2 class=\'title\'>Chercher ailleurs</h2><div class=\'\'>',
        'typeBefore': '<h3>',
        'typeAfter': '</h3>',
        'linkClass': 'btn btn-default btn-xs',
        'linkStyle': 'margin:0px 5px 3px 0',
        'linkSepar': ' | ',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.55rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    },
    {
        'name': 'Bing',
        'url': 'www.bing.com,www.bing.fr',
        'searchField': '#sb_form_q',
        'includeIdClass': '#b_context',
        'containerClass': 'b_ans',
        'containerStyle': '',
        'htmlBefore': '<div class=\'b_entityTP\'><h2 class=\'\'>Chercher ailleurs</h2><div class=\'\'>',
        'typeBefore': '<h5>',
        'typeAfter': '</h5>',
        'linkClass': '',
        'linkStyle': 'margin:0px 5px 3px 0',
        'linkSepar': ' | ',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.7rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    },
    {
        'name': 'DuckDuckgo',
        'url': 'duckduckgo.com,www.duckduckgo.com',
        'searchField': '#search_form_input',
        'includeIdClass': '.results--sidebar',
        'containerClass': 'tile tile__body',
        'containerStyle': 'text-align:left',
        'htmlBefore': '<div class=\'\'><h2 class=\'\'>Chercher ailleurs</h2></div><div class=\'\'>',
        'typeBefore': '<h5>',
        'typeAfter': '</h5>',
        'linkClass': '',
        'linkStyle': 'margin:0px 5px 3px 0',
        'linkSepar': ' | ',
        'htmlAfter': '<div style=\'width:100%;text-align:right;font-size:.7rem;font-style:italic\'>' + SEJ_homepage_text + '</div></div></div>'
    }
];
/* getting current search engine */
var SEJ_url = location.hostname; // get current page hspace
var SEJm; // current search engine (if we are there)
for (var m in SEJ_destList) {
    if (SEJ_destList[m].url.search(SEJ_url) > - 1) SEJm = m; // check if we have the code to run in this search engine
} /* creating links to alt search engines */

if (SEJm !== undefined) SEJ_suggest();
else console.log('SEJ > site pas dans la liste des moteurs');

/* from https://paul.kinlan.me/waiting-for-an-element-to-be-created/
function waitForQuery(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);
    if(element) {
      resolve(element);
      return;
    }
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
} */

/* inspired from https://stackoverflow.com/questions/16149431/make-function-wait-until-element-exists */
function waitForQuery(selector) {
    while(!document.querySelector(selector)) {
        return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);
    if(element) {
      resolve(element);
      return;
    } => setTimeout(r, 500));
    }
}


function SEJ_suggest() {
    var s=SEJm;
    console.log('SEJ > moteur : ' + SEJ_destList[s].name);
console.log(SEJ_destList[s].searchField);
    waitForQuery(SEJ_destList[s].searchField).then(function(element) {
console.log(element);
        SEJ_q = escape(element.value);
        if (SEJ_destList[s].includeIdClass !== '') {
            var SEJ_Se_div = $(SEJ_destList[s].includeIdClass);
            console.log(SEJ_Se_div.length);
            if (SEJ_Se_div.length === 0) {
                setTimeout(function() {SEJ_suggest();}, 420);}
            else {
                console.log("trying");
                var html = '<div class=\'' + SEJ_destList[s].containerClass + '\' style=\'' + SEJ_destList[s].containerStyle + '\'>';
                html += SEJ_destList[s].htmlBefore;
                for (var m in SEJ_SeList) {
                    html += SEJ_destList[s].typeBefore + SEJ_SeList[m].type + SEJ_destList[s].typeAfter;
                    var SEJmot = SEJ_SeList[m].liste;
                    for (var i in SEJmot) {
                        if (i > 0) html += SEJ_destList[s].linkSepar;
                        html += '<a href=\'' + SEJmot[i].url + '' + SEJ_q + '\' class=\'' + SEJ_destList[s].linkClass + '\' style=\'' + SEJ_destList[s].linkStyle + '\'>' + SEJmot[i].name + '</a>';
                    }
                }
                html += SEJ_destList[s].htmlAfter;
                SEJ_Se_div.prepend(html);
            }
        }
       else console.log('SEJ > pas d\'endroit où insérer le code');
    }); // else console.log('SEJ > impossible de trouver la requête');
}
