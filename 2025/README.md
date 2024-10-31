## Code contribution

> Website is generated.

To code on the website, you need Node.js and npm.

Run `npm install` to install dependencies.<br>
Then, run `npm run dev` to start a local server with auto-reload in the browser.

The pages in `./src` will be generated to `./dist`

-   `./src/html/layout` layout
-   `./src/html/pages` pages content
-   `./src/html/partials` html chunks like header, footer and navigation

Pages are HTML code + [Nunjucks](https://mozilla.github.io/nunjucks/) blocks.

If you only want to generate the website without local server run `npm run build`.<br>
Generated pages (`./dist`) are not commited.

### Conferences

The [conferences data](./src/js/conferences.json) are injected in the [programme template](./src/html/pages/programme.html).
