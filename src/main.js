import dayjs from "dayjs";
const API_URL = 'https://dtzbtuzhyejjxvzyfovx.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0emJ0dXpoeWVqanh2enlmb3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjI1MzcsImV4cCI6MjA5NTg5ODUzN30.3yuoOmRQJx63tzOX8979k_CHew-KrJT9Fzng3htTFJk';

const articleContainer = document.querySelector('#articles-container');
const form = document.querySelector('#add-article-form');
const sortSelect = document.querySelector('#sort-select');

let currentOrder = sortSelect.value;

sortSelect.addEventListener('change', (e) => {
  currentOrder = e.target.value;
  fetchArticles();
});
const fetchArticles = async () => {
  try {
    const response = await fetch(`${API_URL}?select=*&order=${currentOrder}`, {
      method: 'GET',
      headers: {
        'apikey': API_KEY,
      }
    });
    if (!response.ok) {
      throw new Error(`Status HTTP: ${response.status}`);
    }
    const data = await response.json();
    renderArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
    articleContainer.innerHTML = '<p class="text-red-500 font-bold">Błąd podczas pobierania artykułów</p>';
  }
};

const renderArticles = (articles) => {
  articleContainer.innerHTML = '';
  articles.forEach(article => {
    const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

    const articleHTML = `
      <div class="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition hover:shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800">${article.title}</h2>
        <h3 class="text-xl text-gray-600 mb-2">${article.subtitle}</h3>
        <div class="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded inline-block">
            <span>Autor: <span class="font-semibold text-gray-700">${article.author}</span></span>
            <span class="mx-2">|</span>
            <span>Dodano: ${formattedDate}</span>
        </div>
        <p class="text-gray-700 leading-relaxed">${article.content}</p>
      </div>`;
    articleContainer.innerHTML += articleHTML;
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const newArticle = {
    title: document.querySelector('#title').value,
    subtitle: document.querySelector('#subtitle').value,
    author: document.querySelector('#author').value,
    content: document.querySelector('#content').value
  };

  const customDate = document.querySelector('#created_at').value;
  if (customDate){
    newArticle.created_at = customDate;
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'apiKey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newArticle)
    });

    if (response.status !== 201) {
      throw new Error(`Status: ${response.status}`);
    }

    form.reset();
    fetchArticles();
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Nie udało się dodać artykułu!');
  }
});
fetchArticles();