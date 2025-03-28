// Function to handle navigation between "pages"
function navigateToPage(page) {
    const selectionBorder = document.getElementById('selection-border');
    const buttons = document.querySelectorAll('.banner button');
    const selectedButton = Array.from(buttons).find(button =>
        button.textContent.toLowerCase().includes(page.replace('-', ' '))
    );

    // Update the border to the selected button
    selectButton(selectedButton);

    // Update the URL without refreshing
    history.pushState({ page }, '', `/${page}`);

    // Fetch the page content dynamically
    fetch(`/${page}`)
        .then(response => response.text())
        .then(html => {
            // Create a temporary DOM parser to extract the `<main>` content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const mainContent = tempDiv.querySelector('main'); // Extract only the main content
            if (mainContent) {
                document.getElementById('content').innerHTML = mainContent.innerHTML;
            } else {
                console.error('Main content not found in the fetched HTML.');
            }
        })
        .catch(err => console.error('Error loading page:', err));
}

// Function to select a button
function selectButton(button) {
    const selectionBorder = document.getElementById('selection-border');

    // Get button's dimensions and position
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const buttonLeft = button.offsetLeft;
    const buttonTop = button.offsetTop;

    // Set selection border dimensions slightly larger than the button
    selectionBorder.style.width = `${buttonWidth + 10}px`; // 10px wider
    selectionBorder.style.height = `${buttonHeight + 6}px`; // 6px taller
    selectionBorder.style.left = `${buttonLeft - 5}px`; // Move 5px left
    selectionBorder.style.top = `${buttonTop - 3}px`; // Move 3px up
}

// Function to load dynamic content for each "page"
function loadPageContent(page) {
    const content = document.getElementById('content');
    switch (page) {
        case 'home':
            content.innerHTML = `
                <h2>Welcome to Matt's March Madness!</h2>
                <p>This is the main page. Use the buttons above to explore other sections!</p>`;
            break;
        case 'generate-bracket':
            content.innerHTML = `
                <h2>Generate Bracket</h2>
                <p>Create your bracket here by clicking the options above.</p>`;
            break;
        case 'score-bracket':
            content.innerHTML = `
                <h2>Score Bracket</h2>
                <p>Check the scores and analyze your bracket performance.</p>`;
            break;
        case 'analysis':
            content.innerHTML = `
                <h2>Analysis</h2>
                <p>Detailed analysis of the tournament and statistics.</p>`;
            break;
        case 'help':
            content.innerHTML = `
                <h2>Help</h2>
                <p>Need assistance? Click the buttons above to learn more.</p>`;
            break;
        default:
            content.innerHTML = `
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>`;
    }
}

// Function to sort the analysis table
function sortTable(columnName) {
    const table = document.getElementById('analysis-table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    rows.sort((a, b) => {
        // Get the value of the column for sorting
        const aValue = parseFloat(a.querySelector(`td:nth-child(${getColumnIndex(columnName)})`).textContent);
        const bValue = parseFloat(b.querySelector(`td:nth-child(${getColumnIndex(columnName)})`).textContent);

        // Sort descending by MELO
        return bValue - aValue;
    });

    // Clear the existing rows and append the sorted rows
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    rows.forEach(row => tbody.appendChild(row)); // Add sorted rows
}

function getColumnIndex(columnName) {
    const headerCells = document.querySelectorAll('#analysis-table thead th');
    return Array.from(headerCells).findIndex(th => th.textContent.trim() === columnName) + 1;
}

// Handle page load based on the current URL
window.onload = () => {
    const page = window.location.pathname.replace('/', '') || 'home';
    navigateToPage(page);
};

// Handle page resizing to ensure the border aligns with the buttons
window.onresize = () => {
    const currentPage = window.location.pathname.replace('/', '') || 'home';
    const buttons = document.querySelectorAll('.banner button');
    const selectedButton = Array.from(buttons).find(button =>
        button.textContent.toLowerCase().includes(currentPage.replace('-', ' '))
    );

    // Realign the border with the selected button
    if (selectedButton) {
        selectButton(selectedButton);
    }
};
