##mapmepls
(sorry, couldn't make up any better title)

A simple just-for-fun project that puts random tweets on a map.

Built with [rails 4](), [websocket-rails](https://github.com/websocket-rails/websocket-rails), [twitter gem](https://github.com/sferik/twitter) and [daemons-rails](https://github.com/mirasrael/daemons-rails). 

It takes a stream of sample tweets from twitter api and sends it to browser via websockets where they're layed down on a fancy google map.

This task used to be a test assignment  which I have invented for web-developers at [Rocket firm](http://rocketfirm.com), so I decided to complete it myself as well. But I wanted to experiment with something new, so I put aside good old **php** and did it with **rails**.

##Requirements
* **Ruby** (tested on 2.0, not sure which version is minimal)
* **Redis server** - required by **websocket-rails** to synchronize it's state among regular request cycle and streaming daemon.

##Installation
* **bundle install**
* Rename **config/secrets_sample.yml** to **config/secrets.yml** and fill it with required api keys, which is probably obvious where to get from.
* **rake daemon:tweetstream:start** to fetch tweets in background
* **rails server**
* **Pray** while opening your browser and hopefully enjoying the results

Haven't deployed it anywhere yet, since it's just **proof-of-concept** and there's lot of work to do.