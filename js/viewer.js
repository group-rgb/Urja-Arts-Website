import * as pdfjsLib from "../pdfjs/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "../pdfjs/pdf.worker.mjs";

const url = new URLSearchParams(window.location.search).get("file");

if (!url) {
  alert("PDF not found");
  throw new Error("No PDF file provided");
}

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

pdfjsLib.getDocument(url).promise.then(pdf => {
  pdf.getPage(1).then(page => {
    const scale = window.innerWidth < 768 ? 1.2 : 1.6;
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });
  });
});

/* FULLSCREEN */
document.getElementById("fullscreenBtn").onclick = () => {
  document.documentElement.requestFullscreen();
};

/* BLOCK SHORTCUTS */
document.addEventListener("keydown", e => {
  if (
    e.ctrlKey || e.metaKey ||
    ["s", "p", "u", "PrintScreen"].includes(e.key)
  ) {
    e.preventDefault();
  }
});

/* BLUR ON TAB SWITCH */
document.addEventListener("visibilitychange", () => {
  canvas.style.filter = document.hidden ? "blur(12px)" : "none";
});