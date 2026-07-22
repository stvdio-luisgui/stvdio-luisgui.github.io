(() => {
  const API_URL = "https://api.climateclock.world/v2/clock.json";
  const SOURCE_URL = "https://climateclock.world/";

  const copy = {
    en: {
      label: "Time left to limit global warming to 1.5°C",
      years: "Years",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      loading: "Synchronising with Climate Clock…",
      error: "Climate Clock data is temporarily unavailable."
    },
    es: {
      label: "Tiempo para limitar el calentamiento global a 1,5 °C",
      years: "Años",
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
      loading: "Sincronizando con Climate Clock…",
      error: "Los datos de Climate Clock no están disponibles temporalmente."
    },
    de: {
      label: "Verbleibende Zeit, um die Erderwärmung auf 1,5 °C zu begrenzen",
      years: "Jahre",
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
      seconds: "Sekunden",
      loading: "Synchronisierung mit Climate Clock…",
      error: "Die Climate-Clock-Daten sind vorübergehend nicht verfügbar."
    }
  };

  function language() {
    const lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return copy[lang] ? lang : "en";
  }

  function pad(value, length = 2) {
    return String(Math.max(0, value)).padStart(length, "0");
  }

  function addUtcYears(date, years) {
    const result = new Date(date.getTime());
    const month = result.getUTCMonth();
    result.setUTCFullYear(result.getUTCFullYear() + years);

    // Preserve the final valid day for leap-day dates.
    if (result.getUTCMonth() !== month) {
      result.setUTCDate(0);
    }
    return result;
  }

  function splitRemaining(now, deadline) {
    if (deadline <= now) {
      return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Count full calendar years instead of assuming every year has 365 days.
    let years = deadline.getUTCFullYear() - now.getUTCFullYear();
    let anchor = addUtcYears(now, years);

    if (anchor > deadline) {
      years -= 1;
      anchor = addUtcYears(now, years);
    }

    let remainingMilliseconds = deadline.getTime() - anchor.getTime();
    const days = Math.floor(remainingMilliseconds / 86400000);
    remainingMilliseconds -= days * 86400000;

    const hours = Math.floor(remainingMilliseconds / 3600000);
    remainingMilliseconds -= hours * 3600000;

    const minutes = Math.floor(remainingMilliseconds / 60000);
    remainingMilliseconds -= minutes * 60000;

    const seconds = Math.floor(remainingMilliseconds / 1000);

    return { years, days, hours, minutes, seconds };
  }

  function render(panel, deadline, labels) {
    const values = panel.querySelectorAll("[data-clock-value]");
    const status = panel.querySelector(".climate-clock-status");

    const tick = () => {
      const remaining = splitRemaining(new Date(), deadline);
      const formatted = [
        pad(remaining.years, 2),
        pad(remaining.days, 3),
        pad(remaining.hours),
        pad(remaining.minutes),
        pad(remaining.seconds)
      ];
      values.forEach((node, index) => {
        node.textContent = formatted[index];
      });
      status.textContent = "";
    };

    tick();
    window.setInterval(tick, 1000);
  }

  async function initialise(panel) {
    const labels = copy[language()];
    panel.querySelector(".climate-clock-label").textContent = labels.label;
    panel.querySelectorAll("[data-clock-caption]").forEach((node, index) => {
      node.textContent = [
        labels.years,
        labels.days,
        labels.hours,
        labels.minutes,
        labels.seconds
      ][index];
    });
    panel.querySelector(".climate-clock-status").textContent = labels.loading;
    panel.querySelector(".climate-clock-source").href = SOURCE_URL;

    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const timer = payload?.data?.modules?.carbon_deadline_1;
      if (!timer?.timestamp) throw new Error("Timer module unavailable");
      render(panel, new Date(timer.timestamp), labels);
    } catch (error) {
      panel.classList.add("is-error");
      panel.querySelector(".climate-clock-status").textContent = labels.error;
      console.warn("Climate Clock:", error);
    }
  }

  document.querySelectorAll("[data-climate-clock]").forEach(initialise);
})();