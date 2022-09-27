let question = 0;
let timer_id;
document.getElementById("question_no").innerText = (question + 1).toString();

function resetSelection() {
    document.getElementById("A").classList.remove("border-2", "border-red-600");
    document.getElementById("B").classList.remove("border-2", "border-red-600");
    document.getElementById("C").classList.remove("border-2", "border-red-600");
    document.getElementById("D").classList.remove("border-2", "border-red-600");
}

function chooseAnswer(opt) {
    localStorage.setItem(`${code}_question_${question + 1}`, opt);
    resetSelection()
    document.getElementById(opt).classList.add("border-2", "border-red-600");
}

function startTimer(code, question) {
    localStorage.setItem(`${code}_question_${question}_time`, new Date());
}

function timer(seconds, question) {
    let time = seconds;
    let timer = setInterval(function () {
        document.getElementById("timer").innerText = time.toString();
        if (time <= 0) {
            clearInterval(timer);
            document.getElementById("timeOut").classList.remove("hidden");
            document.getElementById("quiz_box").classList.add("hidden");
            localStorage.setItem(`${code}_question_${question}_timer`, "timeOut");
        }
        time--;
    }, 1000);
    timer_id = timer
}

function resetTimer() {
    clearInterval(timer_id);
    document.getElementById("timeOut").classList.add("hidden");
    document.getElementById("quiz_box").classList.remove("hidden");
}

function endTimer(code, question) {
    let end_time = new Date()
    let start_time = new Date(localStorage.getItem(`${code}_question_${question}_time`));
    localStorage.removeItem(`${code}_question_${question}_time`);
    let time_taken = new Date(end_time - start_time).toISOString().slice(11, 19);
    localStorage.setItem(`${code}_question_${question}_time`, time_taken);
    return { start: start_time, end: end_time, time: time_taken };
}

function showQuestion(no) {
    let question_number = no + 1;

    if (question_number != 1) endTimer(code, question_number - 1) && resetTimer();


    if (question_number > questions[code].questions.length) { localStorage.setItem(`${code}_end`, new Date()); window.location.href = `/stats.html?code=${code}` };
    document.getElementById("question_image").src = questions[code].questions[no].img;
    document.getElementById("question_no").innerText = question_number.toString()

    if (localStorage.getItem(`${code}_question_${question_number}_timer`) === "timeOut") {
        document.getElementById("timeOut").classList.remove("hidden");
        document.getElementById("quiz_box").classList.add("hidden");
        clearInterval(timer_id);
        return
    }

    startTimer(code, question_number);
    timer(questions[code].questions[no].time, question_number);

    resetSelection();
    if (localStorage.getItem(`${code}_question_${question_number}`) !== null) {
        document.getElementById(localStorage.getItem(`${code}_question_${question_number}`)).classList.add("border-2", "border-red-600");
    }
}

function nextQuestion() {
    showQuestion(++question);
}