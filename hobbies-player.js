(() => {
  const cards = [...document.querySelectorAll("[data-audio-card]")];

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function resetCard(card) {
    const audio = card.querySelector("audio");
    const button = card.querySelector(".track-play");
    if (!audio || !button) return;
    button.textContent = "▶";
    card.classList.remove("is-playing");
  }

  cards.forEach((card) => {
    const audio = card.querySelector("audio");
    const button = card.querySelector(".track-play");
    const progress = card.querySelector(".track-progress span");
    const time = card.querySelector(".track-time");

    button.addEventListener("click", async () => {
      if (audio.paused) {
        cards.forEach((other) => {
          if (other === card) return;
          const otherAudio = other.querySelector("audio");
          if (otherAudio) otherAudio.pause();
          resetCard(other);
        });

        try {
          await audio.play();
          button.textContent = "Ⅱ";
          card.classList.add("is-playing");
        } catch (error) {
          card.classList.add("audio-missing");
          time.textContent = "Add audio";
          console.warn("Audio could not be played:", error);
        }
      } else {
        audio.pause();
        resetCard(card);
      }
    });

    audio.addEventListener("timeupdate", () => {
      const ratio = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progress.style.width = `${ratio}%`;
      time.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      resetCard(card);
      progress.style.width = "0%";
      time.textContent = "00:00";
    });
  });
})();