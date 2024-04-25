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
    qn,
    question,
    components = [],
    hint,
    hintOpted = 0,
    comp;

async function getScore() {
    await users
        .doc(userDoc)
        .get()
        .then((doc) => {
            score = doc.data().score;
            qn = doc.data().r3q;
            hintOpted = doc.data().hintViewed;
        });
    await questions
        .doc(`${qn}`)
        .get()
        .then((doc) => {
            question = doc.data().question;
            components = doc.data().comp;
            hint = doc.data().hint;
        });
}

const questionPara = document.getElementById("question");
const componentsList = document.getElementById("components");
const hintBtn = document.getElementById("hint");
const hintImage = document.getElementById("hint-image");
const scoreBtn = document.getElementById("score");

async function displayQuestion() {
    await getScore();
    questionPara.textContent = question;
    if (hintOpted) {
        hintImage.setAttribute("src", hint);
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
hintBtn.addEventListener("click", async () => {
    if (!hintOpted) {
        hintOpted = 1;
        score = score - 5;
        scoreBtn.value = `Score: ${score}`;
        hintImage.setAttribute("src", hint);
        await users.doc(userDoc).set(
            {
                hintViewed: hintOpted,
            },
            { merge: true }
        );
        await users.doc(userDoc).update({
            score: score,
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
