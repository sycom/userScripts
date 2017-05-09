// ==UserScript==
// @name        GouvCronyme
// @namespace   http://sylvain.comte.online.fr
// @description  parce que souvent, les acronymes, on y comprend rien.
// @downloadURL  https://git.framasoft.org/sycom/userScripts/raw/master/GouvCronyme.user.js
// @include     /^https?://.*\.gouv\.fr/?.*$/
// @author	     Sylvain Comte
// @version      0.0.0
// @require      https://cdn.jsdelivr.net/jquery/3.2.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @noframes
// ==/UserScript==
console.log('GVC > running');
this.$ = this.jQuery = jQuery.noConflict(true); // avoid conflict on pages already running jQuery
$(document).ready(function () {
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
            console.log('GVC > data obtained');
            console.log(data);
            //data = new String(data);
            var textLines = data.split(/\r\n|\n/);
            // récupération des en-têtes
            var headings = textLines[0].split(','),
            Accr = [
            ];
            for (var l = 1; l < textLines.length; l++) {
                var tmp = textLines[l].split(','),
                line = [
                ];
                for (var d in tmp) line[headings[d]] = tmp[d];
                Accr.push(line);
            }
            console.log(Accr);
        }
    }
    );
});
