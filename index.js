// Wait for the page to fully load before attaching events
window.onload = function () {

  // Attach click events to both buttons
  document.getElementById("analyzeBtn").addEventListener("click", analyzeText);
  document.getElementById("bmiBtn").addEventListener("click", calculateBMI);

};

// ── Function 1: Count Vowels and Consonants ──
function analyzeText() {
  var input = document.getElementById("sentenceInput").value;
  var resultDiv = document.getElementById("textResult");

  // Check that the user typed something
  if (input.trim() === "") {
    alert("Please enter a sentence first.");
    return;
  }

  var vowels = 0;
  var consonants = 0;
  var vowelList = "aeiouAEIOU";

  // Loop through every character in the sentence
  for (var i = 0; i < input.length; i++) {
    var ch = input[i];

    // Only count letters, skip spaces and punctuation
    if (ch.match(/[a-zA-Z]/)) {
      if (vowelList.indexOf(ch) !== -1) {
        vowels++;
      } else {
        consonants++;
      }
    }
  }

  // Display the results
  document.getElementById("vowelLine").textContent = "Vowels: " + vowels;
  document.getElementById("consonantLine").textContent = "Consonants: " + consonants;
  resultDiv.classList.remove("hidden");
}

// ── Function 2: Calculate BMI ──
function calculateBMI() {
  var weight = parseFloat(document.getElementById("weight").value);
  var feet   = parseFloat(document.getElementById("heightFt").value);
  var inches = parseFloat(document.getElementById("heightIn").value);
  var resultDiv = document.getElementById("bmiResult");

  // Validate inputs
  if (isNaN(weight) || weight <= 0) {
    alert("Please enter a valid weight.");
    return;
  }
  if (isNaN(feet) || feet <= 0) {
    alert("Please enter a valid height in feet.");
    return;
  }
  if (isNaN(inches)) {
    inches = 0;
  }

  // Convert height to total inches
  var totalInches = (feet * 12) + inches;

  // BMI formula for imperial units: (weight / height^2) x 703
  var bmi = (weight / (totalInches * totalInches)) * 703;
  var bmiRounded = Math.round(bmi * 10) / 10;

  // Display the result
  document.getElementById("bmiLine").textContent = "Your BMI: " + bmiRounded;
  resultDiv.classList.remove("hidden");
}
