// ==UserScript==
// @name        Twitter Follow Helper
// @author      Sylvain Comte
// @namespace   http://sylvain.comte.online.fr
// @description Display several informations about the twitter profile your looking at to help you decide wether or not s/he's worth following
// @version     0.7.1
// @downloadURL  https://framagit.org/sycom/userScripts/raw/master/twitterFollowHelper.user.js
// @licence     MIT
// @include     http://twitter.com/*
// @include     http://www.twitter.com/*
// @include     https://twitter.com/*
// @include     https://www.twitter.com/*
// @require     https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// all infos about tfh are at https://framagit.org/sycom/userScripts/


if (window.top === window.self) {
    // Styling
    GM_addStyle(".TFH_score{position:absolute;left:0;top:0;z-index:10;padding:50px 1em 1em 1em;width:3em;text-align:center}.TFH_Bubble{box-sizing:border-box;line-height:2.5em;vertical-align:middle;width:2.5em;height:2.5em;margin:.5em;border-radius:50%;box-shadow:0 0 10px white;text-align:center}.TFH_Bubble div{font-size:.8em;font-weight:600}.TFH_Bubble div span{font-size:.8em;font-weight:300}.TFH_I{padding:.25em .5em}.TFH_NN, TFH_NN a{background-color:#b00;color:white}.TFH_N, TFH_N a{background-color:#c66;color:white}.TFH_O, TFH_O a{background-color:#bbb;color:#444}.TFH_P,TFH_P a{background-color:#cc6;color:white}.TFH_PP,TFH_PP a{background-color:#bb0;color:white}");
    var Months = {"Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};

    console.log("TFH > running");
    // variables
    var You, // store some stats about you here. Add also elsewhere with GM data storing?
        User, // who is the user?
        PageData, // data stored in page
        TFH_score = 0, // the graphical score
        // !todo : add an option to enable this
        Datas = ""; // the Data collector renderer, in case you are a Data geek ;-)
    // !todo : an option to clean those Datas

    // avoid conflict on pages already running jQuery
    this.$ = this.jQuery = jQuery.noConflict(true);

    (function($) {
        $(function() {
            // getting huge data if exists
            if ($('#init-data').length !== 0) {
                PageData = JSON.parse($('#init-data').attr('value').replace(/&quot;/g, '"').replace(/\\\//g, '/'));
                // getting data about user
                User = PageData.profile_user;
                // counting visits
                if (GM_getValue(User.screen_name) !== undefined) User.tfh_visit_count += 1;
                else User.tfh_visit_count += 1;

                // getting some data about you
                // checking if on own page
                if (User.screen_name == PageData.screenName) {
                    console.log("TFH > you're on own page stupid!");
                } else {
                    // get full info about yourself by xmlhttprequesting your page
                    var yourUrl = "https://twitter.com/" + PageData.screenName;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: yourUrl,
                        headers: {
                            'User-agent': 'Mozilla/4.0 (compatible)',
                            'Accept': 'text/html,application/xml,text/xml',
                        },
                        onload: function(responseDetails) {
                            var textResp = responseDetails.responseText;
                            var regEx = /id=\"init-data\" class=\"json-data\" value=\"(.*)\">/g;
                            You = JSON.parse(regEx.exec(textResp)[1].replace(/&quot;/g, '"').replace(/\\\//g, '/')).profile_user;
                            console.log(You);
                            // all things requiring You.xxx stats must take place thereafter

                            /* create score container */
                            $('body').append('<div id="TFH_score" class="TFH_score"></div>');
                            /* first calculations */
                            // !todo add some icons
                            /* is the tweepl a "Star"? */
                            // check 1 : verified definitly yes...
                            if(User.verified === true) User.is_star = true;
                            else User.is_star = false;
                            // check 2 : followers / following
                            var ffratio;
                            if(User.followers_count > 0) {
                                ffratio = User.friends_count / User.followers_count;
                                if(ffratio<0.1 && User.followers_count > 500) User.is_star = true;
                            }
                            if(User.is_star === true) tfhBubble('TFH_O', tfhLingo('is a star'));

                            /* mutual following */
                            if ($('.FollowStatus').length !== 0) {
                                $('.FollowStatus').addClass('TFH_I TFH_PP');
                                tfhBubble('TFH_PP', tfhLingo('does follow you'));
                                TFH_score += 2;
                            } else {
                                if(User.is_star === true) {
                                    $('.ProfileHeaderCard-screenname').append('<span class="FollowStatus TFH_I TFH_O">'+ tfhLingo("doesn't follow you") +'</span>');
                                    tfhBubble('TFH_O', tfhLingo("doesn't follow you") + " / " + tfhLingo("is a star"));
                                }
                                else {
                                    $('.ProfileHeaderCard-screenname').append('<span class="FollowStatus TFH_I TFH_N">'+ tfhLingo("doesn't follow you") +'</span>');
                                    tfhBubble('TFH_N', tfhLingo("does'nt follow you"));
                                    TFH_score += -1;
                                }
                            }
                            console.log("TFH > mutual : " + TFH_score);

                            // listing collected data so far
                            // !todo add ways to activate / clean / collect and display
                            var keys = GM_listValues();
                            for (var t in keys) {
                                Datas += keys[t] + " : " + GM_getValue(keys[t]) + "\n";
                            }
                            //    console.log(Datas);
                            // !todo (maybe) archive data before adding the new ones
                            console.log("TFH > User " + User.screen_name);
                            console.log(User);
                            GM_setValue(User.screen_name + '', JSON.stringify(User));

                            /* social graph convergence */
                            // getting how much people you follow that are following tweepl
                            var fwfg = $('.ProfileUserList-listName a').text().split(" ")[0];
                            fwfg = 100 * fwfg / Math.sqrt(You.friends_count * User.followers_count);
                            if(fwfg < 10) fwfg = Math.round(10*fwfg)/10;
                            else fwfg = Math.round(fwfg);
                            User.social_convergence = fwfg;

                            //!todo choose values for pastille
                            var pastille = "TFH_O";
                            tfhBubble(pastille, "convergence", fwfg, '%');
                            $('.ProfileUserList-listName a').addClass('TFH_I '+ pastille);
                            //                console.log("TFH > You");
                            GM_setValue(You.screen_name + '', JSON.stringify(You));
                            //                console.log(You);

                            /* follow cost (sort of) */
                            // lets get inscription and convert in days until today
                            var Insc = User.created_at.split(" ");
                            var insc = new Date(Insc[5],Months[Insc[1]],Insc[2]),
                                today = new Date();
                            var elapsed = (today - insc)/3600000/24,
                                tweets = User.statuses_count;
                            var fc = Math.round(tweets / elapsed);
                            if(fc < 10) fc = Math.round(10*fc)/10;
                            else fc = Math.round(fc);
                            User.follow_cost = fc;
                            tfhBubble(pastille, 'followcost', fc, tfhLingo('tweets') + '/' + tfhLingo('day'));
                            console.log('TFH > fc: '+fc);

                            // !todo : add info credits etc.
                        },
                        onerror: function(responseDetails) {
                            // !todo complete with some fallback
                            console.log("TFH > error getting your own data");
                        }
                    });
                }
            }
        });
    })(jQuery);

    /* defining some functions */
    // creating score bubbles
    tfhBubble = function(classe, titre, valeur, unite) {
        var info;
        if(valeur === undefined) {
            valeur = "";
            unite = "";
            info = titre;
        }
        else info =  titre +' : '+valeur+' '+unite;
        $('#TFH_score').append('<div class="TFH_Bubble ' + classe + '" title="' + info + '"><div>' + valeur + '</div></span></div>');
    };

    // translator
    var TfhLang = {
        "fr":{
            "is a star":"est une star",
            "does follow you":"vous suit",
            "doesn't follow you":"ne vous suit pas",
            "tweets":"tweets",
            "day":"jour"
        }
    };

    tfhLingo = function(string) {
        if(TfhLang[You.lang] === undefined) return string;
        else {
            if(TfhLang[You.lang][string] === undefined) return string;
            else return TfhLang[You.lang][string];
        }
    };

}
