// this is the code from the readme
// (only difference: require("./slides.js"))

const fs = require("fs");

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkInclude = require("@karuga/remark-include");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypeHighlight = require("rehype-highlight");
const rehypeInline = require("rehype-inline");
const rehypeStringify = require("rehype-stringify");

const rehypeSlides = require("../slides.js");

const input = `
# slide 1

content of slide 1

# slide 2

content of slide 2
`;

const processor = unified()
  .use(remarkParse) // parse markdown string
  .use(remarkInclude) // process any @include directives
  .use(remarkRehype, { allowDangerousHTML: true }) // convert to HTML
  .use(rehypeRaw) // parse again to get inner HTML elements
  // convert to a reveal.js presentation (slides are delimited by headings)
  .use(rehypeSlides, { preset: "headings_compact" })
  .use(rehypeHighlight) // highlight code blocks
  .use(rehypeInline) // bundle assets (images)
  .use(rehypeStringify);

processor.process(input).then(result => {
  fs.writeFileSync("demo/demo_main.html", result.toString());
});
