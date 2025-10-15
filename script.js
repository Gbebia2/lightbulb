const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const refreshBtn = document.getElementById('refresh-btn');
const unsplashImg = document.getElementById('unsplash-img');
const giphyGif = document.getElementById('giphy-gif');
const saveBtn = document.getElementById("save-btn");
const noteBtn = document.getElementById('note-btn');
const noteModal = document.getElementById('note-modal');
const saveNoteBtn = document.getElementById('save-note');
const closeNoteBtn = document.getElementById('close-note');
const noteText = document.getElementById('note-text');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const saveThemeBtn = document.getElementById('save-theme');
const themeSelect = document.getElementById('theme-select');

let currentTheme = localStorage.getItem('theme') || 'inspiration';
let cachedQuotes = [];

// Fetch a batch of quotes once
async function fetchAllQuotes() {
  try {
    const response = await fetch('https://dummyjson.com/quotes'); // fetch all quotes
    const data = await response.json();
    cachedQuotes = data.quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}

// Filter quotes based on theme
function filterQuotesByTheme(theme) {
  if (!cachedQuotes.length) return [];
  return cachedQuotes.filter(q => q.quote.toLowerCase().includes(theme.toLowerCase()));
}

// Fetch a random theme-matched quote
function fetchQuote() {
  quoteEl.classList.remove('show');
  authorEl.classList.remove('show');
  quoteEl.textContent = 'Fetching new quote...';
  authorEl.textContent = '';

  let filtered = filterQuotesByTheme(currentTheme);
  if (!filtered.length) filtered = cachedQuotes; // fallback if no theme match

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];

  setTimeout(() => {
    quoteEl.textContent = `"${randomQuote.quote}"`;
    authorEl.textContent = `— ${randomQuote.author}`;
    quoteEl.classList.add('show');
    authorEl.classList.add('show');
  }, 50);
}

// Fetch a theme-based Unsplash image
async function fetchUnsplashImage() {
  const accessKey = "_O3z19KWzMboKbqodorifnrYtsED3DZhPA5JHEbx8B0";
  const randomSig = Math.floor(Math.random() * 10000);
  const url = `https://api.unsplash.com/photos/random?query=${currentTheme}&orientation=landscape&client_id=${accessKey}&sig=${randomSig}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    unsplashImg.src = data.urls.regular;
    unsplashImg.alt = data.alt_description || "Inspiration image";
  } catch (error) {
    console.error('Error fetching image:', error);
    unsplashImg.src = 'https://via.placeholder.com/600x400?text=Image+Unavailable';
  }
}

// Fetch a theme-based Giphy GIF
async function fetchGiphyGif() {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=4S20vmyUVZaruhXlsRAxtqJNeCi8y97p&tag=${currentTheme}&rating=g`);
    const data = await response.json();
    giphyGif.src = data.data.images.original.url;
  } catch (error) {
    console.error('Error fetching GIF:', error);
    giphyGif.src = 'https://via.placeholder.com/300x200?text=GIF+Unavailable';
  }
}

// Show fade-in effect
function fadeInMedia() {
  unsplashImg.classList.remove('show');
  giphyGif.classList.remove('show');
  setTimeout(() => {
    unsplashImg.classList.add('show');
    giphyGif.classList.add('show');
  }, 50);
}

// Fetch all content
async function fetchPrompt() {
  await Promise.all([fetchQuote(), fetchUnsplashImage(), fetchGiphyGif()]);
  fadeInMedia();
}

// Save prompt
saveBtn.addEventListener("click", () => {
  const quote = quoteEl.textContent;
  const image = unsplashImg.src;
  const gif = giphyGif?.src || "";

  if (!quote || !image) {
    alert("Generate a prompt first!");
    return;
  }

  const savedPrompts = JSON.parse(localStorage.getItem("savedPrompts")) || [];
  savedPrompts.push({ quote, image, gif, date: new Date().toISOString() });
  localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  alert("Prompt saved!");
});

// Note modal
noteBtn.addEventListener('click', () => noteModal.classList.add('active'));
closeNoteBtn.addEventListener('click', () => noteModal.classList.remove('active'));
saveNoteBtn.addEventListener('click', () => {
  const note = noteText.value.trim();
  if (note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.push({ quote: quoteEl.textContent, note });
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    noteText.value = '';
    noteModal.classList.remove('active');
    alert('Note saved! 📝');
  }
});

// Settings modal
settingsBtn.addEventListener('click', () => {
  themeSelect.value = currentTheme;
  settingsModal.classList.add('active');
});
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
saveThemeBtn.addEventListener('click', () => {
  currentTheme = themeSelect.value;
  localStorage.setItem('theme', currentTheme);
  settingsModal.classList.remove('active');
  fetchPrompt();
});

// Page load
quoteEl.classList.add('fade-in', 'show');
authorEl.classList.add('fade-in', 'show');
fetchAllQuotes().then(fetchPrompt);
refreshBtn.addEventListener('click', fetchPrompt);
