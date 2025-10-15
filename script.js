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

// Fetch a random quote
async function fetchQuote() {
  quoteEl.classList.remove('show');
  authorEl.classList.remove('show');
  quoteEl.textContent = 'Fetching new quote...';
  authorEl.textContent = '';

  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    const data = await response.json();

    setTimeout(() => {
      quoteEl.textContent = `"${data.quote}"`;
      authorEl.textContent = `— ${data.author}`;
      quoteEl.classList.add('show');
      authorEl.classList.add('show');
    }, 50);
  } catch (error) {
    quoteEl.textContent = 'Could not fetch a new quote 😅';
    authorEl.textContent = '';
    console.error('Error fetching quote:', error);
  }
}

// Fetch a random Unsplash image
async function fetchUnsplashImage() {
  const accessKey = "_O3z19KWzMboKbqodorifnrYtsED3DZhPA5JHEbx8B0"; // replace with your real key
  const randomSig = Math.floor(Math.random() * 10000);
  const url = `https://api.unsplash.com/photos/random?query=inspiration&orientation=landscape&client_id=${accessKey}&sig=${randomSig}`;

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

async function fetchGiphyGif() {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=4S20vmyUVZaruhXlsRAxtqJNeCi8y97p&tag=inspiration&rating=g`);
    const data = await response.json();
    giphyGif.src = data.data.images.original.url;
  } catch (error) {
    console.error('Error fetching GIF:', error);
    giphyGif.src = 'https://via.placeholder.com/300x200?text=GIF+Unavailable';
  }
}

unsplashImg.classList.remove('show');
giphyGif.classList.remove('show');
setTimeout(() => {
  unsplashImg.classList.add('show');
  giphyGif.classList.add('show');
}, 50);


// Combine all fetches
async function fetchPrompt() {
  await Promise.all([fetchQuote(), fetchUnsplashImage(), fetchGiphyGif()]);
}

// Add fade-in class setup
quoteEl.classList.add('fade-in', 'show');
authorEl.classList.add('fade-in', 'show');

saveBtn.addEventListener("click", () => {
  const quote = document.getElementById("quote").textContent;
  const image = document.getElementById("unsplash-img").src;
  const gif = document.getElementById("giphy-gif")?.src || "";

  if (!quote || !image) {
    alert("Generate a prompt first!");
    return;
  }

  // Get saved prompts from localStorage or start new
  const savedPrompts = JSON.parse(localStorage.getItem("savedPrompts")) || [];

  // Create new entry
  const newPrompt = { quote, image, gif, date: new Date().toISOString() };

  // Add to array and save
  savedPrompts.push(newPrompt);
  localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));

  alert("Prompt saved!");
});

// Open modal
noteBtn.addEventListener('click', () => {
  noteModal.classList.add('active');
});

// Close modal
closeNoteBtn.addEventListener('click', () => {
  noteModal.classList.remove('active');
});

// Save note
saveNoteBtn.addEventListener('click', () => {
  const note = noteText.value.trim();
  if (note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const currentQuote = document.getElementById('quote').textContent;
    savedNotes.push({ quote: currentQuote, note });
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    noteText.value = '';
    noteModal.classList.remove('active');
    alert('Note saved! 📝');
  }
});

// Load on page start and on refresh
fetchPrompt();
refreshBtn.addEventListener('click', fetchPrompt);
