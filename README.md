vk-graph-export
===============

An application for vk.com (vkontakte) social network to export friends network to .gexf file (that can be visualized in [Gephi](https://gephi.org/), for example).

App is installed here: https://vk.com/app3861133

Installing and running
----------------------

Application is entirely client-side and consists of static html and javascript. You only need server that serves static files to run it.

To run locally, in test mode, open `index.html` in browser (either using webserver or directly from filesystem with `file://` URL). Fake vk.com API will be used, useful for development.

To run with real vk.com api, install it on some webserver configured to serve both http and https (only serving of static files is required). Create [new app](https://vk.com/editapp?act=create) on vk.com, choose Iframe app and set http/https iframe address to URL of `index.html` served by your server.

To run tests, open `test.html` in browser (you can open it directly from filesystem).

