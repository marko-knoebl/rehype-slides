const common = {
  sectionClass: "slides-section",
  slideClass: "slide"
};

const standard = {
  ...common,
  slideSeparators: ["hr"],
  sectionSeparators: [],
  templateUrl: `${__dirname}/templates/reveal.html`
};

const standardCompact = {
  ...standard,
  templateUrl: `${__dirname}/templates/reveal_compact.html`
};

const headings = {
  ...common,
  slideSeparators: ["h2"],
  sectionSeparators: ["h1"],
  templateUrl: `${__dirname}/templates/reveal.html`
};

const headingsCompact = {
  ...headings,
  templateUrl: `${__dirname}/templates/reveal_compact.html`
};

module.exports.presets = {
  standard,
  standardCompact,
  headings,
  headingsCompact
};
