const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const refreshBtn = document.getElementById('refresh-btn');

// Function to fetch a random quote
async function fetchQuote() {
  // Start with hiding the text
  quoteEl.classList.remove('show');
  authorEl.classList.remove('show');

  // Temporary loading text
  quoteEl.textContent = 'Fetching new quote...';
  authorEl.textContent = '';

  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    const data = await response.json();

    // Small timeout so fade-in can play
    setTimeout(() => {
      quoteEl.textContent = `"${data.quote}"`;
      authorEl.textContent = `— ${data.author}`;

      // Add 'show' to trigger fade-in
      quoteEl.classList.add('show');
      authorEl.classList.add('show');
    }, 50); // 50ms delay is enough
  } catch (error) {
    quoteEl.textContent = 'Could not fetch a new quote 😅';
    authorEl.textContent = '';
    console.error('Error fetching quote:', error);
  }
}

// Make sure elements start with fade-in class
quoteEl.classList.add('fade-in', 'show');
authorEl.classList.add('fade-in', 'show');

// Load a quote when the page first opens
fetchQuote();

// Load a new quote when the button is clicked
refreshBtn.addEventListener('click', fetchQuote);

