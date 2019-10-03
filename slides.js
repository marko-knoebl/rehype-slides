const elementsToSimpleSlides = (rootNode, { slideSeparators }) => {
  if (rootNode.length === 0) {
    return [];
  }
  const slides = [];
  if (!slideSeparators.includes(rootNode.children[0].tagName)) {
    // add initial slide
    slides.push({
      type: "element",
      tagName: "section",
      properties: { class: "slide" },
      children: []
    });
  }
  for (let node of rootNode.children) {
    if (slideSeparators.includes(node.tagName)) {
      slides.push({
        type: "element",
        tagName: "section",
        properties: { class: "slide" },
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
  { slideSeparators, sectionSeparators }
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
  // an array of slides_section elements
  const sectionElements = sections.map(section => ({
    type: "element",
    tagName: "section",
    properties: { class: "slides_section" },
    children: elementsToSimpleSlides(
      { type: "root", children: section },
      { slideSeparators }
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
 * "slide" and optionally "slides_section".
 *
 * @param {Node} rootNode
 * @param {Object} options
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @returns {string} string containting a sequence of HTML sections
 */
const elementsToSlides = (rootNode, { slideSeparators, sectionSeparators }) => {
  if (sectionSeparators.length === 0) {
    return elementsToSimpleSlides(rootNode, { slideSeparators });
  }
  return elementsToSectionedSlides(rootNode, {
    slideSeparators,
    sectionSeparators
  });
};

/**
 * Creates an HTML representation of a presentation
 * Converts HTML elements that came from a Markdown presentation
 * to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides_section".
 * 
 * @param {Object} options
 * @param {String[]} options.slideSeparators e.g. ["hr", "h1", "h2"]
 * @param {String[]} options.sectionSeparators
 * @returns {function(rootNode: Node): Node}
 */
const slides = ({ slideSeparators = ["hr"], sectionSeparators = [] } = {}) => {
  return rootNode =>
    elementsToSlides(rootNode, { slideSeparators, sectionSeparators });
};

module.exports = { slides };
