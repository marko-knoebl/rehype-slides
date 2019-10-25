const fs = require("fs");

const unified = require("unified");
const parse = require("rehype-parse");
const select = require("hast-util-select").select;

const htmlParser = unified().use(parse);

const formats = {
  standard: {
    templateUrl: "presentation_templates/standard_template.html",
    sectionClass: "slides-section",
    slideClass: "slide",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  },
  revealjs: {
    templateUrl: "presentation_templates/reveal_simple_template.html",
    sectionClass: "",
    slideClass: "",
    sectionSeparators: ["h1"],
    slideSeparators: ["h2"]
  },
  deck: {
    templateUrl: "presentation_templates/deck_template.html",
    slideClass: "slide"
  }
};

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

/**
 * Creates an HTML representation of a presentation
 * Converts HTML elements that came from a Markdown presentation
 * to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides-section".
 *
 * @param {Node} rootNode
 * @param {Object} options
 * @param {String} options.format e.g. "revealjs"
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @param {String} options.slideClass CSS class to apply to slides
 * @param {String} options.sectionClass CSS class to apply to sections
 * @param {Boolean} options.contentOnly
 * @returns {string} string containting a sequence of HTML sections
 */
const elementsToSlides = (
  rootNode,
  {
    format,
    slideSeparators,
    sectionSeparators,
    slideClass,
    sectionClass,
    contentOnly
  }
) => {
  let slides;
  if (sectionSeparators.length === 0) {
    slides = elementsToSimpleSlides(rootNode, {
      format,
      slideSeparators,
      slideClass
    });
  } else {
    slides = elementsToSectionedSlides(rootNode, {
      format,
      slideSeparators,
      sectionSeparators,
      slideClass,
      sectionClass
    });
  }
  if (!contentOnly) {
    // include in surrounding HTML template
    const template = fs.readFileSync(formats[format].templateUrl, {
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
 * Creates an HTML representation of a presentation
 * Converts HTML elements that came from a Markdown presentation
 * to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides-section".
 *
 * @param {Object} options
 * @param {String[]} options.format e.g. "revealjs"
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @param {String} options.slideClass CSS class to apply to slides
 * @param {String} options.sectionClass CSS class to apply to sections
 * @param {Boolean} options.contentOnly
 * @returns {function(rootNode: Node): Node}
 */
const slides = ({
  format,
  slideSeparators = ["hr"],
  sectionSeparators = [],
  slideClass = "slide",
  sectionClass = "slides-section",
  contentOnly = false
} = {}) => {
  return rootNode =>
    elementsToSlides(rootNode, {
      format,
      slideSeparators,
      sectionSeparators,
      slideClass,
      sectionClass,
      contentOnly
    });
};

module.exports = { slides };
