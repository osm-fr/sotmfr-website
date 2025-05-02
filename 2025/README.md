## Code contribution

> Website is generated.

To code on the website, you need Node.js and npm.

Run `npm install` to install dependencies.<br>
Then, run `npm run dev` to start a local server with auto-reload in the browser.
The site can be viewed at [localhost:3000](http://localhost:3000) and browsersync administration interface can be viewed at [localhost:3001](http://localhost:3001).

The pages in `./src` will be generated to `./dist`

-   `./src/html/layout` layout
-   `./src/html/pages` pages content
-   `./src/html/partials` html chunks like header, footer and navigation
-   `./src/fonts` website fonts
-   `./src/img` images and pdf
-   `./src/js` Javascript code used on website
-   `./src/scss` css style used on website

Pages are HTML code + [Nunjucks](https://mozilla.github.io/nunjucks/) blocks.

If you only want to generate the website without local server run `npm run build`.<br>
Generated pages (`./dist`) are not commited.

Do not push dependencies update after the website was installed on the server, task on the server to get sources and build website is not adapted to upgrade dependencies.

### Conferences

The [conferences data](./src/js/conferences.json) are injected in the [programme page](./src/html/pages/programme.html).
To generate programme html page with conference data:
- Add 
```
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 gy-3">
                            <!-- Generated, do not edit this part manually. Instructions in the README. -->
                            {% import "./partials/conference.njk" as macros %}
                            {% for conf in conferencesData %}
                                {{ macros.conferenceCard(conf) }}
                            {% else %}
                                No Conf.
                            {% endfor %}
</div>
```
in [programme page](./src/html/pages/programme.html)
- Then run `npm run build`

### PWA App

The website support PWA technology to install website like an app on IOS and Android.
- PWA file properties is in [manifest.json](./src/manifest.json)
- When website is opened [Javascript code](./src/js/main.js) was executed to register a [service worker](./src/js/service-worker.js) to store a part of the website in browser cache.

### Matomo Tracker

The Matomo tracker has been integrated into the website to count number of site visits. Stats about website are used when we try to find sponsors.
The script is configured to not store cookies in the browser and respect [DoNotTrack browser setting](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/DNT).
- To enable Matomo script, you need to create a new website at https://stats.openstreetmap.fr/ and add `SiteId` in [matomo.js](./src/js/matomo.js)
- To disable Matomo script, remove `<script src="js/matomo.js"></script>` in [layout.html](./src/html/layouts/layout.html)
