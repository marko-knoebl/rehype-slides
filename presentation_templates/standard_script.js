let presenterWindow;
let activeSlide;
let slideCount;

const arrowUp = document.querySelector(".arrow.up");
const arrowDown = document.querySelector(".arrow.down");
const arrowRight = document.querySelector(".arrow.right");
const arrowLeft = document.querySelector(".arrow.left");
arrowUp.addEventListener("click", () => {
  activateSlideSafe(activeSlide[0], activeSlide[1] - 1);
});
arrowDown.addEventListener("click", () => {
  activateSlideSafe(activeSlide[0], activeSlide[1] + 1);
});
arrowLeft.addEventListener("click", () => {
  activateSlideSafe(activeSlide[0] - 1, 1);
});
arrowRight.addEventListener("click", () => {
  activateSlideSafe(activeSlide[0] + 1, 1);
});
const init = () => {
  slideCount = countSlides();
  activateSlideSafe(1, 1);
  addKeyControls();
  addSwipeControls();
  hideNoScriptMessage();
};

// count slides
const countSlides = () => {
  const counts = [];
  return [...document.querySelectorAll(".section")].map(
    section => section.childNodes.length
  );
};

const updateVisible = () => {
  for (let section of document.querySelectorAll(".section")) {
    if (section.id === `section-${activeSlide[0]}`) {
      section.className = "section active";
    } else {
      section.className = "section inactive";
    }
  }
  for (let slide of document.querySelectorAll(".slide")) {
    if (slide.id === `slide-${activeSlide[0]}-${activeSlide[1]}`) {
      slide.className = "slide active";
    } else {
      slide.className = "slide inactive";
    }
  }
};

const updatePageArrows = () => {
  if (slideCount.length === 1) {
    arrowLeft.style.opacity = "0";
    arrowRight.style.opacity = "0";
  } else {
    const progressSections = (activeSlide[0] - 1) / (slideCount.length - 1);
    arrowLeft.style.opacity = progressSections.toString();
    arrowRight.style.opacity = (1 - progressSections).toString();
  }
  const slidesInActiveSection = slideCount[activeSlide[0] - 1];
  if (slidesInActiveSection === 1) {
    arrowUp.style.opacity = "0";
    arrowDown.style.opacity = "0";
  } else {
    const progressSlides = (activeSlide[1] - 1) / (slidesInActiveSection - 1);
    arrowUp.style.opacity = progressSlides.toString();
    arrowDown.style.opacity = (1 - progressSlides).toString();
  }
};

/**
 * Activate a slide if it exists, else do nothing
 */
const activateSlideSafe = (sectionIndex, slideIndex) => {
  if (
    1 <= sectionIndex &&
    sectionIndex <= slideCount.length &&
    1 <= slideIndex &&
    slideIndex <= slideCount[sectionIndex - 1]
  ) {
    activeSlide = [sectionIndex, slideIndex];
    updateVisible();
    updatePageArrows();
    scrolltoActiveSlide();
  }
};

const activateSlideNextSafe = () => {
  if (activeSlide[1] === slideCount[activeSlide[0] - 1]) {
    activateSlideSafe(activeSlide[0] + 1, 1);
  } else {
    activateSlideSafe(activeSlide[0], activeSlide[1] + 1);
  }
};

const activateSlideRightSafe = () => {
  activateSlideSafe(activeSlide[0] + 1, 1);
};

const activateSlideLeftSafe = () => {
  activateSlideSafe(activeSlide[0] - 1, 1);
};

const activateSlideDownSafe = () => {
  activateSlideSafe(activeSlide[0], activeSlide[1] + 1);
};

const activateSlideUpSafe = () => {
  activateSlideSafe(activeSlide[0], activeSlide[1] - 1);
};

const scrolltoActiveSlide = () => {
  const slideId = `#slide-${activeSlide[0]}-${activeSlide[1]}`;
  if (presenterWindow) {
    const activeSlide = presenterWindow.document.querySelector(slideId);
    if (activeSlide) {
      activeSlide.scrollIntoView();
    }
  }
};

const addKeyControls = () => {
  document.querySelector("body").addEventListener("keydown", event => {
    if (event.key === "p") {
      const canvasContent = document.querySelector("#canvas-content").innerHTML;
      presenterWindow = window.open(document.URL, "_blank");
      presenterWindow.onload = () => {
        presenterWindow.document.querySelector(
          "body"
        ).innerHTML = canvasContent;
      };
    }
    if (event.key === "ArrowRight") {
      activateSlideRightSafe();
    } else if (event.key === "ArrowLeft") {
      activateSlideLeftSafe();
    } else if (event.key === "ArrowDown") {
      activateSlideDownSafe();
    } else if (event.key === "ArrowUp") {
      activateSlideUpSafe();
    } else if (event.key === "Enter") {
      activateSlideNextSafe();
    }
  });
};

const addSwipeControls = () => {
  const distance = 100;

  let startPos;
  let handled;

  document.addEventListener("touchstart", event => {
    startPos = event.touches[0];
    handled = false;
  });

  document.addEventListener("touchmove", event => {
    if (!handled) {
      let currentPos = event.touches[0];
      const xDiff = currentPos.clientX - startPos.clientX;
      const yDiff = currentPos.clientY - startPos.clientY;
      if (
        Math.abs(xDiff) > 2 * Math.abs(yDiff) ||
        Math.abs(yDiff) > 2 * Math.abs(xDiff)
      ) {
        if (xDiff > distance) {
          activateSlideLeftSafe();
          handled = true;
        } else if (xDiff < -distance) {
          activateSlideRightSafe();
          handled = true;
        } else if (yDiff > distance) {
          activateSlideUpSafe();
          handled = true;
        } else if (yDiff < -distance) {
          activateSlideDownSafe();
          handled = true;
        }
      }
    }
  });
};

const hideNoScriptMessage = () => {
  document.querySelector("#no-script").innerHTML = "";
};

init();
