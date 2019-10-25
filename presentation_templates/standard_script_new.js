class Presentation {
  constructor() {
    this.slideCount = null;
    this.activeSlide = null;
    this.canvasContentElement = document.querySelector("#canvas-content");
    this.arrowUp = document.querySelector(".arrow.up");
    this.arrowDown = document.querySelector(".arrow.down");
    this.arrowRight = document.querySelector(".arrow.right");
    this.arrowLeft = document.querySelector(".arrow.left");
    this.countSlides();
    this.addKeyControls();
    this.addSwipeControls();
    this.hideNoScriptMessage();
    this.activateSlideSafe(1, 1);
  }

  countSlides() {
    this.slideCount = [
      ...document.querySelector("#slides-placeholder").children
    ].map(section => section.childNodes.length);
  }

  addKeyControls() {
    document.querySelector("body").addEventListener("keydown", event => {
      if (event.key === "p") {
        const canvasContent = this.canvasContentElement.innerHTML;
        presenterWindow = window.open(document.URL, "_blank");
        presenterWindow.onload = () => {
          presenterWindow.document.querySelector(
            "body"
          ).innerHTML = canvasContent;
        };
      }
      if (event.key === "ArrowRight") {
        this.activateSlideRightSafe();
      } else if (event.key === "ArrowLeft") {
        this.activateSlideLeftSafe();
      } else if (event.key === "ArrowDown") {
        this.activateSlideDownSafe();
      } else if (event.key === "ArrowUp") {
        this.activateSlideUpSafe();
      } else if (event.key === "Enter") {
        this.activateSlideNextSafe();
      }
    });
  }

  addSwipeControls() {
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
            this.activateSlideLeftSafe();
            handled = true;
          } else if (xDiff < -distance) {
            this.activateSlideRightSafe();
            handled = true;
          } else if (yDiff > distance) {
            this.activateSlideUpSafe();
            handled = true;
          } else if (yDiff < -distance) {
            this.activateSlideDownSafe();
            handled = true;
          }
        }
      }
    });
  }

  hideNoScriptMessage() {
    document.querySelector("#no-script").innerHTML = "";
  }

  /**
   * Activate a slide if it exists, else do nothing
   */
  activateSlideSafe(sectionIndex, slideIndex) {
    if (
      1 <= sectionIndex &&
      sectionIndex <= this.slideCount.length &&
      1 <= slideIndex &&
      slideIndex <= this.slideCount[sectionIndex - 1]
    ) {
      this.activeSlide = [sectionIndex, slideIndex];
      this.updateVisible();
      this.updatePageArrows();
      this.scrolltoActiveSlide();
    }
  }

  activateSlideNextSafe() {
    if (this.activeSlide[1] === this.slideCount[this.activeSlide[0] - 1]) {
      this.activateSlideSafe(this.activeSlide[0] + 1, 1);
    } else {
      this.activateSlideSafe(this.activeSlide[0], this.activeSlide[1] + 1);
    }
  }

  activateSlideRightSafe() {
    this.activateSlideSafe(this.activeSlide[0] + 1, 1);
  }

  activateSlideLeftSafe() {
    this.activateSlideSafe(this.activeSlide[0] + 1, 1);
  }

  activateSlideDownSafe() {
    this.activateSlideSafe(this.activeSlide[0], this.activeSlide[1] + 1);
  }

  activateSlideUpSafe() {
    this.activateSlideSafe(this.activeSlide[0], this.activeSlide[1] - 1);
  }

  updateVisible() {
    const slidesSections = document.querySelectorAll(".slides-section");

    slidesSections.forEach((section, key) => {
      if (key + 1 === this.activeSlide[0]) {
        section.classList.add("active");
        section.classList.remove("inactive");
        section.childNodes.forEach((slide, slideKey) => {
          if (slideKey + 1 === this.activeSlide[1]) {
            slide.classList.add("active");
            slide.classList.remove("inactive");
          } else {
            slide.classList.remove("active");
            slide.classList.add("inactive");
          }
        });
      } else {
        section.classList.remove("active");
        section.classList.add("inactive");
      }
    });
  }

  updatePageArrows() {
    if (this.slideCount.length === 1) {
      this.arrowLeft.style.opacity = "0";
      this.arrowRight.style.opacity = "0";
    } else {
      const progressSections =
        (this.activeSlide[0] - 1) / (this.slideCount.length - 1);
      this.arrowLeft.style.opacity = progressSections.toString();
      this.arrowRight.style.opacity = (1 - progressSections).toString();
    }
    const slidesInActiveSection = this.slideCount[this.activeSlide[0] - 1];
    if (slidesInActiveSection === 1) {
      this.arrowUp.style.opacity = "0";
      this.arrowDown.style.opacity = "0";
    } else {
      const progressSlides =
        (this.activeSlide[1] - 1) / (slidesInActiveSection - 1);
      this.arrowUp.style.opacity = progressSlides.toString();
      this.arrowDown.style.opacity = (1 - progressSlides).toString();
    }
  }

  scrolltoActiveSlide() {
    const slideId = `#slide-${this.activeSlide[0]}-${this.activeSlide[1]}`;
    if (this.presenterWindow) {
      const activeSlide = this.presenterWindow.document.querySelector(slideId);
      if (activeSlide) {
        activeSlide.scrollIntoView();
      }
    }
  }
}

const presentation = new Presentation();
