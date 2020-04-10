const fs = require("fs");

const unified = require("unified");
const parse = require("rehype-parse");
const select = require("hast-util-select").select;

const presets = require("./presets.js").presets;

const htmlParser = unified().use(parse);

const elementsToSimpleSlides = (rootNode, { slideSeparators, slideClass }) => {
  if (rootNode.length === 0) {
    return [];
  }
  const slides = [];
  if (!slideSeparators.includes(rootNode.children[0].tagName)) {
    // add initial slide
    slides.push({
      type: "element",
      tagName: "section",
      properties: { class: slideClass },
      children: []
    });
  }
  for (let node of rootNode.children) {
    if (slideSeparators.includes(node.tagName)) {
      slides.push({
        type: "element",
        tagName: "section",
        properties: { class: slideClass },
        children: []
      });
      // if the separating node has some content (e.g. h1)
      // put the separating node in the next slide
      if (node.children.length !== 0) {
        slides[slides.length - 1].children.push(node);
      }
    } else {
      slides[slides.length - 1].children.push(node);
    }
  }
  return { type: "root", children: slides };
};

const elementsToSectionedSlides = (
  rootNode,
  { slideSeparators, sectionSeparators, slideClass, sectionClass }
) => {
  // build an array of arrays of slides
  const sections = [];
  if (!sectionSeparators.includes(rootNode.children[0].tagName)) {
    // add initial section
    sections.push([]);
  }
  rootNode.children.forEach((node, index) => {
    if (sectionSeparators.includes(node.tagName)) {
      sections.push([]);
      // if the separating node has some content (e.g. h1)
      // put the separating node in the next section
      if (node.children.length !== 0) {
        sections[sections.length - 1].push(node);
      }
    } else {
      sections[sections.length - 1].push(node);
    }
  });

  // turn the array of arrays of slide elements into
  // an array of slides-section elements
  const sectionElements = sections.map(section => ({
    type: "element",
    tagName: "section",
    properties: { class: sectionClass },
    children: elementsToSimpleSlides(
      { type: "root", children: section },
      { slideSeparators, slideClass }
    ).children
  }));

  return {
    type: "root",
    children: sectionElements
  };
};

const defaultOptions = {
  slideSeparators: ["hr"],
  sectionSeparators: [],
  slideClass: "slide",
  sectionClass: "slides-section",
  contentOnly: false,
  templateUrl: `${__dirname}/templates/reveal.html`
};

/**
 * Creates an HTML representation of a presentation
 * Converts HTML elements that came from a Markdown presentation
 * to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides-section".
 *
 * @param {Node} rootNode
 * @param {Object} options
 * @param {String} options.preset
 *     one of "standard", "standard_compact", "headings", "headings_compact"
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @param {String} options.slideClass CSS class to apply to slides
 * @param {String} options.sectionClass CSS class to apply to sections
 * @param {String} options.templateUrl url of template to use
 * @param {Boolean} options.contentOnly
 *     when set to true, will not include surrounding HTML
 * @returns {string} string containting a sequence of HTML sections
 */
const hastSlides = (rootNode, options = { preset: "standard" }) => {
  // create a flat copy of the options object
  options = { ...options };
  if (options.preset !== undefined) {
    options = presets[options.preset];
  }
  for (let option in defaultOptions) {
    if (options[option] === undefined) {
      options[option] = defaultOptions[option];
    }
  }
  let slides;
  if (options.sectionSeparators.length === 0) {
    slides = elementsToSimpleSlides(rootNode, {
      slideSeparators: options.slideSeparators,
      slideClass: options.slideClass
    });
  } else {
    slides = elementsToSectionedSlides(rootNode, {
      slideSeparators: options.slideSeparators,
      sectionSeparators: options.sectionSeparators,
      slideClass: options.slideClass,
      sectionClass: options.sectionClass
    });
  }
  if (!options.contentOnly) {
    // include in surrounding HTML template
    const template = fs.readFileSync(options.templateUrl, {
      encoding: "utf-8"
    });
    const parsedTemplate = htmlParser.parse(template);
    const placeholderElement = select("#slides-placeholder", parsedTemplate);
    placeholderElement.properties.id = null;
    if (!placeholderElement.properties.className) {
      placeholderElement.properties.className = "slides";
    } else {
      placeholderElement.properties.className += " slides";
    }
    placeholderElement.children = slides.children;
    slides = parsedTemplate;
  }
  return slides;
};

/**
 * Rehype plugin that creates an HTML representation of a presentation
 * Converts HTML elements that came from a Markdown presentation
 * to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides-section".
 *
 * @param {Object} options
 * @param {String} options.preset
 *     one of "standard", "standard_compact", "headings", "headings_compact"
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @param {String} options.slideClass CSS class to apply to slides
 * @param {String} options.sectionClass CSS class to apply to sections
 * @param {String} options.templateUrl url of template to use
 * @param {Boolean} options.contentOnly
 *     when set to true, will not include surrounding HTML
 * @returns {function(rootNode: Node): Node}
 */
const rehypeSlides = options => {
  return rootNode => hastSlides(rootNode, options);
};

module.exports = rehypeSlides;
module.exports.hastSlides = hastSlides;
