const gameslink = "/assets/games";
const imageslink = "/assets/images";
const gameslistlink = "/assets/games.json";

const gameButtonsDiv = document.getElementById("gameButtonsGrid");
const searchInput = document.getElementById("search");

let games = [];

async function fetchGames() {
  const res = await fetch(gameslistlink);
  if (!res.ok) throw new Error(res.status);
  games = await res.json();
}

function renderGamesButtons(filter = "") {
  gameButtonsDiv.innerHTML = "";

  const filtered = games.filter((g) =>
    (g.name + g.author).toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    gameButtonsDiv.innerHTML = '<div class="empty">No games found</div>';
    return;
  }

  filtered.forEach((game, i) => {
    const button = document.createElement("div");
    button.className = "game-button";
    button.style.animationDelay = `${i * 30}ms`;

    const imglink = game.cover?.replace("{COVER_URL}", imageslink);

    button.innerHTML = `
      <img src="${imglink}" class="game-img" loading="lazy" />
      <div class="game-overlay">
        <div class="overlay-name">${game.name}</div>
        <div class="overlay-author">${game.author}</div>
      </div>
    `;

    button.onclick = () => {
      if (!game.url) return;
      window.location.href = `/play.html?game=${game.slug}`;
    };

    gameButtonsDiv.appendChild(button);
  });
}

searchInput.addEventListener("input", (e) => {
  renderGamesButtons(e.target.value);
});

(async () => {
  await fetchGames();
  renderGamesButtons();
})();
