document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-prompts");
  const saved = JSON.parse(localStorage.getItem("savedPrompts")) || [];

  if (saved.length === 0) {
    container.innerHTML = "<p>No saved prompts yet.</p>";
    return;
  }

  saved.forEach(item => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <p>${item.quote}</p>
      <img src="${item.image}" alt="Prompt Image" width="200">
      <img src="${item.gif}" alt="Prompt Gif" width="200">
      <small>Saved: ${new Date(item.date).toLocaleString()}</small>
    `;
    container.appendChild(card);
  });
});
