firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userDoc = localStorage.getItem("userDoc");

const users = db.collection("users");
const questions = db.collection("round3");
const team = users.doc(userDoc).get();
const scoreCol = db.collection("score");

team.then((doc) => {
    if (doc.data().route == "Round3.html") {
    } else {
        window.location.replace(doc.data().route);
    }
});
let score,
    qn = [],
    question,
    currentQuestion,
    components = [],
    hint,
    hintOpted = [],
    scores = [],
    comp;

async function getScore() {
    await users
        .doc(userDoc)
        .get()
        .then((doc) => {
            score = doc.data().score;
            qn = doc.data().r3q;
            hintOpted = doc.data().hintViewed;
            scores = doc.data().r3score;
        });
}

const questionPara = document.getElementById("question");
const componentsList = document.getElementById("components");
const hintBtn = document.getElementById("hint");
const hintImage = document.getElementById("hint-image");
const scoreBtn = document.getElementById("score");
const saveNextBtn = document.getElementById("save-next");
const input = document.querySelector(".input-group");
const form = document.querySelector("form[name=passkey]");
const passkey = document.querySelector("input[name=r1]");
const war = document.getElementById("w1");
let request = 0;

async function displayQuestion() {
    if (!request) {
        await getScore();
        request = 1;
    }
    console.log(qn, hintOpted, scores, score);
    if (scores.indexOf(0) == -1) {
        currentQuestion = 3;
        for (var i = 0; i < 4; i++) {
            document.getElementById(`q${i + 1}`).style.backgroundColor = "#0f0";
        }
    } else {
        currentQuestion = scores.indexOf(0);
    }
    for (var i = 0; i < currentQuestion; i++) {
        document.getElementById(`q${i + 1}`).style.backgroundColor = "#0f0";
    }
    input.style.display = "none";
    war.style.display = "none";
    await questions
        .doc(`${qn[currentQuestion]}`)
        .get()
        .then((doc) => {
            question = doc.data().question;
            components = doc.data().comp;
            hint = doc.data().hint;
        });
    questionPara.textContent = `${currentQuestion + 1}. ${question}`;
    if (hintOpted[currentQuestion]) {
        hintImage.setAttribute("src", hint);
    } else {
        hintImage.setAttribute("src", "");
    }
    scoreBtn.value = `Score: ${score}`;
    componentsList.innerHTML = "";
    components.forEach((component) => {
        comp = document.createElement("li");
        comp.textContent = ` ${component}`;
        componentsList.appendChild(comp);
    });
}
displayQuestion();

saveNextBtn.addEventListener("click", () => {
    input.style.display = "block";
});
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (currentQuestion < 3) {
        if (passkey.value != "123") {
            war.style.display = "block";
        } else {
            scores[currentQuestion] = 1;
            await scoreCol.doc(userDoc).update({
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                score: score + 1,
            });
            await users.doc(userDoc).update({
                score: score + 1,
                r3score: scores,
            });
            score = score + 1;
            form.reset();
            displayQuestion();
        }
    } else {
        if (passkey.value != "123") {
            war.style.display = "block";
        } else {
            if (scores[currentQuestion] == 0) {
                scores[currentQuestion] = 1;
                currentQuestion += 1;
                await scoreCol.doc(userDoc).update({
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    score: score + 1,
                });
                await users.doc(userDoc).update({
                    score: score + 1,
                    r3score: scores,
                });
                score = score + 1;
            }
        }
        form.reset();
        alert("You have qualified for Round 4.");
        displayQuestion();
    }
});

hintBtn.addEventListener("click", async () => {
    if (hintOpted[currentQuestion] == 0) {
        hintOpted[currentQuestion] = 1;
        score = score - 5;
        scoreBtn.value = `Score: ${score}`;
        hintImage.setAttribute("src", hint);
        await users.doc(userDoc).update({
            score: score,
            hintViewed: hintOpted,
            r3score: scores,
        });
        await scoreCol.doc(userDoc).update({
            score: score,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }
    displayQuestion();
});

const images = document.querySelectorAll(".img");
images.forEach((img) => {
    img.addEventListener("click", async (e) => {
        img.classList.toggle("zoom");
    });
});
