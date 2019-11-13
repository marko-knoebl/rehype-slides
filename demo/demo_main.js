// this is the code from the readme
// (only difference: require("./slides.js"))

const fs = require("fs");

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypeHighlight = require("rehype-highlight");
const rehypeInline = require("rehype-inline");
const rehypeStringify = require("rehype-stringify");

const slides = require("../slides.js");

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
  .use(slides, {
    format: "revealjs",
    slideSeparators: ["h1"]
  }) // convert to a reveal.js presentation
  .use(rehypeHighlight) // highlight code blocks
  .use(rehypeInline) // bundle into one file
  .use(rehypeStringify);

const htmlString = pipeline.processSync(input).toString();
fs.writeFileSync("demo/demo_main.html", htmlString);
