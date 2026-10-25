const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('status');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const categoryInput = document.getElementById('note-category');
const notesList = document.getElementById('notes-list');

const noteCountEl = document.getElementById('note-count');
const themeToggleBtn = document.getElementById('theme-toggle');
const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const searchInput = document.getElementById('search-input');

async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Handle DELETE requests which return 204 No Content
    if (response.status === 204) return null;
    return await response.json();
}

function showStatus(message, type) {
    statusEl.textContent = message; // textContent prevents XSS
    statusEl.className = ''; // reset classes
    if (type) {
        statusEl.classList.add(type);
    }
}

function updateNoteCount() {
    if (noteCountEl) {
        // Count actual list items, excluding the "No notes found" message
        const items = Array.from(notesList.querySelectorAll('li'));
        const validNotes = items.filter(li => !li.textContent.includes('No notes found.'));
        noteCountEl.textContent = `Total notes: ${validNotes.length}`;
    }
}

async function loadNotes() {
    loadBtn.disabled = true;
    showStatus('Loading notes...', 'loading');
    notesList.innerHTML = ''; // Clear current notes

    try {
        const notes = await request(`${API_URL}?_limit=10`);
        
        if (notes.length === 0) {
            notesList.innerHTML = '<li>No notes found.</li>';
            showStatus('Loaded successfully, but list is empty.', 'success');
        } else {
            notes.forEach(note => renderNote(note));
            showStatus('Loaded 10 notes from the server.', 'success');
        }
    } catch (error) {
        showStatus(`Failed to load notes: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
        updateNoteCount();
    }
}

async function createNote(event) {
    event.preventDefault();
    
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const category = categoryInput.value;

    if (!title || title.length > 100) {
        showStatus('Title is required and must be under 100 characters.', 'error');
        return;
    }

    submitBtn.disabled = true;
    showStatus('Creating note...', 'loading');

    try {
        const newNoteData = {
            title: title,
            body: body,
            category: category, 
            userId: 1
        };

        const createdNote = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNoteData)
        });

        renderNote(createdNote, true); 
        showStatus(`Note created (status 201, id ${createdNote.id}).`, 'success');
        
        noteForm.reset();
        charCountEl.textContent = 'Characters: 0';
        wordCountEl.textContent = 'Words: 0';
        
    } catch (error) {
        showStatus(`Failed to create note: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        updateNoteCount();
    }
}

async function deleteNote(id, listItemElement) {
    const deleteBtn = listItemElement.querySelector('.delete-btn');
    deleteBtn.disabled = true;
    showStatus('Deleting note...', 'loading');

    try {
     
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        listItemElement.remove();
        showStatus(`Note ${id} deleted successfully.`, 'success');
        
        if (notesList.children.length === 0) {
             notesList.innerHTML = '<li>No notes found.</li>';
        }
    } catch (error) {
        showStatus(`Failed to delete note: ${error.message}`, 'error');
        deleteBtn.disabled = false;
    } finally {
        updateNoteCount();
    }
}

function renderNote(note, prepend = false) {
    if (notesList.textContent.includes('No notes found.')) {
        notesList.innerHTML = '';
    }

    const li = document.createElement('li');
    
    const noteCategory = note.category || 'Personal';
    li.classList.add(`category-${noteCategory.toLowerCase()}`);
    
    const h3 = document.createElement('h3');
    h3.textContent = note.title; 
    
    const catLabel = document.createElement('small');
    catLabel.textContent = `[${noteCategory}]`;
    catLabel.style.color = '#666';
    catLabel.style.display = 'block';
    catLabel.style.marginBottom = '8px';

    const p = document.createElement('p');
    p.textContent = note.body;
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete Note';
    delBtn.style.marginTop = '10px';
    delBtn.style.backgroundColor = '#e74c3c'; // Make delete button red
    delBtn.addEventListener('click', () => deleteNote(note.id, li));

    li.appendChild(h3);
    li.appendChild(catLabel);
    li.appendChild(p);
    li.appendChild(delBtn);

    if (prepend) {
        notesList.prepend(li);
    } else {
        notesList.appendChild(li);
    }
}


bodyInput.addEventListener('input', () => {
    const text = bodyInput.value;
    charCountEl.textContent = `Characters: ${text.length}`;
    
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCountEl.textContent = `Words: ${words}`;
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const notes = notesList.querySelectorAll('li');
    
    notes.forEach(note => {
        if (note.textContent.includes('No notes found.')) return;
        
        const noteText = note.textContent.toLowerCase();
        if (noteText.includes(searchTerm)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
});

clearBtn.addEventListener('click', () => {
    notesList.innerHTML = '<li>No notes found.</li>';
    updateNoteCount();
    showStatus('Cleared all notes locally.', 'success');
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);