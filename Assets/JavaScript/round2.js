firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userDoc = localStorage.getItem("userDoc");

const users = db.collection("users");
const questions = db.collection("round2");
const team = users.doc(userDoc).get();

team.then((doc) => {
    if (doc.data().route == "Round2.html") {
    } else {
        window.location.replace(doc.data().route);
    }
});

let arr,
    r1score,
    score,
    value = "0",
    image,
    checked = [],
    scores = [];
async function getScore() {
    await team.then((doc) => {
        arr = doc.data().r2q;
        score = doc.data().r2score;
        checked = doc.data().r2checked;
        scores = doc.data().r2scores;
        r1score = doc.data().score;
    });
}

const form = document.querySelector("form");
const input = document.querySelectorAll('input[name="options"]');
const saveBtn = document.getElementById("save");
const nxtBtn = document.getElementById("next");
const submitBtn = document.getElementById("submit");
const questionNo = document.getElementById("qno");
const questionText = document.getElementById("question");
const questionImage = document.getElementById("que-img");
const opt1 = document.getElementById("op1");
const opt2 = document.getElementById("op2");
const opt3 = document.getElementById("op3");
const opt4 = document.getElementById("op4");
let currentQuestion = 0;
let request = 0;

async function displayQuestion() {
    if (request == 0) {
        await getScore();
        request = 1;
    }
    if (checked[currentQuestion]) {
        document.getElementById(checked[currentQuestion]).checked = true;
        value = checked[currentQuestion];
    }
    await questions
        .doc(String(arr[currentQuestion]))
        .get()
        .then((doc) => {
            if (doc.exists) {
                if (
                    arr[currentQuestion] == 2 ||
                    arr[currentQuestion] == 8 ||
                    arr[currentQuestion] == 10
                ) {
                    opt1.innerHTML = "";
                    opt2.innerHTML = "";
                    opt3.innerHTML = "";
                    opt1.innerHTML = doc.data()[1];
                    opt2.innerHTML = doc.data()[2];
                    opt3.innerHTML = doc.data()[3];
                } else {
                    opt1.textContent = doc.data()[1];
                    opt2.textContent = doc.data()[2];
                    opt3.textContent = doc.data()[3];
                }
                questionText.textContent = doc.data().question;
                questionNo.textContent = currentQuestion + 1;
                questionImage.setAttribute("src", doc.data().image);
                opt4.textContent = doc.data()[4];
                image = doc.data().ca;
            } else {
                alert(`Error loading data. Contact Organizer.`);
            }
        })
        .catch((error) => {
            alert(error.message);
        });
}
displayQuestion();
input.forEach((el) => {
    el.addEventListener("click", (e) => {
        value = e.target.value;
    });
});

//save button
saveBtn.addEventListener("click", async (e) => {
    checked[currentQuestion] = value;
    if (value == "0") {
        alert("Select a valid option next");
        return;
    } else if (value == image) {
        if (scores[currentQuestion]) {
        } else {
            score += 1;
        }
        scores[currentQuestion] = 1;
        await users.doc(userDoc).update({
            r2scores: scores,
            r2checked: checked,
            r2score: score,
        });
    } else {
        if (scores[currentQuestion] == 1) {
            scores[currentQuestion] = 0;
            score -= 1;
            await users.doc(userDoc).update({
                r2scores: scores,
                r2checked: checked,
                r2score: score,
            });
        }
    }
});

//nextBtn or form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    if (currentQuestion < 9) {
        currentQuestion = currentQuestion + 1;
        displayQuestion();
    } else {
        currentQuestion = 0;
        displayQuestion();
    }
});

let flag = 0;
submitBtn.addEventListener("click", async (e) => {
    checked.forEach((checked) => {
        if (!checked) {
            flag = 1;
        }
    });
    if (flag) {
        alert("Attemp all the questions");
    } else if (score >= 7) {
        await users.doc(userDoc).update({
            r2score: score,
            r2checked: checked,
            r2scores: scores,
            score: r1score + score,
            route: "Round3.html",
        });
        //round3 question decider
        await users.doc(userDoc).set(
            {
                r3q: Math.floor(Math.random() * 4) + 1,
            },
            { merge: true }
        );
        alert(`Your score is ${score}. You are quilifed for Round 3`);
        await users
            .doc(userDoc)
            .get()
            .then((doc) => {
                window.location.replace(doc.data().route);
            });
    } else {
        alert(
            `You score is ${score}. Acquire a minimum score of 7 to reach next level.`
        );
    }
});

document.querySelectorAll(".circle").forEach((el) => {
    el.addEventListener("click", () => {
        form.reset();
        currentQuestion = el.textContent - 1;
        displayQuestion();
    });
});
//uncomment to disable developer tools
// document.addEventListener("contextmenu", (event) => {
//     event.preventDefault();
//     alert("The right click has been disabled.");
// });
// document.addEventListener("keydown", function (event) {
//     if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
//         event.preventDefault();
//         alert("The shortcut Ctrl+Shift+I has been disabled.");
//     }
// });
