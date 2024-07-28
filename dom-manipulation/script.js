document.addEventListener('DOMContentLoaded', () => {
  let quotes = loadQuotes();
  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');

  // Simulate fetching quotes from a mock server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();

      // Simulate quote structure with server data
      return serverQuotes.map(post => ({
        id: post.id,
        text: post.title, // Using title as the quote text
        category: 'General' // Static category for demonstration
      }));
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
      return [];
    }
  }

  async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length > 0) {
      // Simple conflict resolution: server data takes precedence
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      showNotification('Quotes synced with server!'); // Notify user of successful sync
      filterQuotes(); // Refresh the quotes display
    }
  }

  async function updateQuotesOnServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
      });
      const result = await response.json();
      console.log('Server response:', result);
      showNotification('Quotes updated on the server!'); // Notify user of successful update
    } catch (error) {
      console.error('Error updating quotes on server:', error);
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = '#4CAF50'; // Green background for success
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000); // Remove notification after 3 seconds
  }

  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    updateQuotesOnServer(); // Sync with server when saving locally
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
    
    displayQuotes(filteredQuotes);
    localStorage.setItem('lastCategory', selectedCategory);
  }

  function displayQuotes(quotesToDisplay) {
    quoteDisplay.innerHTML = '';

    if (quotesToDisplay.length === 0) {
      quoteDisplay.textContent = 'No quotes available for this category.';
      return;
    }

    quotesToDisplay.forEach(quote => {
      const quoteParagraph = document.createElement('p');
      quoteParagraph.textContent = `"${quote.text}" - ${quote.category}`;
      quoteDisplay.appendChild(quoteParagraph);
    });
  }

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      const newQuote = { id: Date.now(), text, category }; // Using timestamp as unique ID
      quotes.push(newQuote);
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      populateCategories();
      showNotification('Quote added successfully!'); // Notify user of successful addition
      filterQuotes(); // Update filter after adding new quote
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes = [...importedQuotes];
      saveQuotes();
      populateCategories();
      showNotification('Quotes imported successfully!'); // Notify user of successful import
      filterQuotes(); // Update filter after importing quotes
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function notifyConflictResolution() {
    alert('Data conflicts resolved with server data.');
  }

  const lastCategory = localStorage.getItem('lastCategory');
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    filterQuotes();
  } else {
    displayQuotes(quotes); // Display all quotes initially
  }

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  populateCategories();

  // Periodically sync quotes with server every 5 minutes (300000 ms)
  setInterval(syncQuotesWithServer, 300000);
});
