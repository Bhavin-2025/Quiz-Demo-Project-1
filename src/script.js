const questions = [
  {
    question: "What does HTML stands for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking Text Module Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },

  {
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-style", "color", "text-color"],
    correctAnswer: "color",
  },
  {
  question: "Which HTML tag is used to create a hyperlink?",
  options: ["<a>", "<link>", "<href>", "<nav>"],
  correctAnswer: "<a>",
},

{
  question: "Which of the following is used to apply styles to HTML?",
  options: ["JavaScript", "Python", "CSS", "HTML"],
  correctAnswer: "CSS",
},

{
  question: "Which JavaScript method is used to write into the browser console?",
  options: ["console.log()", "print()", "log.console()", "write.console()"],
  correctAnswer: "console.log()",
},

{
  question: "What is the correct way to link an external CSS file in HTML?",
  options: [
    "<link rel='stylesheet' href='style.css'>",
    "<style src='style.css'>",
    "<css link='style.css'>",
    "<script src='style.css'>"
  ],
  correctAnswer: "<link rel='stylesheet' href='style.css'>",
},

{
  question: "What does DOM stand for in JavaScript?",
  options: [
    "Document Object Model",
    "Display Output Method",
    "Document Oriented Module",
    "Data Object Management"
  ],
  correctAnswer: "Document Object Model",
}

  
];

currentQuestionIndex = 0;
let selectedAnswer = [];
let score = 0;
let skippedCount = 0;

let timeleft = 10;
let timer;


// Below are the references that will be update in UI
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const questionCount = document.getElementById("question-count");

// rendering the current question and option

function renderQuestion() {
    timeleft = 10;
    document.getElementById("timer").textContent = `Time:${timeleft}s`;

    clearInterval(timer);

    timer = setInterval(()=>{
        timeleft--;
        document.getElementById("timer").textContent = `Time: ${timeleft}s`;
        
        if(timeleft===0){
            clearInterval(timer);
            handleNext();
        }
    },1000);
  const questionObj = questions[currentQuestionIndex];

  questionElement.textContent = questionObj.question;
  questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;

  optionsContainer.innerHTML = "";
//   creating a button for each option

  questionObj.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className =
      "w-full text-left px-4 py-2 border rounded bg-white hover:bg-blue-100";
    button.addEventListener("click", () => {
      selectOption(button, option);
    });
    optionsContainer.append(button);
  });
}

// Handles  when a user selects an option
function selectOption(selectedBtn, selectedValue) {
  const allOptionButtons = optionsContainer.querySelectorAll("button");

  allOptionButtons.forEach((btn) => {
    btn.classList.remove("bg-blue-300", "ring", "ring-blue-400");
  });

  selectedBtn.classList.add("bg-blue-300", "ring", "ring-blue-400");

  selectedAnswer[currentQuestionIndex] = selectedValue;

  document.getElementById("next-btn").disabled = false;
}

const nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", handleNext);

function handleNext() {
   if (!selectedAnswer[currentQuestionIndex]) {
    skippedCount++;
  }
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    renderQuestion();
    nextBtn.disabled = true;
  }

  if (currentQuestionIndex == questions.length - 1) {
    nextBtn.classList.add("hidden");

    document.getElementById("submit-btn").classList.remove("hidden");
  }
}
// displaying result
function showResults() {
document.getElementById("timer").classList.add("hidden");
    // clearInterval(timer);
  nextBtn.classList.add("hidden");
  document.getElementById("submit-btn").classList.add("hidden");

    score = 0;
  questions.forEach((q, i) => {
    if (selectedAnswer[i] === q.correctAnswer) {
      score++;
    }
  });

    questionElement.innerHTML = `
    <div class="text-2xl font-bold mb-2">Quiz Completed!</div>
    <div class="text-lg font-semibold text-green-600">✅ Your Score: ${score} / ${questions.length}</div>
    <div class="text-lg font-semibold text-yellow-500">⚠️ Skipped: ${skippedCount}</div>
  `;

  optionsContainer.innerHTML = "";

  questions.forEach((question, index) => {
    let questionBlock = document.createElement("div");
    questionBlock.classList.add("p-4", "border", "rounded", "bg-gray-50", "mb-4");
    const questionTitle = document.createElement("h3");
    questionTitle.textContent = `${index+1}. ${question.question} `;
     questionTitle.className = "font-semibold mb-2";
     questionBlock.appendChild(questionTitle);
      optionsContainer.appendChild(questionBlock);

    question.options.forEach(option => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = option;
        optionDiv.className = "px-4 py-2 rounded mt-1"

        if(option ===question.correctAnswer){
            optionDiv.classList.add("bg-green-200");
        }
        if(selectedAnswer[index]===option && option!==question.correctAnswer){
            optionDiv.classList.add("bg-red-200")
        }
        questionBlock.appendChild(optionDiv);
    })
  });
}
document.getElementById("submit-btn").addEventListener("click", showResults);
window.addEventListener("DOMContentLoaded", renderQuestion);
