const fs = require("fs");

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypeHighlight = require("rehype-highlight");
const rehypeInline = require("@karuga/rehype-inline");
const rehypeStringify = require("rehype-stringify");

const slides = require("../slides.js");

const demoInHrSep = fs.readFileSync("demo/demo_in_hr_sep.md");
const demoInSections = fs.readFileSync("demo/demo_in_sections.md");
const demoInPythonBeginner = fs.readFileSync("demo/demo_in_python_beginner.md");

unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHTML: true })
  .use(rehypeRaw)
  .use(slides, { format: "revealjs" })
  .use(rehypeInline)
  .use(rehypeStringify, { closeSelfClosing: true })
  .process(demoInHrSep)
  .then(content => {
    fs.writeFileSync("demo/demo_out_hr_sep_reveal.html", content.toString());
  });

unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHTML: true })
  .use(rehypeRaw)
  .use(slides, {
    format: "revealjs",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(rehypeStringify, { closeSelfClosing: true })
  .process(demoInSections)
  .then(content => {
    fs.writeFileSync("demo/demo_out_sections_reveal.html", content.toString());
  });

unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHTML: true })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(slides, {
    format: "revealjs_karuga",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  })
  .use(rehypeInline)
  .use(rehypeStringify, { closeSelfClosing: true })
  .process(demoInPythonBeginner)
  .then(content => {
    fs.writeFileSync(
      "demo/demo_out_python_beginner_reveal_karuga.html",
      content.toString()
    );
  });
