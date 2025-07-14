 let quizEnded = false;
document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      question: "What does HTML stand for?",
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
  ];

  let currentQuestionIndex = 0;
  let selectedAnswer = [];
  let score = 0;
  let skippedCount = 0;
  let userDetails = {};
  let timeleft = 10;
  let timer;

 

  let detectionInterval; // 🧠 store interval so we can stop it later

  const startBtn = document.getElementById("start-btn");
  const startContainer = document.getElementById("start-container");
  const quizContainer = document.getElementById("quiz-container");
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const questionCount = document.getElementById("question-count");
  const timerElement = document.getElementById("timer");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const submitBtn = document.getElementById("submit-btn");

  const inputs = [
    document.getElementById("user-name"),
    document.getElementById("college-name"),
    document.getElementById("roll-number"),
    document.getElementById("batch-year"),
    document.getElementById("dob"),
    document.getElementById("experience"),
  ];

  function checkInputsFilled() {
    const allFilled = inputs.every((input) => input.value.trim() !== "");
    startBtn.disabled = !allFilled;
    startBtn.classList.toggle("opacity-50", !allFilled);
    startBtn.classList.toggle("cursor-not-allowed", !allFilled);
  }

  inputs.forEach((input) => input.addEventListener("input", checkInputsFilled));

  startBtn.addEventListener("click", () => {
    userDetails = {
      name: inputs[0].value.trim(),
      college: inputs[1].value.trim(),
      roll: inputs[2].value.trim(),
      batch: inputs[3].value.trim(),
      dob: inputs[4].value.trim(),
      experience: inputs[5].value.trim(),
    };

    startContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    renderQuestion();
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
    }
  });

  function renderQuestion() {
    clearInterval(timer);
    timeleft = 10;
    timerElement.textContent = `Time: ${timeleft}s`;

    timer = setInterval(() => {
      timeleft--;
      timerElement.textContent = `Time: ${timeleft}s`;
      if (timeleft === 0) {
        clearInterval(timer);
        handleNext();
      }
    }, 1000);

    const questionObj = questions[currentQuestionIndex];
    questionElement.textContent = questionObj.question;
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${
      questions.length
    }`;
    optionsContainer.innerHTML = "";

    questionObj.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.className =
        "w-full text-left px-4 py-2 border rounded bg-white hover:bg-blue-100";
      button.addEventListener("click", () => selectOption(button, option));
      optionsContainer.appendChild(button);
    });

    nextBtn.disabled = !selectedAnswer[currentQuestionIndex];
  }

  function selectOption(selectedBtn, selectedValue) {
    const allButtons = optionsContainer.querySelectorAll("button");
    allButtons.forEach((btn) =>
      btn.classList.remove("bg-blue-300", "ring", "ring-blue-400")
    );
    selectedBtn.classList.add("bg-blue-300", "ring", "ring-blue-400");
    selectedAnswer[currentQuestionIndex] = selectedValue;
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener("click", handleNext);

  function handleNext() {
    if (!selectedAnswer[currentQuestionIndex]) skippedCount++;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      renderQuestion();
      nextBtn.disabled = true;
    }

    if (currentQuestionIndex === questions.length - 1) {
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    }

    prevBtn.classList.toggle("hidden", currentQuestionIndex === 0);

    const savedAnswer = selectedAnswer[currentQuestionIndex];
    if (savedAnswer) {
      const optionButtons = optionsContainer.querySelectorAll("button");
      optionButtons.forEach((btn) => {
        if (btn.textContent === savedAnswer) {
          btn.classList.add("bg-blue-300", "ring", "ring-blue-400");
        }
      });
      nextBtn.disabled = false;
    }
  }

  submitBtn.addEventListener("click", showResults);

  function showResults() {
    quizEnded = true;
    // ✅ Stop the webcam after submission
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
    }
    // ✅ Stop face detection loop
    clearInterval(detectionInterval);

    document.getElementById("webcam").classList.add("hidden");
    document.getElementById("warning").classList.add("hidden");

    // Hide entire progress bar container
    const progressContainer = document.querySelector(
      ".flex.justify-between.items-center.bg-gray-50"
    );
    if (progressContainer) {
      progressContainer.classList.add("hidden");
    }

    questionCount.classList.add("hidden");

    clearInterval(timer);
    nextBtn.classList.add("hidden");
    submitBtn.classList.add("hidden");
    prevBtn.classList.add("hidden");
    timerElement.classList.add("hidden");
    questionCount.classList.add("hidden"); // ✅ hide question count

    score = 0;
    questions.forEach((q, i) => {
      if ((selectedAnswer[i] || "").trim() === q.correctAnswer.trim()) {
        score++;
      }
    });

    const passThreshold = Math.ceil(questions.length * 0.5);
    const isPassed = score >= passThreshold;
    const passText = isPassed ? "✅ Passed" : "❌ Failed";
    const passColor = isPassed ? "text-green-600" : "text-red-600";

    questionElement.innerHTML = `
      <div class="text-2xl font-bold mb-2">Quiz Completed!</div>
      <div class="text-lg font-semibold ${passColor}">${passText}</div>
      <div class="text-lg font-semibold text-green-600">Your Score: ${score} / ${questions.length}</div>
      <div class="text-lg font-semibold text-yellow-500">Skipped: ${skippedCount}</div>
    `;

    optionsContainer.innerHTML = "";

    const printBtn = document.createElement("button");
    printBtn.textContent = "🖨️ Print Result";
    printBtn.className =
      "mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow";
    printBtn.addEventListener("click", generatePrintableResult);
    optionsContainer.appendChild(printBtn);

    questions.forEach((question, index) => {
      const questionBlock = document.createElement("div");
      questionBlock.className = "p-4 border rounded bg-gray-50 mb-4";

      const questionTitle = document.createElement("h3");
      questionTitle.textContent = `${index + 1}. ${question.question}`;
      questionTitle.className = "font-semibold mb-2";
      questionBlock.appendChild(questionTitle);

      question.options.forEach((option) => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = option;
        optionDiv.className = "px-4 py-2 rounded mt-1";

        if (option === question.correctAnswer) {
          optionDiv.classList.add("bg-green-200");
        }

        if (
          selectedAnswer[index] === option &&
          option !== question.correctAnswer
        ) {
          optionDiv.classList.add("bg-red-200");
        }

        questionBlock.appendChild(optionDiv);
      });

      optionsContainer.appendChild(questionBlock);
    });
  }

  function generatePrintableResult() {
    const printWindow = window.open("", "_blank");

    const totalQuestions = questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    const isPassed = score >= Math.ceil(totalQuestions * 0.5);

    const htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <title>Quiz Result</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #f9f9f9; }
          .certificate {
            max-width: 850px;
            margin: auto;
            background: white;
            padding: 40px 50px;
            border-radius: 12px;
            border: 1px solid #ccc;
            box-shadow: 0 0 25px rgba(0,0,0,0.08);
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-height: 100px;
            border-radius: 10px;
          }
          h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 26px;
            color: #2c3e50;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
          }
          .info, .summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0px 40px;
            font-size: 15px;
          }
          .summary .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            background-color: ${isPassed ? "#27ae60" : "#e74c3c"};
            color: white;
            font-weight: 600;
          }
          .questions { margin-top: 30px; }
          .questions h2 {
            font-size: 20px;
            margin-bottom: 20px;
            color: #2c3e50;
          }
          .question-block {
            background: #fefefe;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 18px 20px;
            margin-bottom: 20px;
          }
          .question-block strong {
            font-size: 16px;
            display: block;
            margin-bottom: 2px;
          }
          .correct { color: green; font-weight: bold; }
          .wrong { color: red; font-weight: bold; }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 13px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">
            <img src="https://media.designrush.com/agencies/461126/conversions/Sarvadhi-Solutions-logo-profile.jpg" />
          </div>
          <h1>Quiz Completion Certificate</h1>
          <div class="info">
            <p><strong>Full Name:</strong> ${userDetails.name}</p>
            <p><strong>College Name:</strong> ${userDetails.college}</p>
            <p><strong>Roll Number:</strong> ${userDetails.roll}</p>
            <p><strong>Batch Year:</strong> ${userDetails.batch}</p>
            <p><strong>Date of Birth:</strong> ${userDetails.dob}</p>
            <p><strong>Experience:</strong> ${userDetails.experience}</p>
          </div>
          <div class="summary">
            <p><strong>Score:</strong> ${score} / ${totalQuestions}</p>
            <p><strong>Percentage:</strong> ${percentage}%</p>
            <p><strong>Status:</strong> <span class="badge">${
              isPassed ? "Passed ✅" : "Failed ❌"
            }</span></p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="questions">
            <h2>Question-wise Analysis:</h2>
            ${questions
              .map((q, i) => {
                const userAns = selectedAnswer[i] || "Not Answered";
                const isCorrect = userAns === q.correctAnswer;
                return `
                <div class="question-block">
                  <strong>${i + 1}. ${q.question}</strong>
                  <div><strong>Your Answer:</strong> ${userAns}</div>
                  <div><strong>Correct Answer:</strong> ${q.correctAnswer}</div>
                  <div class="${isCorrect ? "correct" : "wrong"}">
                    ${isCorrect ? "✔ Correct" : "❌ Incorrect"}
                  </div>
                </div>`;
              })
              .join("")}
          </div>
          <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        </div>
      </body>
    </html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  }
});
// 👇 Load face-api.js models and start camera
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
]).then(startCamera);

// 👇 Start camera and begin face detection loop

let webcamStream; // 🌐 store webcam stream globally

function startCamera() {
  const video = document.getElementById("webcam");
  const warning = document.getElementById("warning");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      webcamStream = stream;
      video.srcObject = stream;
      video.classList.remove("hidden");
      detectFace(video, warning);
    })
    .catch((err) => {
      console.error("Camera access denied or error", err);
      warning.textContent = "⚠️ Please allow camera access to proceed.";
      warning.classList.remove("hidden");
    });
}

// 👇 Detect if face is present every 1s

// function detectFace(video, warning) {
  detectionInterval = setInterval(async () => {
    if (quizEnded) return; // ✅ Do nothing if quiz ended

    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());

    if (!detection) {
      warning.style.opacity = 1;
      warning.classList.remove('hidden');
    } else {
      warning.style.opacity = 0;
      setTimeout(() => {
        if (!quizEnded) {
          warning.classList.add('hidden');
        }
      }, 300);
    }
  }, 1000);
// }

function detectFace(video, warning) {
  detectionInterval = setInterval(async () => {
    if (quizEnded) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection) {
      // No face at all
      warning.textContent = "⚠️ Face not detected! Please stay visible.";
      warning.style.opacity = 1;
      warning.classList.remove("hidden");
      return;
    }

    // Get key landmark points
    const landmarks = detection.landmarks;
    const nose = landmarks.getNose(); // nose[3] is the tip
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const noseX = nose[3].x; // tip of nose
    const leftEyeX = leftEye[0].x;
    const rightEyeX = rightEye[3].x;

    const faceCenterX = (leftEyeX + rightEyeX) / 2;
    const offset = Math.abs(noseX - faceCenterX);

    // 🎯 If nose tip is too far from the center between eyes, user is not facing straight
    const isLookingAway = offset > 20; // you can fine-tune this threshold

    if (isLookingAway) {
      warning.textContent = "⚠️ Please face the screen directly!";
      warning.style.opacity = 1;
      warning.classList.remove("hidden");
    } else {
      warning.style.opacity = 0;
      setTimeout(() => {
        if (!quizEnded) {
          warning.classList.add("hidden");
        }
      }, 300);
    }
  }, 1000);
}

