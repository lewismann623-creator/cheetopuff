const gamesListUrl = "/assets/games.json";
const gamesBaseUrl = "/assets/games";
const imagesBaseUrl = "/assets/images";

const frame = document.getElementById("gameFrame");
const gameImg = document.getElementById("gameImage");
const gameName = document.getElementById("gameName");
const gameAuthor = document.getElementById("gameAuthor");

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("game");
}

async function redirectWithFetchedHTML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch game");

    const html = await response.text();

    const win = window.open("about:blank");
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (err) {
    console.error("Failed to load content:", err);
  }
}

async function loadGame() {
  const slug = getSlug();
  if (!slug) {
    gameName.textContent = "Game not found";
    return;
  }

  const res = await fetch(gamesListUrl);
  if (!res.ok) throw new Error("Failed to load games.json");

  const games = await res.json();
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    gameName.textContent = "Game not found";
    return;
  }

  // UI
  gameName.textContent = game.name;
  gameAuthor.textContent = game.author || "";

  if (game.cover) {
    gameImg.src = game.cover.replace("{COVER_URL}", imagesBaseUrl);
  } else if (game.domain) {
    gameImg.src = `https://www.google.com/s2/favicons?sz=128&domain=${game.domain}`;
  }

  // Load game HTML into iframe
  const gameUrl = game.url.replace("{HTML_URL}", gamesBaseUrl);
  const gameRes = await fetch(gameUrl);
  if (!gameRes.ok) throw new Error("Failed to load game HTML");

  const gameHtml = await gameRes.text();
  frame.srcdoc = gameHtml;

  // Toolbar
  document.querySelector(".fsButton").onclick = () => {
    frame.requestFullscreen();
  };

  document.querySelector(".abtBlnkButton").onclick = () => {
    redirectWithFetchedHTML(gameUrl);
  };
}

loadGame().catch(console.error);
