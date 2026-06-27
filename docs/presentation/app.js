const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
const printButton = document.getElementById("printDeck");
const fullscreenButton = document.getElementById("fullscreenDeck");
const counter = document.getElementById("slideCounter");

let currentIndex = 0;
const presentationBase = { width: 1280, height: 720 };

function isPresentationMode() {
  return document.body.classList.contains("is-fullscreen");
}

function updatePresentationScale() {
  const scale = Math.min(window.innerWidth / presentationBase.width, window.innerHeight / presentationBase.height);
  document.documentElement.style.setProperty("--presentation-scale", scale.toFixed(4));
}

function updateCounter(index) {
  counter.textContent = `${index + 1} / ${slides.length}`;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
}

function scrollToSlide(index) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentIndex = nextIndex;
  updateCounter(nextIndex);

  if (!isPresentationMode()) {
    slides[nextIndex].scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function getCurrentSlideIndex() {
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const slideCenter = window.scrollY + rect.top + rect.height / 2;
    const distance = Math.abs(slideCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

slides.forEach((slide, index) => {
  slide.dataset.page = `${index + 1} / ${slides.length}`;
});

prevButton.addEventListener("click", () => scrollToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => scrollToSlide(currentIndex + 1));
printButton.addEventListener("click", () => window.print());

function setPresentationMode(isActive) {
  document.body.classList.toggle("is-fullscreen", isActive);
  fullscreenButton.textContent = isActive ? "전체화면 종료" : "전체화면";
  if (isActive) {
    updatePresentationScale();
  } else {
    document.documentElement.style.removeProperty("--presentation-scale");
  }
  updateCounter(currentIndex);
}

fullscreenButton.addEventListener("click", async () => {
  if (isPresentationMode()) {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    setPresentationMode(false);
    return;
  }

  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Some embedded browsers block native fullscreen. Keep a presentation-mode fallback.
  }

  setPresentationMode(true);
});

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    setPresentationMode(true);
    return;
  }

  if (isPresentationMode()) {
    setPresentationMode(false);
    slides[currentIndex].scrollIntoView({ behavior: "auto", block: "center" });
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isPresentationMode()) {
    event.preventDefault();

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      setPresentationMode(false);
      slides[currentIndex].scrollIntoView({ behavior: "auto", block: "center" });
    }

    return;
  }

  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    scrollToSlide(currentIndex + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    scrollToSlide(currentIndex - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    scrollToSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    scrollToSlide(slides.length - 1);
  }
});

window.addEventListener("resize", () => {
  if (isPresentationMode()) {
    updatePresentationScale();
  }
});

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    if (!isPresentationMode()) {
      currentIndex = getCurrentSlideIndex();
      updateCounter(currentIndex);
    }

    ticking = false;
  });

  ticking = true;
});

updateCounter(0);
