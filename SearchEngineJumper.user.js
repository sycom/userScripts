// ==UserScript==
// @name         Search Engine Jumper
// @namespace    http://sylvain.comte.online.fr
// @description  search engine kangaroo. Did you know that Google is not the only one? try those...
// @downloadURL  https://git.framasoft.org/sycom/userScripts/raw/master/SearchEngineJumper.user.js
// @include      https://*
// @include      http://*
// @author	     Sylvain Comte
// @version      0.2.0
// @grant        none
// @noframes
// ==/UserScript==

var SEJ_q, // search query
    SEJ_homepage_text = "powered by <a href='https://framagit.org/sycom/userScripts#search-engine-jumper' target='_blank'>Search Engine Jumper userscript</a>";

/* alternative search engine list
   See ./SearchEngineJumper/engineList.json */
var SEJ_SeList = [{"type":"autres moteurs","liste":[{"name":"Qwant","url":"https://qwant.com/?q="},{"name":"Duck Duck Go","url":"https://duckduckgo.com/?q="},{"name":"Searx","url":"https://searx.me/?q="},{"name":"Google","url":"https://google.com/?source=sycom_SEJ&q="},{"name":"Ixquick","url":"https://ixquick.fr/do/search?q="},{"name":"Ask","url":"https://ask.com/web/?q="},{"name":"Yahoo","url":"https://search.yahoo.com/?p="},{"name":"Bing","url":"https://bing.com/?q="},{"name":"Exalead","url":"https://www.exalead.com/search/web/results/?q="},{"name":"Orange","url":" https://lemoteur.orange.fr/?profil=lemoteur&module=lemoteur&bhv=web_mondial&kw="}]},{"type":"images","liste":[{"name":"Duck Duck Go","url":"https://duckduckgo.com/?ia=images&q="},{"name":"Qwant","url":"https://qwant.com/?t=images&q="},{"name":"CC Search","url":"https://ccsearch.creativecommons.org/search?q="},{"name":"Searx","url":"https://searx.me/?category_images&q="},{"name":"Ask","url":"https://ask.com/pictures/?q="},{"name":"Google","url":"https://google.com/search?site=imghp&?q="},{"name":"Wikimedia Commons","url":"https://commons.wikimedia.org/w/index.php?search="},{"name":"Yahoo","url":"https://images.search.yahoo.com/?p="},{"name":"Bing","url":"https://bing.com/images/?q="},{"name":"Exalead","url":"https://www.exalead.com/search/image/results/?q="},{"name":"Tineye","url":"https://www.tineye.com/search/"},{"name":"Pikiwizard","url":"https://pikwizard.com/?q="},{"name":"Pixnio","url":"https://pixnio.com/fr/?s="},{"name":"Morguefile","url":"https://morguefile.com/photos/morguefile/1/"}]},{"type":"cartes","liste":[{"name":"OpenStreetMap","url":"https://www.openstreetmap.org/search?query="},{"name":"Google","url":"https://maps.google.com/?q="},{"name":"Bing","url":"https://bing.com/maps/?q="}]},{"type":"vidéos","liste":[{"name":"Duck Duck Go","url":"https://duckduckgo.com/?ia=videos&q="},{"name":"Qwant","url":"https://qwant.com/?t=videos&q="},{"name":"Ask","url":"https://ask.com/youtube/?q="},{"name":"Google","url":"https://google.com/search?tbm=vid&?q="},{"name":"Yahoo","url":"https://video.search.yahoo.com/?p="},{"name":"Bing","url":"https://bing.com/videos/?q="},{"name":"Exalead","url":"https://www.exalead.com/search/video/results/?q="}]},{"type":"personnes","liste":[{"name":"Qwant","url":"https://www.qwant.com/people?q="},{"name":"Yatedo","url":"https://www.yatedo.fr/search/profil?q="}]}];

/* search engine eligible to search elsewhere
   See ./SearchEngineJumper/engineJump.json */
var SEJ_destList = [{"name":"Qwant","url":"www.qwant.com","searchField":".search_bar__form__input","includeSelector":".results-page","containerClass":"results-column results-column--smart","containerStyle":"border-width: 1px; border-style: solid; border-radius: 3px; box-shadow: none; padding: 1.5em; margin: 0 0 1em 0;","htmlBefore":"<div class='dd' style=''><h2 class=''><span class='icon icon-search'></span>Chercher ailleurs</h2><div class=''>","typeBefore":"<h3 style='color:#777;margin-top:.25em'>","typeAfter":"</h3>","linkClass":"","linkStyle":"margin:0px 3px 3px 0;color:#0064be;line-height:1.5em","linkSepar":" | "},{"name":"DuckDuckgo","url":"duckduckgo.com,www.duckduckgo.com","searchField":"#search_form_input","includeSelector":".results--sidebar","containerClass":"tile tile__body","containerStyle":"text-align:left","htmlBefore":"<div class=''><h2 class=''>Chercher ailleurs</h2></div><div class=''>","typeBefore":"<h5>","typeAfter":"</h5>","linkClass":"","linkStyle":"margin:0px 5px 3px 0","linkSepar":" | "},{"name":"Searx","url":"framabee.org,searx.me,www.privatesearch.io,searx.laquadrature.net,trouvons.org,tontonroger.org","searchField":"#q","includeSelector":"#sidebar_results","containerClass":"panel panel-default","containerStyle":"","htmlBefore":"<div class='panel-heading'><h4 class='panel-title'>Chercher ailleurs</h4></div><div class='panel-body'>","typeBefore":"<h5>","typeAfter":"</h5>","linkClass":"btn btn-default btn-xs","linkStyle":"margin:0px 5px 3px 0","linkSepar":""},{"name":"Google","url":"www.google.com,www.google.fr","searchField":"input[name='q']","includeSelector":"#rhs_block","containerClass":"g g-blk","containerStyle":"margin:5px;padding:15px;border-color:gray;border:solid .5px #ddd;border-radius:3px;box-shadow:0px .75px 1px lightgray;","htmlBefore":"<div class='_pk' style='font-size:18px;color:#222'>Chercher ailleurs</div><div class='panel-body'>","typeBefore":"<div class='_gdf' style='margin:4px 0;color:#777'>","typeAfter":"</div>","linkClass":"","linkStyle":"margin:0px 5px 3px 0;line-height: 1.75em","linkSepar":" | "},{"name":"Yahoo","url":"search.yahoo.com,search.yahoo.fr","searchField":"#yschsp","includeSelector":"#right","containerClass":" cardReg searchRightTop","containerStyle":"","htmlBefore":"<div class='dd' style='padding-top:18px'><h2 class='title'>Chercher ailleurs</h2><div class=''>","typeBefore":"<h3>","typeAfter":"</h3>","linkClass":"btn btn-default btn-xs","linkStyle":"margin:0px 5px 3px 0","linkSepar":" | "},{"name":"Bing","url":"www.bing.com,www.bing.fr","searchField":"#sb_form_q","includeSelector":"#b_context","containerClass":"b_ans","containerStyle":"","htmlBefore":"<div class='b_entityTP'><h2 class=''>Chercher ailleurs</h2><div class=''>","typeBefore":"<h5>","typeAfter":"</h5>","linkClass":"","linkStyle":"margin:0px 5px 3px 0","linkSepar":" | "}];

/* getting current search engine */
var SEJ_url = location.hostname, // get current page hspace
    SEJm; // current search engine (if we are there)

for (var m in SEJ_destList) {
    if (SEJ_destList[m].url.search(SEJ_url) > - 1) SEJm = m; // check if we have the code to run in this search engine
}

/* creating links to alt search engines */
var waitForQuery = function(selector, callback, count) {
    if (document.querySelector(selector)) {
        callback();
    }
    else {
        setTimeout(function() {
            if(!count) {
                count=0;
            }
            count++;
            if(count < 10) {
                waitForQuery(selector,callback,count);
            } else {return;}
        }, 420);
    }
};

if (SEJm !== undefined) {
    var selector = SEJ_destList[SEJm].searchField;
    waitForQuery(selector, SEJ_suggest);
}
else console.log("SEJ > site pas dans la liste des moteurs");

function SEJ_suggest() {
    var s = SEJm,
        element = document.querySelector(selector);
    SEJ_q = escape(element.value);
    if (SEJ_destList[s].includeSelector !== '') {
        var SEJ_Se_div = document.querySelector(SEJ_destList[s].includeSelector);
        var html = SEJ_destList[s].htmlBefore;
        for (var m in SEJ_SeList) {
console.log(SEJ_SeList);
            html += SEJ_destList[s].typeBefore + SEJ_SeList[m].type + SEJ_destList[s].typeAfter;
            var SEJmot = SEJ_SeList[m].liste;
console.log(SEJmot);
            for (var i in SEJmot) {
                if (i > 0) html += SEJ_destList[s].linkSepar;
                html += "<a href='" + SEJmot[i].url + "" + SEJ_q + "' class='" + SEJ_destList[s].linkClass + "' style='" + SEJ_destList[s].linkStyle + "'>" + SEJmot[i].name + "</a>";
            }
        }
        html += "<div style='width:100%;text-align:right;font-size:.85rem;font-style:italic'>" + SEJ_homepage_text + "</div></div></div>";
        var div = document.createElement("div");
        SEJ_Se_div.prepend(div);
        div.setAttribute("class",SEJ_destList[s].containerClass);
        div.setAttribute("style",SEJ_destList[s].containerStyle);
        div.innerHTML = html;
    }
    else console.log("SEJ > pas d'endroit où insérer le code");
}
