*Le [projet original](https://git.framasoft.org/sycom/userScripts) est hébergé sur [l'instance gitlab de Framasoft](https://git.framasoft.org). D'autres versions peuvent être déployées, notamment sur github, mais il s'agit de mirroirs...*
## A userscripts collection
You must have greasemonkey addon installed in your Firefox browser in order to make those scripts work (Tampermonkey in Chrome may work also)...

### Search Engine Jumper (v0.1 - first launch) - SEJ branch
Did you know Google is not the only search engine around there? With Search Engine Jumper, when you perform a search on the internet, you will be provided a lot of links to search same terms on other search engines. Currently works (more or less) on Searx (some instances), Google, Yahoo and Bing. No data collected or anything, of course. Stay tuned...

### Out of Amazon (v0 - first launch for testing purpose)
The idea came when speaking about amazon with a friend who is a bookseller. His clients should be able, when browsing amazon, to go straight to his online store to buy him the same book. So was born the [Out of Am*z*n userscript](http://sycom.github.io/outOfAm-z-n).
#### What it does
right now, it's a very young script. On french amazon store `http(s)://(www.)amazon.fr`, when looking for a book, a button will be added to send you to this friend's store.

### Smart Google Reader Subscribe Button (last version 2.1b)
As of Jul 2 2013, this script doesn't work anymore since Google shut down Google Reader. But you may find the script useful as the API is (partialy) reused by many *copycats* ;-)
*You may visit [the script homepage](http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber) if you want more information*
displays a small icon in the upper left corner of the page. Then, by querying Google Reader's API, it tells you whether you already suscribed :
* rss orange orange > to none of the feeds
* rss vert green > to some of the feeds
* rss bleu blue > to all feeds

### TFH - Twitter Follow Helper (v 0.6 - 20120530)
This script adds some informations on twitter profile pages (better if you're logged in).
Find more detailed informations on it's *[home page](bit.ly/scolProdTFH)*
* is the tweepl following you?
* is s/he in your current network? (Social Graph Score via twtrfrnd)
* is s/he conversationale (@replies rate)? (via FollowCost)
* is s/he a big poster? (via FollowCost)
* is s/he mentioned in tweets? (via Twitter API)
* is the tweepl influent and how? (Klout score and type)
* who does the tweepl like? (via autoFF)

It does also exist in Chrome extension flavour