**[Main repository][origin]** *is hosted by [Framagit][Framagit] (framasoft Gitlab instance). Please, [report bug and comment there][issues] or on [homepage][homepage]*
## A userscripts collection
You must have [greasemonkey addon][greasemonkey] installed in your Firefox browser in order to make those scripts work ([Tampermonkey][tampermonkey] in Chrome may work also)...

### [GouvCronyme](https://framagit.org/sycom/userScripts/raw/master/GouvCronyme.user.js)
(v0.0.1) - [GVC branch][gvc]
Un userscript pour transformer les acronymes incompréhensibles de l'administration française en acronymes plus explicites via la balise `<acronym>`. Utilise le Répertoire Collaboratif des Acronymes en Usage dans l'Administration Française ([RCAUAF][rcauaf]) disponible sur github... Attention, peinture fraiche!

### [Search Engine Jumper](https://framagit.org/sycom/userScripts/raw/master/SearchEngineJumper.user.js) (v0.1.4) - [SEJ branch](https://framagit.org/sycom/userScripts/tree/SEJ)
Did you know Google is not the only search engine around there? With Search Engine Jumper, when you perform a search on the internet, you will be provided a lot of links to search same terms on other search engines. Currently works (more or less) on Searx (on some instances), Qwant, Google, Yahoo, Bing and DuckDuckGo. No data collected or anything, of course. Stay tuned...

### [Out of Amazon](https://framagit.org/sycom/userScripts/raw/master/OutOfAmazon.user.js)
(v0.3.0) - [OoA branch](https://framagit.org/sycom/userScripts/tree/OoA)
The idea came when speaking about amazon with a friend who is a bookseller. His clients should be able, when browsing amazon, to go straight to his online store to buy him the same book. So was born the [Out of Am*z*n userscript][OoA-home].
#### What it does
right now, it's a very young script.
* On [site homepage map][OoA-home-map] you can pick the local bookstore you wish
* Then, on french amazon store `http(s)://(www.)amazon.fr`, when looking for a book, a button will be added to remind you you can buy in this local bookstore.

### TFH - Twitter Follow Helper
(reloaded version v 0.7)
This script adds some informations on twitter profile pages (if you're logged in for now). As it is a complete rewrite from scratch, consider it as a full beta also. Former version are archived on this repo, just rewind to see them (not working though).

[documentation](./TwitterFollowHelper/documentation.md) is also a work in progress...

### [Rick Astley Super April](https://framagit.org/sycom/userScripts/raw/master/rickAstleySuperApril.user.js)
(v0.0.0) - [rASA branch](https://framagit.org/sycom/userScripts/tree/rASA)
A very very basic script created to funly demonstrate to my children how fast easy it is to code. Will transform any link on any page into a link to Rick Astley's video...

### Smart Google Reader Subscribe Button
(last version 2.1b no more use)
As of Jul 2 2013, this script doesn't work anymore since Google shut down Google Reader. But you may find the script useful as the API is (partialy) reused by many *copycats* ;-)
*You may visit [the script homepage](http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber) if you want more information*
displays a small icon in the upper left corner of the page. Then, by querying Google Reader's API, it tells you whether you already suscribed :
* rss orange orange > to none of the feeds
* rss vert green > to some of the feeds
* rss bleu blue > to all feeds

# circuit
* **[Framagit][origin]**
   * Gitlab > *gh-pages* > [homepage][homepage]
      * Github > *gh-pages* > [github page][github-page]

[origin]:https://framagit.org/sycom/userScripts
[issues]:https://framagit.org/sycom/userScripts/issues
[homepage]:https://sycom.gitlab.io/userScripts
[github-page]:https://sycom.github.io/userScripts
[gvc]:https://framagit.org/sycom/userScripts/tree/GVC

[greasemonkey]:https://addons.mozilla.org/en/firefox/addon/greasemonkey/
[tampermonkey]:https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
[Framagit]:https://framagit.org/sycom/userScripts
[rcauaf]:https://github.com/michelbl/RCAUAF

[OoA-home]:http://sycom.github.io/outOfAm-z-n
[OoA-home-map]:http://sycom.github.io/outOfAm-z-n/map.html
