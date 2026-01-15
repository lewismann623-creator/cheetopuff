const appsListUrl = "/assets/apps.json";

const frame = document.getElementById("appFrame");
const appImg = document.getElementById("appImage");
const appName = document.getElementById("appName");

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("app");
}

async function loadApp() {
  const slug = getSlug();
  if (!slug) {
    appName.textContent = "App not found";
    return;
  }

  const res = await fetch(appsListUrl);
  if (!res.ok) throw new Error("Failed to load apps.json");

  const apps = await res.json();
  const app = apps.find((a) => a.slug === slug);

  if (!app) {
    appName.textContent = "App not found";
    return;
  }

  // UI
  appName.textContent = app.name;

  // Google favicon only
  if (app.url) {
    appImg.src = `https://www.google.com/s2/favicons?sz=256&domain=${app.domain}`;
  } else {
    appImg.remove();
  }

  frame.src = app.url;

  // Toolbar
  document.querySelector(".fsButton").onclick = () => {
    frame.requestFullscreen();
  };

  document.querySelector(".abtBlnkButton").onclick = () => {
    window.open(appUrl, "_blank", "noopener");
  };
}

loadApp().catch(console.error);
