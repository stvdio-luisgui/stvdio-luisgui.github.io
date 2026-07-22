(() => {
  const shell = document.querySelector("[data-youtube-player]");
  if (!shell) return;

  const frame = shell.querySelector("[data-youtube-frame]");
  const title = shell.querySelector("[data-track-title]");
  const artist = shell.querySelector("[data-track-artist]");
  const note = shell.querySelector("[data-track-note]");
  const openLink = shell.querySelector("[data-youtube-link]");
  const chips = [...document.querySelectorAll(".youtube-track-chip")];
  const prev = shell.querySelector("[data-prev-track]");
  const next = shell.querySelector("[data-next-track]");

  let currentIndex = 0;

  const isLocalPreview = window.location.protocol === "file:";
  if (isLocalPreview) {
    shell.classList.add("is-local-preview");
  }

  function loadTrack(index) {
    currentIndex = (index + chips.length) % chips.length;
    const chip = chips[currentIndex];
    const videoId = chip.dataset.videoId;

    const origin = window.location.protocol.startsWith("http")
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";
    frame.src = `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1${origin}`;
    title.textContent = chip.dataset.title;
    artist.textContent = chip.dataset.artist;
    note.textContent = chip.dataset.note;
    openLink.href = `https://www.youtube.com/watch?v=${videoId}`;

    chips.forEach((item, i) => {
      item.classList.toggle("is-active", i === currentIndex);
      item.setAttribute("aria-pressed", i === currentIndex ? "true" : "false");
    });
  }

  chips.forEach((chip, index) => {
    chip.addEventListener("click", () => loadTrack(index));
  });

  prev.addEventListener("click", () => loadTrack(currentIndex - 1));
  next.addEventListener("click", () => loadTrack(currentIndex + 1));
})();

/*
  YouTube error 153 note:
  Embedded playback requires an HTTP Referer or equivalent client identity.
  Test this page from GitHub Pages (https://...), not by double-clicking the HTML file.
*/
