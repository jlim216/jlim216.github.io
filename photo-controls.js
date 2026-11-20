// Keep photos in the page while preserving caption and carousel controls.
for (const photo of document.querySelectorAll("img")) {
  photo.addEventListener("dragstart", event => event.preventDefault());
  photo.addEventListener("contextmenu", event => event.preventDefault());
}
