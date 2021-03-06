# rehype-slides

This is a transformer plugin for unified.js that creates HTML slides / presentations from markdown input.

This plugin is used to create the slides at <https://marko-knoebl.github.io/slides/>

## rehype-slides-starter

To start out with new slides, you can clone: [rehype-slides-starter](https://github.com/marko-knoebl/rehype-slides-starter)

## Demo

```js
const fs = require("fs");

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkInclude = require("@karuga/remark-include");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypeHighlight = require("rehype-highlight");
const rehypeInline = require("rehype-inline");
const rehypeStringify = require("rehype-stringify");

const rehypeSlides = require("@karuga/rehype-slides");

const input = `
# slide 1

content of slide 1

# slide 2

content of slide 2
`;

const processor = unified()
  .use(remarkParse) // parse markdown string
  .use(remarkInclude) // process any @include directives
  .use(remarkRehype, { allowDangerousHtml: true }) // convert to HTML
  .use(rehypeRaw) // parse again to get inner HTML elements
  // convert to a reveal.js presentation (slides are delimited by headings)
  .use(rehypeSlides, { preset: "headings_compact" })
  .use(rehypeHighlight) // highlight code blocks
  .use(rehypeInline) // bundle assets (images)
  .use(rehypeStringify);

const result = processor.processSync(input).toString();
fs.writeFileSync("demo/demo_main.html", result);
```

(see file `demo/demo_main.js`)

## More demos

Run the demos via:

```
node demo/demos.js
```

This will read the markdown files and create new HTML files in the demo folder.

## Formats

At the moment the main format that is supported is [reveal.js](https://github.com/hakimel/reveal.js/) presentations. Other formats may be added in the future.

## Configuration options

default / standard settings:

```js
  .use(rehypeSlides);
```

preset:

```js
  .use(rehypeSlides, { preset: "headings_compact" });
```

individual config (same as preset: "headings_compact"):

```js
  .use(rehypeSlides, {
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"],
    templateUrl: "node_modules/@karuga/rehype-slides/templates/reveal_compact.html"
  });
```

- `slideSeparators`: array of HTML elements that separate slides; e.g.: `["h2", "hr"]`, default: `["hr"]`
- `sectionSeparators`: array of HTML elements that separate sections; e.g.: `["h1"]`, default: `[]`
- `templateUrl`: url of template to use, default: `node_modules/@karuga/rehype-slides/templates/reveal.html`
- `contentOnly`: whether to form a complete HTML document
- `preset`: sets multiple options at once (can be one of `standard`, `standard_compact`, `headings`, `headings_compact`)
