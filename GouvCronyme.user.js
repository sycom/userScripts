// ==UserScript==
// @name        GouvCronyme
// @namespace   http://sylvain.comte.online.fr
// @description  parce que souvent, les acronymes, on y comprend rien.
// @downloadURL  https://git.framasoft.org/sycom/userScripts/raw/master/GouvCronyme.user.js
// @include     /^https?://.*\.gouv\.fr/?.*$/
// @include     /^https?://.*\.gouvernement\.fr/?.*$/
// @author	     Sylvain Comte
// @version      0.2.0
// @require      https://cdn.jsdelivr.net/jquery/3.2.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==
console.log('GVC > running');
this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery
var Accr = [
], // le tableau des acronymes récupérés sur RCAUAF
regCheck = new RegExp(/[A-Z]+[\w\d]*[A-Z]+[\w\d]*(?![\w]\s)/g), // repère tous les groupes qui contiennent de plus de deux lettres en majuscules
webmaster = 0; // webmaster mode pour ceux qui travaillent sur les sites web du ministère
$(document).ready(function () {
  // un peu de style
  $('abbr').css({
    'text-decoration': 'dotted underline',
    'border-bottom': 'none'
  });
  $('.GVC').css({
    'background-color': 'none'
  });
  // récupération du fichier des acronymes
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://raw.githubusercontent.com/michelbl/RCAUAF/master/glossary.csv',
    headers: {
      'User-agent': 'Mozilla/4.0 (compatible)',
      'Accept': 'text/html,application/xml,text/xml',
    },
    onload: function (responseDetails) {
      var data = responseDetails.responseText;
      var textLines = data.replace(/"/g, '').split(/\r\n|\n/);
      // récupération des en-têtes
      var headings = textLines[0].split(',');
      // récupération des numéros d'en-têtes correspondant à "term" et "definition" (au cas où l'ordre change)
      var hAbbr,
      hText;
      for (var i in headings) {
        if (headings[i] === 'term') hAbbr = i;
        if (headings[i] === 'definition') hText = i;
      }
      if (hAbbr === undefined) hAbbr = 1;
      if (hText === undefined) hText = 2;
      for (var l = 1; l < textLines.length; l++) {
        // récupération des acronymes (attention dépend du csv de base)
        var tmp = textLines[l].split(',');
        // intègre la possibilité qu'un acronyme aie plusieurs sens
        if (Accr[tmp[hAbbr]] !== undefined) {
          Accr[tmp[hAbbr]].push(tmp[hText]);
        } else {
          Accr[tmp[hAbbr]] = [
          ];
          Accr[tmp[hAbbr]].push(tmp[hText]);
        }
      }
      transCronym();
      observer.observe(target, config);
    }
  });
  // création d'un observateur si on "navigue" sur mastodon
  var target = document.body,
  transindic = 'pépère'; // indique si une transposition des acronymes est en cours
  // configuration de l'observateur
  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };
  // construction
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' &&
      transindic !== 'running') {
        // évite qu'on lance plusieurs fois de suite
        transindic = 'running';
        window.setTimeout(transCronym, 420);
      }
    });
  });
  function transCronym() {
    transindic = 'running';
    // récupère l'ensemble des noeuds texte dans body
    $('body *:not(script)').contents().filter(function () {
      var ok = 0;
      if (this.nodeType === 3) {
        if (this.parentNode.nodeName !== 'ABBR') ok = 1;
      }
      return ok;
    }).replaceWith(function () {
      // récupère le contenu du noeud
      var content = this.nodeValue;
      // regarde si il contient un acronyme (! un acronyme est constitué d'une série de majuscules - définition à discuter)
      if (this.nodeValue.match(regCheck)) {
        var result = this.nodeValue.match(regCheck);
        for (var m in result) {
          // nettoie les espaces surnuméraires de l'acronyme
          result[m] = result[m].replace(' ', '');
          // regarde si on l'a dans notre base
          var reg = new RegExp(result[m], 'g');
          if (Accr[result[m]] !== undefined) {
            // récupère l'ensemble des significations possibles et les lie avec "ou "
            var acro = Accr[result[m]][0];
            for (var a = 1; a < Accr[result[m]].length; a++) {
              acro += ' ou ' + Accr[result[m]][1];
            }
            // procède au remplacement de ACRONYM par <abbr title="sens de l'acronyme">ACRONYM</abbr>

            content = content.replace(reg, '<abbr class="GVC" title="' + acro + '">' + result[m] + '</abbr>');
          }
          else {
            if (webmaster === 1) {
              // procède au remplacement de ACRONYM par <abbr title="pas dans le RCAUAF">ACRONYM</abbr>
              content = content.replace(reg, '<abbr class="GVC not" title="pas dans le RCAUAF">' + result[m] + '</abbr>');
            }
          }
        }
      }
      return content;
    });
    transindic = 'pépère';
    // applique le style "webmaster" si nécessaire
    if (webmaster === 1) {
      $('.GVC').css({
        'background-color': '#128297',
        'color': 'white',
        'padding': '0 2px'
      });
      $('.GVC.not').css({
        'background-color': '#972412',
        'color': 'white',
        'padding': '0 2px'
      });
    }
    if (webmaster === 0) $('.GVC').css({
      'background-color': 'inherit',
      'color': 'inherit'
    });
  }
});
// chargement du style en fonction du mode (utilisateur ou webmaster)
function switchAbbrStyle() {
  webmaster = Math.abs(webmaster - 1);
  console.log('GVC > switch webmaster : ' + webmaster);
}
// basculement en mode webmaster quand on appuye sur ctrl + maj + W

$(document).keydown(function (e) {
  // CTRL + Maj + W
  if (e.ctrlKey && e.altKey && e.key == 'w') {
    switchAbbrStyle();
  }
});
