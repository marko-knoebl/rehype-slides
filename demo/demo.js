const unified = require("unified");
const markdown = require("remark-parse");
const remarkRehype = require("remark-rehype");
const html = require("rehype-stringify");
const rehypeInline = require("@karuga/rehype-inline");
const highlight = require("rehype-highlight");
const fs = require("fs");

const { slides } = require("../slides.js");

const demoInHrSep = fs.readFileSync("demo/demo_in_hr_sep.md");
const demoInSections = fs.readFileSync("demo/demo_in_sections.md");
const demoInPythonBeginner = fs.readFileSync("demo/demo_in_python_beginner.md");

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(slides, { format: "revealjs" })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoInHrSep)
  .then(content => {
    fs.writeFileSync("demo/demo_out_hr_sep_reveal.html", content.toString());
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
  .process(demoInSections)
  .then(content => {
    fs.writeFileSync("demo/demo_out_sections_reveal.html", content.toString());
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
  .process(demoInSections)
  .then(content => {
    fs.writeFileSync(
      "demo/demo_out_sections_standard.html",
      content.toString()
    );
  });

unified()
  .use(markdown)
  .use(remarkRehype)
  .use(highlight)
  .use(slides, {
    format: "revealjs_karuga",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(html, { closeSelfClosing: true })
  .process(demoInPythonBeginner)
  .then(content => {
    fs.writeFileSync(
      "demo/demo_out_python_beginner_reveal_karuga.html",
      content.toString()
    );
  });
