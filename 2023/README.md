## Code contribution

➡ Website is generated.

To code on the website, you need Node.js and npm.\
Run `npm install` to install dependencies.

Then, run `npm run dev` to start a local server with auto-reload in the browser.

The pages in `./src` will be generated to `./dist` 

- `./src/html/layout` layout
- `./src/html/pages` pages content
- `./src/html/partials` html chunks like header, footer and navigation


The [conferences data](./src/js/conferences.json) are injected in the [programme template](./src/html/pages/programme.html).

If you only want to generate the website without local server run `npm run build`.

Generated page (`./dist`) are not commited.
