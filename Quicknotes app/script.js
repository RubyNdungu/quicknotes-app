const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const charCount = document.querySelector('#char-count');
const wordCount = document.querySelector('#word-count');
const clearBtn = document.querySelector('#clear-btn');
const themeToggleBtn = document.querySelector('#theme-toggle'); // Added Theme Button

let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

function saveNotes() {
    localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

function render(notesToDisplay) {
    notesList.innerHTML = '';
    
    if (notesToDisplay.length === 0) {
        noteCount.textContent = 'You have no notes yet.';
    } else if (notesToDisplay.length === 1) {
        noteCount.textContent = 'You have 1 note.';
    } else {
        noteCount.textContent = `You have ${notesToDisplay.length} notes.`;
    }

    if (notesToDisplay.length === 0 && searchInput.value.trim() !== '') {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No notes match your search.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#7f8c8d';
        notesList.appendChild(emptyMessage);
        return;
    }

    notesToDisplay.forEach(note => {
        const li = document.createElement('li');
        li.classList.add(`category-${note.category.toLowerCase()}`);

        const textPara = document.createElement('p');
        textPara.textContent = note.text;

        const metaPara = document.createElement('small');
        metaPara.textContent = `[${note.category}] Added: ${note.createdAt}`;
        metaPara.style.display = 'block';
        metaPara.style.color = '#7f8c8d';
        metaPara.style.marginBottom = '15px';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#e74c3c';
        
        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });

        li.appendChild(textPara);
        li.appendChild(metaPara);
        li.appendChild(deleteBtn);
        
        notesList.appendChild(li);
    });
}

noteInput.addEventListener('input', () => {
    const text = noteInput.value;
    charCount.textContent = `Characters: ${text.length}`;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `Words: ${words.length}`;
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === '') {
        errorMessage.textContent = 'Please type a note first.';
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.';
        return;
    }

    errorMessage.textContent = '';

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    
    noteInput.value = '';
    charCount.textContent = 'Characters: 0';
    wordCount.textContent = 'Words: 0';
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
        const filteredNotes = notes.filter(n => 
            n.text.toLowerCase().includes(searchTerm)
        );
        render(filteredNotes);
    } else {
        render(notes);
    }
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
        const filteredNotes = notes.filter(note => 
            note.text.toLowerCase().includes(searchTerm)
        );
        render(filteredNotes);
    } else {
        render(notes);
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        render(notes);
        return;
    }

    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );
    
    render(filteredNotes);
});

clearBtn.addEventListener('click', () => {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render(notes);
    }
});

if (localStorage.getItem('quicknotes_theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    console.log("THEME BUTTON WAS CLICKED!");
    
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('quicknotes_theme', 'dark');
    } else {
        localStorage.setItem('quicknotes_theme', 'light');
    }
});

render(notes);
