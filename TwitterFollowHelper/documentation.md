# About TFH indicators
For now, each indicators may take 5 values from -2 (bad point - red) to +2 (good point - green).

## Notations
* y = you, u = user
* Fg(x) = people following "x"
* Fw(x) = people "x" follows
* Nt(x,t) = number of tweets of "x" during time "t"

## Following you?
* if the tweepl is following you're more about to have interaction with him, so it's a good point. __+2__
    * in the future it might be a good idea to moderate this if the tweepl is following a lot ("serial follower")
* if the tweepl is not following you, may be he just doesn't know how nice you are, so it's a not so bad point. __-1__
    * in the future this will be nuanced if the tweepl is a "star" (to define)

## Social graph convergence?
In the past, there were online services helping to count precisely how much followers / following you had in common with tweepl. There's no more. So last info remaining is how much people you follow that are following tweepl (fwfg(y,u) = Fw(y) ∩ Fg(u)).
So we calculate :
* Ty : fwfg(y,u) / People you follow
* Tu : fwfg(y,u) / People following User
And indicator will be
Ty*Tu = fwfg(y,u)² / (Fw(y) * Fg(u))

Have to browse some profiles to determine score now.

## The tweepl is a star
Probably if Fw(u) / Fg(u) is low, tweepl is a "star". Also have to check if Fg(u) is high.

## The tweepl is a human being
Probably if Fw(u) is too high, s/he is not able to read all tweets and you may expect low engagement

## The tweepl tweets a lot
unfortunately milliscoble seems to have disapeared. So will have to get this info by dividing Nt(u,all time) / all time and Nt(u,current page)/ current page

# Ideas for next
## The tweepl favorites a lot
## The tweepl retweets a lot
## ...
