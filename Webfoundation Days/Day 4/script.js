const noteText = document.getElementById('note-text');
const charCountDisplay = document.getElementById('char-count');
const wordCountDisplay = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

const MAX_CHARS = 200;
const WARNING_LIMIT = 180;

function updateCounts() {
    const text = noteText.value;
    const charCount = text.length;
    
    charCountDisplay.textContent = `${charCount} / ${MAX_CHARS} characters`;
    
    charCountDisplay.classList.remove('warning', 'over');
    if (charCount > MAX_CHARS) {
        charCountDisplay.classList.add('over');
    } else if (charCount > WARNING_LIMIT) {
        charCountDisplay.classList.add('warning');
    }

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCountDisplay.textContent = `${words.length} words`;
}

function loadSavedData() {
    const savedNote = localStorage.getItem('noteDraft');
    if (savedNote !== null) {
        noteText.value = savedNote;
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    } else {
        themeToggle.textContent = 'Dark mode';
    }

    updateCounts(); 
}

noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('noteDraft', noteText.value);
});

function clearNote() {
    noteText.value = '';
    updateCounts();
    localStorage.removeItem('noteDraft');
}

clearBtn.addEventListener('click', clearNote);

noteText.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        clearNote();
    }
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    
    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = 'Light mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = 'Dark mode';
        localStorage.setItem('theme', 'light');
    }
});

loadSavedData();

