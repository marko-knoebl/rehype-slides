const unified = require("unified");
const markdown = require("remark-parse");
const remarkRehype = require("remark-rehype");
const html = require("rehype-stringify");
const rehypeInline = require("@karuga/rehype-inline");
const highlight = require('rehype-highlight')
const fs = require("fs");

const { slides } = require("../slides.js");

const demoIn1 = fs.readFileSync("demo/demo_in_1.md");
const demoIn2 = fs.readFileSync("demo/demo_in_2.md");
const demoIn4 = fs.readFileSync("demo/demo_in_4.md");

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(slides, { format: "revealjs" })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoIn1)
  .then(content => {
    fs.writeFileSync("demo/demo_out_1.html", content.toString());
  });

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(slides, {
    format: "revealjs",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoIn2)
  .then(content => {
    fs.writeFileSync("demo/demo_out_2.html", content.toString());
  });

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(slides, {
    format: "standard",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoIn2)
  .then(content => {
    fs.writeFileSync("demo/demo_out_3.html", content.toString());
  });

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(highlight)
  .use(slides, {
    format: "revealjs",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoIn4)
  .then(content => {
    fs.writeFileSync("demo/demo_out_4.html", content.toString());
  });
