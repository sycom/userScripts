// ==UserScript==
// @name        GouvCronyme
// @namespace   http://sylvain.comte.online.fr
// @description  parce que souvent, les acronymes, on y comprend rien.
// @downloadURL  https://git.framasoft.org/sycom/userScripts/raw/master/GouvCronyme.user.js
// @include     /^https?://.*\.gouv\.fr/?.*$/
// @include     /^https?://.*\.gouvernement\.fr/?.*$/
// @author	     Sylvain Comte
// @version      0.0.3
// @require      https://cdn.jsdelivr.net/jquery/3.2.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==
console.log('GVC > running');
this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery

var Accr = [], // le tableau des acronymes récupérés sur RCAUAF
    regCheck = new RegExp(/[A-Z]+[\w\d]*[A-Z]+[\w\d]*(?![\w]\s)/g); // repère tous les groupes de plus de deux lettres en majuscules qui se suivent et ne sont pas déjà des <abbr>

$(document).ready(function() {
    // récupération du fichier des acronymes
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/michelbl/RCAUAF/master/glossary.csv',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible)',
            'Accept': 'text/html,application/xml,text/xml',
        },
        onload: function(responseDetails) {
            var data = responseDetails.responseText;
            var textLines = data.replace(/"/g, '').split(/\r\n|\n/);
            // récupération des en-têtes
            var headings = textLines[0].split(',');
            for (var l = 1; l < textLines.length; l++) {
                // récupération des acronymes (attention dépend du csv de base)
                var tmp = textLines[l].split(',');
                // intègre la possibilité qu'un acronyme aie plusieurs sens
                if (Accr[tmp[1]] !== undefined) {
                    Accr[tmp[1]].push(tmp[2]);
                } else {
                    Accr[tmp[1]] = [];
                    Accr[tmp[1]].push(tmp[2]);
                }
            }
            // console.log(Accr);
/* à retravailler, ne fonctionne pas en l'état
            // création d'un observateur si on "navigue" sur mastodon
            var target = document.body;
            // configuration de l'observateur
            var config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            };
            // construction
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log(mutation.type);
                    transCronym();
                });
            });
            // mise en route
            observer.observe(target, config);
*/
            transCronym();
        }
    });

    function transCronym() {
        console.log('GVC > transCronym launched');
        // stop observing
        //observer.disconnect();
        // récupère l'ensemble des noeuds texte dans body
        $('body *:not(script)').contents().filter(function() {
            var ok = 0;
            if (this.nodeType === 3) {
                if(this.parentNode.nodeName !== "ABBR") ok = 1;
            }
            return ok;
        }).replaceWith(function() {
            // récupère le contenu du noeud
            var content = this.nodeValue;
            // regarde si il contient un acronyme (! un acronyme est constitué d'une série de majuscules - définition à discuter)
            if (this.nodeValue.match(regCheck)) {
                var result = this.nodeValue.match(regCheck);
                for (var m in result) {
                    // nettoie les espaces surnuméraires de l'acronyme
                    result[m] = result[m].replace(' ', '');
                    // regarde si on l'a dans notre base
                    if (Accr[result[m]] !== undefined) {
                        // récupère l'ensemble des significations possibles et les lie avec "ou "
                        var acro = Accr[result[m]][0];
                        for (var a = 1; a < Accr[result[m]].length; a++) {
                            acro += " ou " + Accr[result[m]][1];
                        }
                        // procède au remplacement de ACRONYM par <abbr title="sens de l'acronyme">ACRONYM</abbr>
                        var reg = new RegExp(result[m], "g");
                        content = content.replace(reg, "<abbr title='" + acro + "'>" + result[m] + "</abbr>");
                    }
                }
            }
            return content;
        });
        // observer.observe(target, config);
        // on refait transCronym toutes les 4,2 secondes.
        // Un peu bourrin, mais pour l'instant, j'ai pas réussi à utiliser observer comme il faut
        window.setTimeout(transCronym,4200);
    }
});
