const checkboxes = document.querySelectorAll(".privacy-checkbox");

const progressNumber = document.getElementById("progressNumber");
const progressRing = document.getElementById("progressRing");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");

const statusMessage = document.getElementById("statusMessage");
const resultsButton = document.getElementById("resultsButton");
const resetButton = document.getElementById("resetButton");

const resultsPanel = document.getElementById("resultsPanel");
const resultsIcon = document.getElementById("resultsIcon");
const resultsTitle = document.getElementById("resultsTitle");
const resultsText = document.getElementById("resultsText");
const reviewButton = document.getElementById("reviewButton");


const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const totalItems = checkboxes.length;


function getCompletedCount() {
    return document.querySelectorAll(
        ".privacy-checkbox:checked"
    ).length;
}


function updateProgressRingTheme(percentage) {
    const isDark = document.body.classList.contains("dark-mode");

    const centreColour = isDark ? "#172536" : "#ffffff";
    const remainingColour = isDark ? "#35465a" : "#dce7f0";

    progressRing.style.background = `
        radial-gradient(
            circle,
            ${centreColour} 63%,
            transparent 65%
        ),
        conic-gradient(
            var(--teal) ${percentage}%,
            ${remainingColour} ${percentage}%
        )
    `;
}

// Update checklist progress
function updateProgress() {
    const completed = getCompletedCount();
    const percentage = totalItems > 0
        ? (completed / totalItems) * 100
        : 0;

    progressNumber.textContent = `${completed}/${totalItems}`;


    updateProgressRingTheme(percentage);

    progressRing.setAttribute(
        "aria-label",
        `${completed} of ${totalItems} checklist items completed`
    );

    progressFill.style.width = `${percentage}%`;

    progressBar.setAttribute("aria-valuenow", completed);

    statusMessage.textContent =
        `You have completed ${completed} of ${totalItems} tips.`;

    if (!resultsPanel.hidden) {
        showResults();
    }
}

// Display the results
function showResults() {
    const completed = getCompletedCount();
    const remaining = totalItems - completed;

    resultsPanel.hidden = false;

    if (completed === totalItems) {
        resultsIcon.textContent = "✓";
        resultsTitle.textContent = "Excellent work!";

        resultsText.textContent =
            "You've completed all five privacy tips. " +
            "Keep practising these habits and follow your " +
            "organisation's policies to help protect patient data.";

    } else if (completed === 0) {
        resultsIcon.textContent = "!";
        resultsTitle.textContent = "Let's get started";

        resultsText.textContent =
            "You haven't completed any tips yet. " +
            "Review the checklist above and tick each item " +
            "once you've reviewed the advice.";

    } else {
        resultsIcon.textContent = "✓";
        resultsTitle.textContent = "Good progress!";

        resultsText.textContent =
            `You've reviewed ${completed} out of ${totalItems} tips. ` +
            `${remaining} ${remaining === 1 ? "tip remains" : "tips remain"}. ` +
            "Continue reviewing the checklist to cover all five topics.";
    }
}

// Reset the checklist
function resetChecklist() {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    resultsPanel.hidden = true;

    updateProgress();

    statusMessage.textContent =
        `Checklist reset. You have completed 0 of ${totalItems} tips.`;

    document.getElementById("checklist").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function reviewChecklist() {
    document.getElementById("checklist").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (checkboxes.length > 0) {
        checkboxes[0].focus({ preventScroll: true });
    }
}


checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateProgress);
});

// Show results when requested
resultsButton.addEventListener("click", () => {
    showResults();

    resultsPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});


resetButton.addEventListener("click", resetChecklist);
reviewButton.addEventListener("click", reviewChecklist);


function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeText.textContent = isDark ? "Light mode" : "Dark mode";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.setAttribute("aria-pressed", String(isDark));

    // Refresh the progress ring after changing the theme
    updateProgress();
}


const savedTheme = localStorage.getItem("patientPrivacyTheme");

applyTheme(savedTheme === "dark");


themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);

    localStorage.setItem(
        "patientPrivacyTheme",
        isDark ? "dark" : "light"
    );
});


updateProgress();