/* --- Global Application Logic --- */

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on to initialize specific logic
    if (document.getElementById('feedbackForm')) {
        initializeFeedback();
    }
    
    if (document.getElementById('adminTableBody')) {
        loadAdminDashboard();
    }
});

/* --- 1. Navigation & UI Logic --- */

// Smooth Scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* --- 2. Portfolio Page Logic --- */

// Function to switch between Notion and GitHub instructions
function switchPath(path) {
    const notionPath = document.getElementById('notion-path');
    const githubPath = document.getElementById('github-path');
    const buttons = document.querySelectorAll('.tab-btn');

    if (path === 'notion') {
        notionPath.classList.add('active');
        githubPath.classList.remove('active');
    } else {
        notionPath.classList.remove('active');
        githubPath.classList.add('active');
    }

    // Update active button styling
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

/* --- 3. Feedback Form Logic --- */

function initializeFeedback() {
    const feedbackForm = document.getElementById('feedbackForm');
    const formContent = document.getElementById('formContent');
    const successMessage = document.getElementById('successMessage');

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture user input
        const feedbackData = {
            name: document.getElementById('studentName').value || "Anonymous Student",
            rating: document.getElementById('serviceRating').value,
            challenge: document.getElementById('challenge').value,
            suggestions: document.getElementById('suggestions').value,
            timestamp: new Date().toLocaleString()
        };

        // Save to Local Storage
        let allFeedback = JSON.parse(localStorage.getItem('brandBuilderFeedback')) || [];
        allFeedback.push(feedbackData);
        localStorage.setItem('brandBuilderFeedback', JSON.stringify(allFeedback));

        // UI Transition
        formContent.style.display = 'none';
        successMessage.style.display = 'block';

        // Redirect to Home after 3.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3500);
    });
}

/* --- 4. Admin Dashboard Logic --- */

function loadAdminDashboard() {
    const tableBody = document.getElementById('adminTableBody');
    const totalCountDisplay = document.getElementById('totalCount');
    
    // Retrieve data from Local Storage
    const data = JSON.parse(localStorage.getItem('brandBuilderFeedback')) || [];
    
    totalCountDisplay.innerText = data.length;
    tableBody.innerHTML = ''; 

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No feedback yet.</td></tr>';
        return;
    }

    // Render data rows (Newest first)
    data.reverse().forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.timestamp}</td>
            <td><strong>${entry.name}</strong></td>
            <td><span class="rating-badge">${entry.rating}/5</span></td>
            <td>${entry.challenge}</td>
            <td>${entry.suggestions}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function for Admin to clear data
function clearAllData() {
    if (confirm("Are you sure you want to delete all student feedback?")) {
        localStorage.removeItem('brandBuilderFeedback');
        loadAdminDashboard();
    }
}