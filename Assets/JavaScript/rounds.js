firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userDoc = localStorage.getItem("userDoc");

const users = db.collection("users");
const questions = db.collection("round1");
const team = users.doc(userDoc).get();
team.then((doc) => {
    if (doc.data().route == "Round.html") {
    } else {
        window.location.replace(doc.data().route);
    }
});

let arr,
    arr1 = [],
    score,
    value = "0",
    image,
    checked = [],
    scores = [];
async function getScore() {
    await team.then((doc) => {
        arr = doc.data().r1q;
        score = doc.data().r1score;
        checked = doc.data().r1checked;
        scores = doc.data().r1scores;
    });
}

function colorChanger() {
    var count = 0;
    checked.forEach((e) => {
        if (e) {
            document.getElementById(`q${count + 1}`).style.backgroundColor =
                "#0f0";
        }
        count++;
    });
}

const form = document.querySelector("form");
const input = document.querySelectorAll('input[name="options"]');
const saveBtn = document.getElementById("save");
const nxtBtn = document.getElementById("next");
const submitBtn = document.getElementById("submit");
const saveNextBtn = document.getElementById("save-next");
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
    if (currentQuestion == 14) {
        saveNextBtn.value = "Save & Submit";
    } else {
        saveNextBtn.value = "Save & Next";
    }
    if (request == 0) {
        await getScore();
        request = 1;
        colorChanger();
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
                questionText.textContent = doc.data().question;
                questionNo.textContent = currentQuestion + 1;
                questionImage.setAttribute("src", doc.data().image);
                opt1.textContent = doc.data()[1];
                opt2.textContent = doc.data()[2];
                opt3.textContent = doc.data()[3];
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

//Save Button
saveBtn.addEventListener("click", async (e) => {
    checked[currentQuestion] = value;
    console.log(value);
    if (value == "0") {
        alert("Select a valid option.");
        return;
    } else if (value == image) {
        if (scores[currentQuestion]) {
        } else {
            score += 1;
        }
        scores[currentQuestion] = 1;
        await users.doc(userDoc).update({
            r1scores: scores,
            r1checked: checked,
            r1score: score,
        });
    } else {
        if (scores[currentQuestion] == 1) {
            scores[currentQuestion] = 0;
            score -= 1;
            await users.doc(userDoc).update({
                r1scores: scores,
                r1checked: checked,
                r1score: score,
            });
        }
    }
    colorChanger();
    value = "0";
});

//nextBtn or form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    if (currentQuestion < 14) {
        currentQuestion = currentQuestion + 1;
        displayQuestion();
    } else {
        currentQuestion = 0;
        displayQuestion();
    }
});

//Save & Next Button
saveNextBtn.addEventListener("click", async (e) => {
    if (currentQuestion == 14) {
        checked[currentQuestion] = value;
        console.log(value);
        if (value == "0") {
            alert("Select a valid option.");
            return;
        } else if (value == image) {
            if (scores[currentQuestion]) {
            } else {
                score += 1;
            }
            scores[currentQuestion] = 1;
            await users.doc(userDoc).update({
                r1scores: scores,
                r1checked: checked,
                r1score: score,
            });
        } else {
            if (scores[currentQuestion] == 1) {
                scores[currentQuestion] = 0;
                score -= 1;
                await users.doc(userDoc).update({
                    r1scores: scores,
                    r1checked: checked,
                    r1score: score,
                });
            }
        }
        colorChanger();
        value = "0";
        checked.forEach((check) => {
            if (!check) {
                flag = 1;
            }
        });
        if (flag) {
            alert(`Attemp all the questions.`);
        } else if (score >= 12) {
            await users.doc(userDoc).update({
                r1score: score,
                r1checked: checked,
                r1scores: scores,
                score: score,
                route: "Round2.html",
            });
            while (arr1.length < 10) {
                var r = Math.floor(Math.random() * 10) + 1;
                if (arr1.indexOf(r) === -1) arr1.push(r);
            }
            await users.doc(userDoc).set(
                {
                    r2q: arr1,
                    r2score: 0,
                    r2scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    r2checked: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                { merge: true }
            );
            alert(`Your score is ${score}. You are quilifed for Round 2.`);
            await users
                .doc(userDoc)
                .get()
                .then((doc) => {
                    window.location.replace(doc.data().route);
                });
        } else {
            alert(
                `You score is ${score}. Acquire a minimum score of 12 to reach next level.`
            );
        }
    } else {
        checked[currentQuestion] = value;
        if (value == "0") {
            alert("Select a valid option.");
            return;
        } else if (value == image) {
            if (scores[currentQuestion]) {
            } else {
                score += 1;
            }
            scores[currentQuestion] = 1;
            await users.doc(userDoc).update({
                r1scores: scores,
                r1checked: checked,
                r1score: score,
            });
        } else {
            if (scores[currentQuestion] == 1) {
                scores[currentQuestion] = 0;
                score -= 1;
                await users.doc(userDoc).update({
                    r1scores: scores,
                    r1checked: checked,
                    r1score: score,
                });
            }
        }
        colorChanger();
        value = "0";
        e.preventDefault();
        form.reset();
        if (currentQuestion < 14) {
            currentQuestion = currentQuestion + 1;
            displayQuestion();
        } else {
            currentQuestion = 0;
            displayQuestion();
        }
    }
});

let flag = 0;
submitBtn.addEventListener("click", async (e) => {
    checked.forEach((check) => {
        if (!check) {
            flag = 1;
        }
    });
    if (flag) {
        alert(`Attemp all the questions.`);
    } else if (score >= 12) {
        await users.doc(userDoc).update({
            r1score: score,
            r1checked: checked,
            r1scores: scores,
            score: score,
            route: "Round2.html",
        });
        while (arr1.length < 10) {
            var r = Math.floor(Math.random() * 10) + 1;
            if (arr1.indexOf(r) === -1) arr1.push(r);
        }
        await users.doc(userDoc).set(
            {
                r2q: arr1,
                r2score: 0,
                r2scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                r2checked: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            { merge: true }
        );
        alert(`Your score is ${score}. You are quilifed for Round 2`);
        await users
            .doc(userDoc)
            .get()
            .then((doc) => {
                window.location.replace(doc.data().route);
            });
    } else {
        alert(
            `You score is ${score}. Acquire a minimum score of 12 to reach next level.`
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
const images = document.querySelectorAll(".img");
images.forEach((img) => {
    img.addEventListener("click", async (e) => {
        img.classList.toggle("zoom");
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
