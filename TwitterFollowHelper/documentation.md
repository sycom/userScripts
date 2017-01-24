# About TFH indicators
For now, each indicators may take 5 values from -2 (bad point - red) to +2 (good point - green).

## Notations
* y = you, u = user
* Fg(x) = people following "x"
* Fw(x) = people "x" follows
* Nt(x,t) = number of tweets of "x" during time "t"

## Ify : Following you?
* if the tweepl is following you're more about to have interaction with him, so it's a good point.
    * in the future it might be a good idea to moderate this if the tweepl is following a lot ("serial follower")
* if the tweepl is not following you, may be he just doesn't know how nice you are, so it's a not so bad point.
    * in the future this will be nuanced if the tweepl is a "star" (to define)

| Ify | doesn't | doesn't but is a star | does and also x persons |
| score | -1 | 0 | 2|


## Isgc : Social graph convergence?
In the past, there were online services helping to count precisely how much followers / following you had in common with tweepl. There's no more. So last info remaining is how much people you follow that are following tweepl (fwfg(y,u) = Fw(y) ∩ Fg(u)).
So we calculate :
* Ty : fwfg(y,u) / People you follow
* Tu : fwfg(y,u) / People following User
And indicator will be their [geometric mean](https://en.wikipedia.org/wiki/Geometric_mean) expressed in % for readability :
Isgc = 100 * sqrt(Ty*Tu) = 100 * fwfg(y,u) / sqrt(Fw(y) * Fg(u))

Have to browse some profiles to scale this one.

| Isgc | 0 | >a* | >b* | >c* | >d* |
|score | -2|  -1 |  0  |   1 |  2  |

## The tweepl is a star
Probably if Fw(u) / Fg(u) is low, tweepl is a "star". Also have to check if Fg(u) is high.

## The tweepl is a human being
Probably if Fw(u) is too high, s/he is not able to read all tweets and you may expect low engagement

## The tweepl tweets a lot
unfortunately [milliscoble](https://en.wikipedia.org/wiki/Robert_Scoble#Milliscoble) are not calculated any more (did you know it [disapeared from the web](https://www.qwant.com/?q=milliscobble&t=all)?). So will have to get this info by dividing Nt(u,all time) / all time and Nt(u,current page)/ current page

# Ideas for next
## The tweepl favorites a lot
## The tweepl retweets a lot
## Klout score or similar
## ...

# Ideas to keep in mind in old code

````
function giveMeInfos() {
    // let's wait for jQuery to load (Twitter does this) then launch
    if(!$) window.setTimeout(giveMeInfos,10);
    else {
            alert("ok y a jquery");
           //linkify();
           //seekDatas();
        }
    }

function linkify() {
    if(typeof jQ('.js-action-profile')[0]=='undefined') window.setTimeout(linkify,42);
    else {
        jQ('a').bind('click',function () {
            if(jQ(this).hasClass('twitter-atreply')) {
                var id=jQ(this).attr('data-screen-name');
                window.location="https://twitter.com/"+id;
                }
            if(jQ(this).hasClass('js-action-profile')) {
                var id=jQ(this).attr('href').split("/#!/")[1];
                window.location="https://twitter.com/"+id;
                }
            });
        }
    }

function seekDatas() {
    // waiting for f... "new" twitter ajax ui to load
    if(typeof jQ('.screen-name')[0]=='undefined') window.setTimeout(seekDatas,10);
    else {
        user=jQ('.screen-name')[0].innerHTML.split('<s>@</s>')[1];
        Datas[user]=new Array();
        Datas[user][0]=user;
        // corrigé suite à mise à jour Twitter v0.5c
        var test;
        Datas[user][1]=jQ('.stats li strong')[0].innerHTML;Datas[user][1]=Datas[user][1].replace(/[, ]/g,"");
        Datas[user][2]=jQ('.stats li strong')[1].innerHTML;Datas[user][2]=Datas[user][2].replace(/[, ]/g,"");
        Datas[user][3]=jQ('.stats li strong')[2].innerHTML;Datas[user][3]=Datas[user][3].replace(/[, ]/g,"");
        var moreInfosConteneur=document.createElement("div");
            moreInfosConteneur.id="TFH-moreInfosConteneur";
            moreInfosConteneur.setAttribute("class","module component");
        var moreInfos=document.createElement("div");
            moreInfos.id="TFH-moreInfos";
            moreInfos.setAttribute("class","flex-module");
        var moreInfosList=document.createElement("ul");
            moreInfosList.id="TFH-moreInfosList-g";
        //    moreInfosList.setAttribute("class","TFH-moreInfosList");
        for(var i=0;i<5;i++) {
            var item=document.createElement("li");
            item.id="TFH-i-"+i;
            moreInfosList.appendChild(item);
            }
        moreInfos.appendChild(moreInfosList);
        moreInfosList=document.createElement("ul");
        moreInfosList.id="TFH-moreInfosList-d";
    //    moreInfosList.setAttribute("class","TFH-moreInfosList");
        for(var i=5;i<9;i++) {
            var item=document.createElement("li");
            item.id="TFH-i-"+i;
            moreInfosList.appendChild(item);
            }
        moreInfos.appendChild(moreInfosList);
        var propBy=document.createElement("div");
            propBy.id="TFH-propBy";
            propBy.setAttribute("class","flex-module");
            propBy.innerHTML="informations provided by <a href='http://twitter.com/sycom'>@sycom</a>'s <a href='http://sylvain.comte.online.fr/AirCarnet/?post/Twitter-Follow-Helper'>Twitter Follow Helper</a>";
        with(moreInfosConteneur) {
            appendChild(propBy);
            appendChild(moreInfos);
            }
            jQ('.module')[1].id="TFH-firstSpacer";
            jQ('#TFH-firstSpacer').after(moreInfosConteneur);
            // get your user name
            if(you==null && jQ(".js-mini-current-user")[0]) you=jQ(".js-mini-current-user")[0].getAttribute("data-screen-name");
            // data search
        //    getSocialData(you,user,1);
            getRepliesAndFollowCost(user,2,4);
        //    getFavstarData(user,3); suspended for the moment
            getKloutScore(user,5)
            getSearchPop(user,6);
        //    getRtRank(user,7); not working now. Api key required...
            discoverMore(user,8);
        }
    }

// dispatching datas on the screen
function displayDatas(data,j) {
    var li=jQ('#TFH-i-'+j);
    li.html(data);
    }

function getRepliesAndFollowCost(username,k,l) {
// followCost from http://followcost.com and @replay %
    var htm="<span class='label'>@replies</span> <a href='http://followcost.com/" + username +"' class='url'><span style='font-style:italic'>loading...</span></a>";
    displayDatas(htm,k);
    htm="<span class='label'>Follow Cost</span> <span style='font-style:italic'>loading...</span>";
    displayDatas(htm,l);
    jQ.getJSON("http://followcost.com/"+username+".json?callback=?", function(json) {
        Datas[user][5]=json.at_reply_index;Datas[user][6]=json.milliscobles_recently;Datas[user][7]=json.milliscobles_all_time;Datas[user][8]=json.average_tweets_per_day_recently;

        if(json.at_reply_index==null) htm="unable to retrieve <span class='label'>@replies</span> rate";
        else htm="<span class='label'>@replies</span> <a href='http://followcost.com/" + username +"' class='url'>"+ json.at_reply_index +" %</a>";
        displayDatas(htm,k)

        if(json.milliscobles_recently==0) htm="<span class='label'>Follow Cost</span><br/>&nbsp;&nbsp;-&nbsp;<a href='http://followcost.com/" + username +"' class='url'>0 tweet a day </a>recently<br/>&nbsp;&nbsp;-&nbsp;<a href='http://followcost.com/" + username +"' class='url'>"+Math.round(json.milliscobles_recently)+" m&Sigma; ("+Math.round(json.milliscobles_all_time)+" all time)</a>";

        else htm="<span class='label'>Follow Cost</span><br/>&nbsp;&nbsp;-&nbsp;<a href='http://followcost.com/" + username +"' class='url'>"+Math.round(json.average_tweets_per_day_recently)+" tweets a day </a>recently<br/>&nbsp;&nbsp;-&nbsp;<a href='http://followcost.com/" + username +"' class='url'>"+Math.round(json.milliscobles_recently)+" m&Sigma; ("+Math.round(json.milliscobles_all_time)+" all time)</a>";

        displayDatas(htm,l);
        });
    }

function getSocialData(user0,user1,k) {
// common following / followers from http://twtrfrnd.com/
    if(user0!=null) {
        var htm="<span class='label'>Social graph</span> convergence <a href='http://twtrfrnd.com/"+user0+"/"+user1+"' class='url'><span style='font-style:italic'>loading...</span></a>";
        displayDatas(htm,k);
        if(user0!=user1) {
            var twtrfrndUrl="http://twtrfrnd.com/"+user0+"/"+user1;
            GM_xmlhttpRequest({
                method: 'GET',
                url: twtrfrndUrl,
                headers: {
                     'User-agent': 'Mozilla/4.0 (compatible)',
                     'Accept': 'text/html,application/xml,text/xml',
                     },
                onload: function(responseDetails) {
                    var textResp=responseDetails.responseText;
                    // get some usefull data for you
                    yFng=/is following (\w+) (person|people)/.exec(textResp)[1];
                    yFrs=/is followed by (\w+) (person|people)/.exec(textResp)[1];
                    var cFollowers,cFriends,cIndic,convergence;
                    if(/has protected their account/.test(textResp)) {
                        var htm="no <span class='label'>Social graph</span> (protected account)";
                        }
                    else {
                        var htm="";
                        // apprentice : "Hey, what's this 'convergence'?"
                        // me : "it's an indicator of common friends & followers"
                        if(/There are no people that follow both users/.test(textResp)) {
                            htm+="<br/>&nbsp;&nbsp;- no common followers";
                            convergence=0;
                            cFollowers=0;
                            }
                        else {
                            cFollowers=/The (\w+) (person|people) that follow[s]{0,1} both users/.exec(textResp)[1];
                            htm+="<br/>&nbsp;&nbsp;- <a href='http://twtrfrnd.com/"+user0+"/"+user1+"#groupFollowers' class='url'>"+cFollowers+" follower(s) in common</a>";
                            convergence=eval(Math.sqrt(cFollowers*cFollowers/yFrs/Datas[user][3]));
                            }
                        if(/There are no people that both users follow/.test(textResp)) {
                            htm+="<br/>&nbsp;&nbsp;- no common friend";
                            convergence=convergence/3;
                            cFriends=0;
                            }
                        else {
                            cFriends=/The (\w+) (person|people) that both users follow/.exec(textResp)[1];
                            htm+="<br/>&nbsp;&nbsp;- <a href='http://twtrfrnd.com/"+user0+"/"+user1+"#groupFriends' class='url'>"+cFriends+" friend(s) in common</a>";
                            convergence=(convergence+2*eval(Math.sqrt(cFriends*cFriends/yFng/Datas[user][2])))/3;
                            }
                        if(/There are no people @/.test(textResp)) {
                            htm+="<br/>&nbsp;&nbsp;- no indicator";
                            cIndic=0;
                            }
                        else {
                            //var regIndic=new RegExp("The (\\w+) (person|people) @"+user0+" follows that follow @");
                            cIndic=/The (\w+) (person|people) @/.exec(textResp)[1];
                            htm+="<br/>&nbsp;&nbsp;- <a href='http://twtrfrnd.com/"+user0+"/"+user1+"#groupIndicators' class='url' alt='people you follow that follow "+user1+"'>"+cIndic+" indicators</a>";
                            }
                        convergence=Math.round(convergence*10000)/100;
                        Datas[user][11]=convergence;Datas[user][12]=cFollowers;Datas[user][13]=cFriends;Datas[user][14]=cIndic;
                        htm="<span class='label'>Social graph</span> convergence : "+convergence+"%"+htm;
                        }
                    displayDatas(htm,k);
                    },
                onerror: function(responseDetails) {
                    var htm="unable to extract social graph data from <a href='http://twtrfrnd.com/'>twtrfrnd</a>";
                    displayDatas(htm,k);
                    }
                });
            }
        else {
            htm="<span class='label'>Social graph</span> convergence for yourself is 100% of course";
            displayDatas(htm,k);
            }
        }
    }

function getKloutScore(username,k) {
    // klout score from http://klout.com you'll have to
    // get YOUR OWN API key to perform this (http://developer.klout.com)
    // It's free so don't hurt mine please.
    var kId;
    var kKey="ed"+(9*9+1)+"vycfm"+3+"rb"+(7*9)+"yx"+3+"w4pay"+(7*9-1);
    var htm="<span class='label'>Klout Score</span> <a href='http://klout.com'><span style='font-style:italic'>loading...</span></a>";
    displayDatas(htm,k);
    // retrieving klout id
    var kloutUrl1="http://api.klout.com/v2/identity.json/twitter?screenName="+username+"&key="+kKey;
    GM_xmlhttpRequest({
        method: 'GET',
        url: kloutUrl1,
        headers: {
             'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
             'Accept': 'text/html,application/xml,text/xml',
             },
        onload: function(responseDetails) {
            eval("var jsonResp=("+responseDetails.responseText+")");
            kId=jsonResp.id;
            var kloutUrl2="http://api.klout.com/v2/user.json/"+kId+"/score?key="+kKey;
            GM_xmlhttpRequest({
                method: 'GET',
                url: kloutUrl2,
                headers: {
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
                    'Accept': 'text/html,application/xml,text/xml',
                    },
                onload: function(responseDetails) {
                    eval("var jsonResp=("+responseDetails.responseText+")");
                    var kloutScore=Math.round(jsonResp.score*10)/10;
                    htm="<span class='label'>Klout Score</span> <a href='http://klout.com' class='url'>"+kloutScore+"</a>";
                    displayDatas(htm,k);
                    Datas[user][17]=kloutScore;
                    },
                onerror: function(responseDetails) {
                    var textResp=responseDetails;
                    htm="<span class='label'>Klout Score</span> <a href='http://www.klout.com' class='url'> not retrieved</a>";
                    displayDatas(htm,k);
                    }
                });
            },
        onerror: function(responseDetails) {
            var textResp=responseDetails;
            htm="<span class='label'>Klout Score</span> <a href='http://www.klout.com' class='url'> not retrieved</a>";
            displayDatas(htm,k);
            }
        });
    }

function getSearchPop(username,k) {
    var htm="<span class='label'>Search score</span> <a href='http://twitter.com/#search?q=%40"+username+"'><span style='font-style:italic'>loading...</span></a>";
    displayDatas(htm,k);
    var searchUrl="http://search.twitter.com/search.json?callback=?&q=@"+username;
    jQ.getJSON(searchUrl,function(json) {
        var resp;
        if(json["results"].length>=14) {
            resp=json["results"][14].created_at;
            var timePost=new Date(resp);
            var elapsed=(new Date()-timePost)/1000/60/60;
            var mentions,score;
            if(elapsed!=0) {
                htm="<span class='label'>Search score</span>&nbsp;<a href='http://twitter.com/#search?q=%40"+username+"'>"+Math.round(14*24/elapsed)+" mentions a day</a>";
                Datas[user][16]=Math.round(14*24/elapsed);
                }
            else {
                htm="<span class='label'>Search score</span> <a href='http://twitter.com/#search?q=%40"+username+"'>no mention recently</a>";
                Datas[user][16]=0;
                }
            }
        else htm="<span class='label'>Search score</span> <a href='http://twitter.com/#search?q=%40"+username+"'>not enough mentioned</a>";
        displayDatas(htm,k);
        });
    }

function discoverMore(username,k) {
    // get people this user is finding interessant via http://autoff.com
    var htm="<span class='label'>People s/he likes</span> <a href='http://autoff.com/'><span style='font-style:italic'>asking autoFF...</span></a>";
    displayDatas(htm,k);
    var discovUrl="http://autoff.com/api/"+username;
    // don't know why, but getJSON sending me an error. So let's hack.
    GM_xmlhttpRequest({
        method: 'GET',
        url: discovUrl,
        headers: {
             'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
             'Accept': 'text/html,application/xml,text/xml,text/json',
             },
        onload: function(responseDetails) {
            json=eval("new Array("+responseDetails.responseText+")");
            if(json.length>0) {
                htm="<span class='showMoreWhen'><span class='label'>People s/he likes</span>";
                if(json[0]) {
                    var jsonMax;
                    if(json[0].length<3) jsonMx=json[0].length; else jsonMax=3;
                    for(var i=0;i<jsonMax;i++) {
                        userId=json[0][i].split("@")[1];
                        htm+="<br/>&nbsp;&nbsp;-&nbsp;<a href='"+userId+"'>"+json[0][i]+"</a>";
                        }
                    htm+="<span class='naturallyHidden'>";
                    for(var i=jsonMax;i<json[0].length;i++) {
                        userId=json[0][i].split("@")[1];
                        htm+="<br/>&nbsp;&nbsp;-&nbsp;<a href='"+userId+"'>"+json[0][i]+"</a>";
                        }
                    htm+="</span></span>";
                    }
                else htm="unable to find <span class='label'>People s/he likes</span> with <a href='http://autoff.com/'>autoFF</a>";
                }
            else htm="unable to find <span class='label'>People s/he likes</span> with <a href='http://autoff.com/'>autoFF</a>";
            displayDatas(htm,k);
            },
        onerror: function(responseDetails) {
            htm="unable to find <span class='label'>People s/he likes</span> with <a href='http://autoff.com/'>autoFF</a>";
            displayDatas(htm,k);
            }
        });
    }

// support functions
function hasClass(element,classe) {
    return (' '+element.className+' ').indexOf(' '+classe+' ')>-1;
    }*/
````
