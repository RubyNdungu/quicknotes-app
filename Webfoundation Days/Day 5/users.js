const loadButton = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusMsg = document.getElementById('status');
const usersList = document.getElementById('users-list');

let allUsers = [];

function renderUsers(list) {
    usersList.innerHTML = '';
    
    if (list.length === 0) {
        const noMatchItem = document.createElement('li');
        noMatchItem.textContent = 'No users match your filter.';
        usersList.appendChild(noMatchItem);
        return;
    }
    
    list.forEach(user => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';

        const nameSpan = document.createElement('strong');
        nameSpan.textContent = user.name;

        const detailsSpan = document.createElement('span');
        detailsSpan.textContent = ` - ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

        li.appendChild(nameSpan);
        li.appendChild(detailsSpan);
        usersList.appendChild(li);
    });
}

async function fetchUsers() {
    try {
        loadButton.disabled = true;
        statusMsg.textContent = 'Loading users...';
        statusMsg.style.color = 'blue';
        usersList.innerHTML = ''; 

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        allUsers = await response.json();
        
        statusMsg.textContent = 'Users loaded successfully!';
        statusMsg.style.color = 'green';

        renderUsers(allUsers);

    } catch (error) {
        statusMsg.textContent = `Failed to load users: ${error.message}`;
        statusMsg.style.color = 'red';
        allUsers = [];
        usersList.innerHTML = ''; 
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener('click', fetchUsers);

filterInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    renderUsers(filteredUsers);
});
