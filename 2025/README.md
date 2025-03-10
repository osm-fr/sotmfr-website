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

### Conferences

The [conferences data](./src/js/conferences.json) are injected in the [programme template](./src/html/pages/programme.html).

### PWA App

The website support PWA technology to install website like an app on IOS and Android.
- PWA file properties is in [manifest.json](./src/manifest.json)
