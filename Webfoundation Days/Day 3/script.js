notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
    const searchWord = word.toLowerCase();
    return notes.filter(note => note.text.toLowerCase().includes(searchWord));
}

function longestNote() {
    if (notes.length === 0) return null;
    
    let longest = notes[0];
    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }
    return longest;
}

function countByCategory() {
    let counts = {};
    for (let note of notes) {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    }
    return counts;
}

function getSummary() {
    const total = notes.length;
    const counts = countByCategory();
    const noteWord = total === 1 ? "note" : "notes";
    
    let parts = [];
    if (counts.personal) parts.push(`${counts.personal} personal`);
    if (counts.work) parts.push(`${counts.work} work`);
    if (counts.study) parts.push(`${counts.study} study`);
    
    return `${total} ${noteWord}: ${parts.join(', ')}.`;
}

function isDuplicate(text) {
    const cleanText = text.trim().toLowerCase();
    return notes.some(note => note.text.trim().toLowerCase() === cleanText);
}

function addNote(text, category) {
    if (text.length < 1 || text.length > 200) {
        console.log("❌ Failed: Note must be between 1 and 200 characters.");
        return false;
    }

    if (isDuplicate(text)) {
        console.log("❌ Failed: This note already exists.");
        return false;
    }

    const validCategories = ["personal", "work", "study"];
    if (!validCategories.includes(category.toLowerCase())) {
        console.log("❌ Failed: Invalid category.");
        return false;
    }

    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;

    notes.push({ 
        id: newId, 
        text: text, 
        category: category.toLowerCase() 
    });
    
    console.log("✅ Success: Note added.");
    return true;
}
const backupNotes = [...notes]; 

// searchNotes tests
console.log(searchNotes("javascript")); 
// Expected: [ { id: 4, text: 'Revise JavaScript arrays', category: 'study' } ]

console.log(searchNotes("xyz")); 
// Expected: []

// longestNote tests
console.log(longestNote()); 
// Expected: { id: 3, text: 'Email the project report to Grace', category: 'work' }

notes = []; // Destructive edge case!
console.log(longestNote()); // Expected: null
notes = [...backupNotes]; // INSTANTLY RESTORE THE DATA

// countByCategory tests
console.log(countByCategory()); 
// Expected: { personal: 2, study: 2, work: 1 }

notes = []; 
console.log(countByCategory()); 
// Expected: {}
notes = [...backupNotes]; 

// getSummary tests
console.log(getSummary()); 
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [{ id: 1, text: "Just one note", category: "work" }]; 
console.log(getSummary()); 
// Expected: "1 note: 1 work."
notes = [...backupNotes]; // Fixed: removed stray ] bracket

// isDuplicate tests
console.log(isDuplicate("   CALL MUM   ")); 
// Expected: true

console.log(isDuplicate("Learn React")); 
// Expected: false

// addNote tests
console.log(addNote("Learn HTML", "study")); 
// Expected: ✅ Success: Note added.

console.log(addNote("", "work")); 
// Expected: ❌ Failed: Note must be between 1 and 200 characters.


