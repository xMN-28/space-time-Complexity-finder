// DOM Elements
const codeInput = document.getElementById('code-input');
const languageSelect = document.getElementById('language');
const analyzeBtn = document.getElementById('analyze-btn');
const charCount = document.getElementById('char-count');
const loadingSection = document.getElementById('loading');
const errorSection = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const resultsSection = document.getElementById('results');

// Result elements
const resultSummary = document.getElementById('result-summary');
const timeNotation = document.getElementById('time-notation');
const timeExplanation = document.getElementById('time-explanation');
const spaceNotation = document.getElementById('space-notation');
const spaceExplanation = document.getElementById('space-explanation');
const suggestionsCard = document.getElementById('suggestions-card');
const resultSuggestions = document.getElementById('result-suggestions');

// Constants
const MAX_CHARS = 10000;

// Update character count
function updateCharCount() {
    const count = codeInput.value.length;
    charCount.textContent = `${count.toLocaleString()} / ${MAX_CHARS.toLocaleString()} characters`;
    
    if (count > MAX_CHARS) {
        charCount.classList.add('text-red-400');
        charCount.classList.remove('text-dark-500');
    } else {
        charCount.classList.remove('text-red-400');
        charCount.classList.add('text-dark-500');
    }
}

// Show/hide sections
function showSection(section) {
    loadingSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    if (section) {
        section.classList.remove('hidden');
    }
}

// Show error
function showError(message) {
    errorMessage.textContent = message;
    showSection(errorSection);
}

// Show results with animation
function showResults(data) {
    // Update content
    resultSummary.textContent = data.summary || 'No summary available';
    timeNotation.textContent = data.time_complexity?.notation || 'N/A';
    timeExplanation.textContent = data.time_complexity?.explanation || 'No explanation available';
    spaceNotation.textContent = data.space_complexity?.notation || 'N/A';
    spaceExplanation.textContent = data.space_complexity?.explanation || 'No explanation available';
    
    // Handle suggestions
    if (data.suggestions && data.suggestions.trim() && data.suggestions.toLowerCase() !== 'none') {
        resultSuggestions.textContent = data.suggestions;
        suggestionsCard.classList.remove('hidden');
    } else {
        suggestionsCard.classList.add('hidden');
    }
    
    // Show results section
    showSection(resultsSection);
    
    // Trigger animation
    setTimeout(() => {
        document.querySelectorAll('.result-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100);
        });
    }, 50);
}

// Reset result card animations
function resetResultCards() {
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.remove('show');
    });
}

// Analyze code
async function analyzeCode() {
    const code = codeInput.value.trim();
    const language = languageSelect.value;
    
    // Validation
    if (!code) {
        showError('Please enter some code to analyze.');
        return;
    }
    
    if (code.length > MAX_CHARS) {
        showError(`Code is too long. Maximum ${MAX_CHARS.toLocaleString()} characters allowed.`);
        return;
    }
    
    // Reset and show loading
    resetResultCards();
    showSection(loadingSection);
    analyzeBtn.disabled = true;
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to analyze code. Please try again.');
        }
        
        showResults(result.data);
        
    } catch (error) {
        console.error('Analysis error:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        analyzeBtn.disabled = false;
    }
}

// Event listeners
codeInput.addEventListener('input', updateCharCount);
analyzeBtn.addEventListener('click', analyzeCode);

// Handle Ctrl/Cmd + Enter to submit
codeInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        analyzeCode();
    }
});

// Handle Tab key for indentation
codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeInput.selectionStart;
        const end = codeInput.selectionEnd;
        
        // Insert 4 spaces
        codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end);
        
        // Move cursor after the inserted spaces
        codeInput.selectionStart = codeInput.selectionEnd = start + 4;
        updateCharCount();
    }
});

// Initialize
updateCharCount();

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
