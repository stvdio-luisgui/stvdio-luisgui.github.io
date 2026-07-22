(() => {
  const radio = document.querySelector("[data-compact-radio]");
  if (!radio) return;

  const select = radio.querySelector("[data-track-select]");
  const frame = radio.querySelector("[data-radio-frame]");
  const title = radio.querySelector("[data-radio-title]");
  const artist = radio.querySelector("[data-radio-artist]");
  const genre = radio.querySelector("[data-radio-genre]");
  const youtube = radio.querySelector("[data-radio-youtube]");
  const previous = radio.querySelector("[data-radio-prev]");
  const next = radio.querySelector("[data-radio-next]");

  function load(index) {
    const options = [...select.options];
    const resolved = (index + options.length) % options.length;
    select.selectedIndex = resolved;
    const option = options[resolved];
    const id = option.value;
    const origin = window.location.protocol.startsWith("http")
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";

    title.textContent = option.dataset.title;
    artist.textContent = option.dataset.artist;
    genre.textContent = option.dataset.genre;
    youtube.href = `https://www.youtube.com/watch?v=${id}`;
    frame.src = `https://www.youtube.com/embed/${id}?rel=0&playsinline=1${origin}`;
  }

  select.addEventListener("change", () => load(select.selectedIndex));
  previous.addEventListener("click", () => load(select.selectedIndex - 1));
  next.addEventListener("click", () => load(select.selectedIndex + 1));
})();