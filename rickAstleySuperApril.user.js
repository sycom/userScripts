// ==UserScript==
// @name        Rick Astley's Super April
// @author      Sylvain Comte
// @namespace   http://sylvain.comte.online.fr
// @description A fun script to april's fool yourself with Rick
// @version     0.0.0
// @downloadURL  https://framagit.org/sycom/userScripts/raw/master/rickAstleySuperApril.user.js
// @licence     MIT
// @include     *
// @require     https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// all infos about rASA are at https://framagit.org/sycom/userScripts/

// avoid conflict on pages already running jQuery
this.$ = this.jQuery = jQuery.noConflict(true);

(function($) {
    $(function() {
        // change all links in the page to Rick Astley's
        $("a").attr("href","https://bit.ly/rASAlink");
    });
})(jQuery);
