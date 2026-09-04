const form = document.getElementById('note-form');
const idField = document.getElementById('note-id');
const titleField = document.getElementById('note-title');
const contentField = document.getElementById('note-content');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('notes-list');

async function fetchNotes() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  renderNotes(notes);
}

function renderNotes(notes) {
  list.innerHTML = '';
  for (const note of notes) {
    const li = document.createElement('li');
    li.className = 'note';
    li.innerHTML = `
      <h3></h3>
      <p></p>
      <div class="note-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    li.querySelector('h3').textContent = note.title;
    li.querySelector('p').textContent = note.content || '';
    li.querySelector('.edit-btn').addEventListener('click', () => startEdit(note));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
    list.appendChild(li);
  }
}

function startEdit(note) {
  idField.value = note.id;
  titleField.value = note.title;
  contentField.value = note.content || '';
  submitBtn.textContent = 'Save note';
  cancelBtn.hidden = false;
}

function resetForm() {
  form.reset();
  idField.value = '';
  submitBtn.textContent = 'Add note';
  cancelBtn.hidden = true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = idField.value;
  const body = JSON.stringify({ title: titleField.value, content: contentField.value });
  const options = { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body };
  await fetch(id ? `/api/notes/${id}` : '/api/notes', options);
  resetForm();
  fetchNotes();
});

cancelBtn.addEventListener('click', resetForm);

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  fetchNotes();
}

fetchNotes();
