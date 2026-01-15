const appslink = "/assets/apps";
const imageslink = "https://www.google.com/s2/favicons?domain=DOMAIN&sz=256";
const appslistlink = "/assets/apps.json";

const appButtonsDiv = document.getElementById("appButtonsGrid");
const searchInput = document.getElementById("search");

let apps = [];

async function fetchApps() {
  const res = await fetch(appslistlink);
  if (!res.ok) throw new Error(res.status);
  apps = await res.json();
}

function renderAppsButtons(filter = "") {
  appButtonsDiv.innerHTML = "";

  const filtered = apps.filter((g) =>
    (g.name + g.author).toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    appButtonsDiv.innerHTML = '<div class="empty">No Apps found</div>';
    return;
  }

  filtered.forEach((app, i) => {
    const button = document.createElement("div");
    button.className = "app-button";
    button.style.animationDelay = `${i * 30}ms`;

    const imglink = imageslink?.replace("DOMAIN", app.url);

    button.innerHTML = `
      <img src="${imglink}" class="app-img" loading="lazy" />
      <div class="app-overlay">
        <div class="overlay-name">${app.name}</div>
      </div>
    `;

    button.onclick = () => {
      if (!app.url) return;
      window.location.href = `/app.html?app=${app.slug}`;
    };

    appButtonsDiv.appendChild(button);
  });
}

searchInput.addEventListener("input", (e) => {
  renderAppsButtons(e.target.value);
});

(async () => {
  await fetchApps();
  renderAppsButtons();
})();
