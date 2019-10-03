const unified = require("unified");
const markdown = require("remark-parse");
const remarkRehype = require("remark-rehype");
const html = require("rehype-stringify");
const minifyWhitespace = require("rehype-minify-whitespace");

const { slides } = require("./slides.js");

const fixtures = [
  {
    name: "simple paragraph",
    in: "lorem ipsum",
    out_default: '<section class="slide"><p>lorem ipsum</p></section>',
    out_h1_sectionsep:
      '<section class="slides_section">' +
      '<section class="slide"><p>lorem ipsum</p></section></section>'
  },
  {
    name: "h1 and paragraph",
    in: "# title\n\nparagraph",
    out_default:
      '<section class="slide"><h1>title</h1><p>paragraph</p></section>',
    out_h1_slidesep:
      '<section class="slide"><h1>title</h1><p>paragraph</p></section>',
    out_h1_sectionsep:
      '<section class="slides_section"><section class="slide">' +
      "<h1>title</h1><p>paragraph</p></section></section>"
  },
  {
    name: "hr separated paragraphs",
    in: "p1\n\n---\n\np2",
    out_default:
      '<section class="slide"><p>p1</p></section>' +
      '<section class="slide"><p>p2</p></section>',
    out_h1_slidesep: '<section class="slide"><p>p1</p><hr><p>p2</p></section>'
  },
  {
    name: "hr at beginning",
    in: "---\n\ntest",
    out_default: '<section class="slide"><p>test</p></section>'
  },
  {
    name: "two headings",
    in: "# a\n\n# b",
    out_default: '<section class="slide"><h1>a</h1><h1>b</h1></section>',
    out_h1_slidesep:
      '<section class="slide"><h1>a</h1></section>' +
      '<section class="slide"><h1>b</h1></section>',
    out_h1_sectionsep:
      '<section class="slides_section">' +
      '<section class="slide"><h1>a</h1></section>' +
      "</section>" +
      '<section class="slides_section">' +
      '<section class="slide"><h1>b</h1></section>' +
      "</section>"
  },
  {
    name: "h1 and h2",
    in: "# a\n\n## a1\n\n# b",
    out_default:
      '<section class="slide"><h1>a</h1><h2>a1</h2><h1>b</h1></section>',
    out_h1_slidesep:
      '<section class="slide"><h1>a</h1><h2>a1</h2></section>' +
      '<section class="slide"><h1>b</h1></section>',
    out_h1_sectionsep:
      '<section class="slides_section">' +
      '<section class="slide"><h1>a</h1></section>' +
      '<section class="slide"><h2>a1</h2></section>' +
      "</section>" +
      '<section class="slides_section">' +
      '<section class="slide"><h1>b</h1></section>' +
      "</section>"
  }
];

const pipeline = unified()
  .use(markdown)
  .use(remarkRehype)
  .use(html)
  .use(slides)
  .use(minifyWhitespace);

const pipelineH1Slidesep = unified()
  .use(markdown)
  .use(remarkRehype)
  .use(html)
  .use(slides, { slideSeparators: ["h1"] })
  .use(minifyWhitespace);

const pipelineH1Sectionsep = unified()
  .use(markdown)
  .use(remarkRehype)
  .use(html)
  .use(slides, { sectionSeparators: ["h1"], slideSeparators: ["h2"] })
  .use(minifyWhitespace);

for (let fixture of fixtures) {
  describe("turns markdown into HTML", () => {
    describe(fixture.name, () => {
      if (fixture.out_default) {
        it("default", done => {
          pipeline
            .process(fixture.in)
            .then(result => {
              expect(result.toString()).toEqual(fixture.out_default);
              done();
            })
            .catch(console.log);
        });
      }
      if (fixture.out_h1_slidesep) {
        it("h1 slide separator", done => {
          pipelineH1Slidesep.process(fixture.in).then(result => {
            expect(result.toString()).toEqual(fixture.out_h1_slidesep);
            done();
          });
        });
      }
      if (fixture.out_h1_sectionsep) {
        it("h1 section sep, h2 slide sep", done => {
          pipelineH1Sectionsep.process(fixture.in).then(result => {
            expect(result.toString()).toEqual(fixture.out_h1_sectionsep);
            done();
          });
        });
      }
    });
  });
}
