/**
 * Builds an HTML representation of a presentation
 * Converts HTML elements that originated from a Markdown presentation
 * document to an HTML representation.
 * The HTML representation will include section elements with the classes
 * "slide" and optionally "slides_section"
 *
 * @param {Node} rootNode
 * @param {string[]} slideSeparators e.g. ["hr", "h1", "h2"]
 * @returns {string} string containting a sequence of HTML sections
 */
const elementsToSlides = (rootNode, { slideSeparators }) => {
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

// unifiedjs plugin
const slides = ({ slideSeparators = ["hr"] } = {}) => {
  return rootNode => {
    return elementsToSlides(rootNode, { slideSeparators });
  };
};

module.exports = { slides };
