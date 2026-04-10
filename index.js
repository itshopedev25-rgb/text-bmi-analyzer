// ── Helper: show error message ──
function showError(el, msg) {
  el.textContent = msg;
  el.classList.add("visible");
}

// ── Helper: clear error and result ──
function resetSection(errorId, resultId) {
  document.getElementById(errorId).classList.remove("visible");
  document.getElementById(resultId).classList.remove("visible");
}

// ── Section 1: Vowel & Consonant Counter ──
// Sends the sentence to the Claude API endpoint which counts vowels and consonants
async function analyzeText() {
  const btn       = document.getElementById("analyzeBtn");
  const errorEl   = document.getElementById("textError");
  const resultBox = document.getElementById("textResult");
  const text      = document.getElementById("sentenceInput").value.trim();

  resetSection("textError", "textResult");

  if (!text) {
    showError(errorEl, "Please enter a sentence before analyzing.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Analyzing...";

  try {
    // Send sentence to Claude API — Claude counts vowels and consonants and returns JSON
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Count the vowels and consonants in this text. Return ONLY raw JSON, no markdown, no explanation:
{"vowels": <number>, "consonants": <number>}

Rules: only count alphabetic letters (a-z, A-Z). Vowels = a, e, i, o, u (any case). All other letters = consonants.

Text: "${text}"`,
          },
        ],
      }),
    });

    const data  = await response.json();
    const raw   = data.content.map((block) => block.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Display the counts returned from the endpoint
    document.getElementById("vowelLine").textContent     = `Vowels: ${result.vowels}`;
    document.getElementById("consonantLine").textContent = `Consonants: ${result.consonants}`;
    resultBox.classList.add("visible");

  } catch (err) {
    showError(errorEl, "Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Analyze Text";
  }
}

// ── Section 2: BMI Calculator ──
// Formula: (weight in lbs / height in inches²) × 703
function calculateBMI() {
  const errorEl   = document.getElementById("bmiError");
  const resultBox = document.getElementById("bmiResult");

  resetSection("bmiError", "bmiResult");

  const weight = parseFloat(document.getElementById("weight").value);
  const feet   = parseFloat(document.getElementById("heightFt").value) || 0;
  const inches = parseFloat(document.getElementById("heightIn").value) || 0;

  if (!weight || weight <= 0) {
    showError(errorEl, "Please enter a valid weight.");
    return;
  }
  if (feet <= 0) {
    showError(errorEl, "Please enter a valid height in feet.");
    return;
  }

  const totalInches = feet * 12 + inches;
  const bmi         = (weight / (totalInches * totalInches)) * 703;
  const rounded     = Math.round(bmi * 10) / 10;

  document.getElementById("bmiLine").textContent = `Your BMI: ${rounded}`;
  resultBox.classList.add("visible");
}

// Press Enter in the text field to trigger analysis
document.getElementById("sentenceInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") analyzeText();
});
