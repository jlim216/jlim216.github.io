// Your contact email. Update it here if needed.
const email = "jblim@g.harvard.edu";
// Replace files/cv.pdf to update your CV.
const cvFile = "files/cv.pdf";

const themeToggle = document.querySelector("[data-theme-toggle]");
let selectedTheme;
try {
  selectedTheme = localStorage.getItem("jb-site-theme");
} catch {
  // Storage can be unavailable when opening the site from a local file.
}

function applyTheme() {
  const dark = selectedTheme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

if (themeToggle) {
  applyTheme();
  themeToggle.hidden = false;
  themeToggle.addEventListener("click", () => {
    selectedTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme();
    try {
      localStorage.setItem("jb-site-theme", selectedTheme);
    } catch {
      // The control still works on this page without storage.
    }
  });
}

if (email) {
  document.querySelectorAll("[data-email]").forEach(link => {
    link.href = `mailto:${email}`;
    link.setAttribute("aria-label", "Email JB Jong Beom Lim");
    link.querySelector("span").textContent = "Email";
  });
}

document.querySelectorAll("[data-cv]").forEach(link => {
  if (cvFile) {
    link.href = cvFile;
    link.download = "JB-Jong-Beom-Lim-CV.pdf";
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      document.querySelector("[data-notice]").textContent = "CV coming soon.";
    });
  }
});

const datasetCarousel = document.querySelector("[data-dataset-carousel]");
if (datasetCarousel) {
  const previews = [...datasetCarousel.querySelectorAll(".dataset-preview")];
  const controls = datasetCarousel.querySelector("[data-preview-controls]");
  const position = datasetCarousel.querySelector("[data-preview-position]");
  let currentPreview = 0;

  function showPreview(index) {
    currentPreview = (index + previews.length) % previews.length;
    previews.forEach((preview, number) => {
      preview.hidden = number !== currentPreview;
    });
    position.textContent = `Preview ${currentPreview + 1} of ${previews.length}`;
  }

  controls.querySelector("[data-preview-previous]").addEventListener("click", () => {
    showPreview(currentPreview - 1);
  });
  controls.querySelector("[data-preview-next]").addEventListener("click", () => {
    showPreview(currentPreview + 1);
  });
  showPreview(0);
  controls.hidden = false;
}

// Watch only the local preview; published pages do not poll a development server.
if (["localhost", "127.0.0.1"].includes(location.hostname)) {
  let previousRevision;
  async function checkForChanges() {
    try {
      const response = await fetch("/__preview_revision", { cache: "no-store" });
      if (!response.ok) return;
      const { revision } = await response.json();
      if (previousRevision && previousRevision !== revision) {
        location.reload();
        return;
      }
      previousRevision = revision;
    } catch {
      // Retry after a temporary disconnect or preview restart.
    } finally {
      setTimeout(checkForChanges, 1000);
    }
  }
  checkForChanges();
}
