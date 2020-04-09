# Slides

This is a transformer plugin for unified.js that creates HTML slides / presentations from markdown input.

## Demo

```js
const fs = require("fs");

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypeHighlight = require("rehype-highlight");
const rehypeInline = require("rehype-inline");
const rehypeStringify = require("rehype-stringify");

const slides = require("@karuga/slides");

const input = `
# slide 1

content of slide 1

# slide 2

content of slide 2
`;

const pipeline = unified()
  .use(remarkParse) // parse markdown string
  .use(remarkRehype, { allowDangerousHTML: true }) // convert to HTML
  .use(rehypeRaw) // parse again to get inner HTML elements
  .use(slides, "headings-compact") // convert to a reveal.js presentation (slides are delimited by headings)
  .use(rehypeHighlight) // highlight code blocks
  .use(rehypeInline) // bundle into one file
  .use(rehypeStringify);

const htmlString = pipeline.processSync(input).toString();
fs.writeFileSync("slides.html", htmlString);
```

(see file `demo/demo_main.js`)

## More demos

Run the demos via:

```
node demo/demos.js
```

This will read the markdown files and create new HTML files in the demo folder.

## Formats

At the moment the main format that is supported is reveal.js presentations. Other formats may be added in the future.

## Configuration options

examples:

```js
// default settings
unified().use(slides);

// presets
unified().use(slides, { presets: "standard" });
unified().use(slides, { presets: "standard-compact" });
unified().use(slides, { presets: "headings" });
unified().use(slides, { presets: "headings-compact" });

// individual config
unified().use(slides, {
  sectionSeparators: ["h1"],
  slideSeparators: ["h2"],
  templateUrl: "./mytemplate.html"
});
```

- `slideSeparators`: array of HTML elements that separate slides; e.g.: `["h2", "hr"]`, default: `[]`
- `sectionSeparators`: array of HTML elements that separate sections; e.g.: `["h1"]`, default: `[]`
- `templateUrl`: url of template to use
- `contentOnly`: whether to form a complete HTML document
- `presets`: sets multiple options at once
