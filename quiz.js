const questions = [
	{
		question: "At what ages is education compulsory in France?",
		answers: ["Ages 3 to 16", "Ages 5 to 14", "Ages 6 to 18"],
		correct: 0,
		explanation: "Education is compulsory in France from age 3 to 16."
	},
	{
		question: "Which school stage is for children aged 3 to 6?",
		answers: ["Lycée", "École maternelle", "Collège"],
		correct: 1,
		explanation: "École maternelle is the preschool stage, generally from ages 3 to 6."
	},
	{
		question: "What is collège?",
		answers: ["Higher education", "Primary school", "Lower secondary school"],
		correct: 2,
		explanation: "Collège is lower secondary school, generally for ages 11 to 15."
	},
	{
		question: "What is le bac?",
		answers: ["A qualification usually taken at the end of lycée", "The first year of primary school", "A school holiday"],
		correct: 0,
		explanation: "Le bac is short for the baccalauréat, a major qualification at the end of lycée."
	},
	{
		question: "Which routes can students choose at lycée?",
		answers: ["General, technological, or vocational", "Only university preparation", "Primary, middle, or advanced"],
		correct: 0,
		explanation: "Students can follow general, technological, or vocational studies."
	}
];

function getElement(id) {
	const element = document.getElementById(id);
	if (!element) {
		throw new Error(`Quiz is missing the #${id} element.`);
	}
	return element;
}

const count = getElement("quiz-count");
const scoreLabel = getElement("quiz-score");
const progress = getElement("quiz-progress-fill");
const progressBar = progress.parentElement;
const questionHeading = getElement("quiz-question");
const optionsContainer = getElement("quiz-options");
const feedback = getElement("quiz-feedback");
const nextButton = getElement("quiz-next");
const restartButton = getElement("quiz-restart");

if (!progressBar) {
	throw new Error("Quiz progress bar is missing its container.");
}

let currentQuestion = 0;
let score = 0;

function updateProgress(value) {
	progress.style.width = `${(value / questions.length) * 100}%`;
	progressBar.setAttribute("aria-valuenow", String(value));
}

function finishQuiz() {
	count.textContent = "Complete";
	questionHeading.textContent = `You scored ${score} out of ${questions.length}!`;
	questionHeading.focus();
	optionsContainer.replaceChildren();
	feedback.className = "quiz-feedback";
	feedback.textContent = score === questions.length
		? "Excellent work — you know your way around the French school system."
		: "Nice work. Review the stages above and try again to improve your score.";
	nextButton.hidden = true;
	restartButton.hidden = false;
	updateProgress(questions.length);
}

function renderQuestion() {
	const item = questions[currentQuestion];
	count.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
	scoreLabel.textContent = `Score: ${score}`;
	questionHeading.textContent = item.question;
	feedback.className = "quiz-feedback";
	feedback.textContent = "";
	optionsContainer.replaceChildren();
	nextButton.hidden = true;
	restartButton.hidden = true;
	updateProgress(currentQuestion + 1);

	item.answers.forEach((answer, answerIndex) => {
		const button = document.createElement("button");
		button.className = "quiz-option";
		button.type = "button";
		button.textContent = answer;
		button.addEventListener("click", () => selectAnswer(button, answerIndex));
		optionsContainer.append(button);
	});
}

function selectAnswer(selectedButton, answerIndex) {
	const item = questions[currentQuestion];
	const isCorrect = answerIndex === item.correct;

	if (isCorrect) {
		score += 1;
		scoreLabel.textContent = `Score: ${score}`;
	}

	optionsContainer.querySelectorAll("button").forEach((button, index) => {
		button.disabled = true;
		if (index === item.correct) {
			button.classList.add("is-correct");
		}
	});

	if (!isCorrect) {
		selectedButton.classList.add("is-incorrect");
	}

	feedback.className = `quiz-feedback is-${isCorrect ? "correct" : "incorrect"}`;
	feedback.textContent = `${isCorrect ? "Correct!" : "Not quite."} ${item.explanation}`;
	nextButton.textContent = currentQuestion === questions.length - 1 ? "See your result" : "Next question";
	nextButton.hidden = false;
	nextButton.focus();
}

nextButton.addEventListener("click", () => {
	currentQuestion += 1;
	if (currentQuestion === questions.length) {
		finishQuiz();
		return;
	}
	renderQuestion();
	questionHeading.focus();
});

restartButton.addEventListener("click", () => {
	currentQuestion = 0;
	score = 0;
	renderQuestion();
	questionHeading.focus();
});

renderQuestion();
