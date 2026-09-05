const form = document.getElementById('conversation-form');
const idField = document.getElementById('conversation-id');
const modeField = document.getElementById('conversation-mode');
const locationField = document.getElementById('conversation-location');
const contentField = document.getElementById('conversation-content');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('conversations-list');

const LAT_LNG_PATTERN = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/;

async function fetchConversations() {
  const res = await fetch('/api/conversations');
  const conversations = await res.json();
  renderConversations(conversations);
}

function renderLocation(location) {
  if (!location) return '';
  const match = location.match(LAT_LNG_PATTERN);
  if (!match) return document.createTextNode(location);
  const link = document.createElement('a');
  link.href = `https://www.google.com/maps?q=${match[1]},${match[3]}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = location;
  return link;
}

function renderConversations(conversations) {
  list.innerHTML = '';
  for (const conversation of conversations) {
    const li = document.createElement('li');
    li.className = 'conversation';
    li.innerHTML = `
      <h3></h3>
      <p class="timestamp"></p>
      <p class="location"></p>
      <p class="content"></p>
      <div class="conversation-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    li.querySelector('h3').textContent = conversation.mode;
    li.querySelector('.timestamp').textContent = new Date(conversation.created_at).toLocaleString();
    const locationEl = li.querySelector('.location');
    const rendered = renderLocation(conversation.location);
    if (rendered) locationEl.appendChild(rendered);
    li.querySelector('.content').textContent = conversation.content || '';
    li.querySelector('.edit-btn').addEventListener('click', () => startEdit(conversation));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteConversation(conversation.id));
    list.appendChild(li);
  }
}

function startEdit(conversation) {
  idField.value = conversation.id;
  modeField.value = conversation.mode;
  locationField.value = conversation.location || '';
  contentField.value = conversation.content || '';
  submitBtn.textContent = 'Save conversation';
  cancelBtn.hidden = false;
}

function resetForm() {
  form.reset();
  idField.value = '';
  submitBtn.textContent = 'Add conversation';
  cancelBtn.hidden = true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = idField.value;
  const body = JSON.stringify({
    mode: modeField.value,
    location: locationField.value,
    content: contentField.value,
  });
  const options = { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body };
  await fetch(id ? `/api/conversations/${id}` : '/api/conversations', options);
  resetForm();
  fetchConversations();
});

cancelBtn.addEventListener('click', resetForm);

async function deleteConversation(id) {
  await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
  fetchConversations();
}

fetchConversations();
