firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const users = db.collection("users");
localStorage.clear();

let arr = [];
while (arr.length < 15) {
    var r = Math.floor(Math.random() * 15) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
}

let r1, r2, userDoc, route;
let w1 = document.querySelector("#w1");
let w2 = document.querySelector("#w2");
document
    .querySelector("form[name=login]")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        w1.classList.remove("war");
        w2.classList.remove("war");
        r1 = document.querySelector("input[name=r1]").value.toUpperCase();
        r2 = document.querySelector("input[name=r2]").value.toUpperCase();
        if (r1.length != 10) {
            w1.classList.add("war");
            return;
        }
        if (r2.length != 10) {
            w2.classList.add("war");
            return;
        }
        await users
            .where("p2", "==", r2)
            .get()
            .then((data) => {
                if (!data.empty) {
                    userDoc = data.docs[0].id;
                    localStorage.setItem("userDoc", userDoc);
                    window.location.replace(data.docs[0].data().route);
                    return;
                }
            });
        await users
            .where("p2", "==", r1)
            .get()
            .then((data) => {
                if (!data.empty) {
                    userDoc = data.docs[0].id;
                    localStorage.setItem("userDoc", userDoc);
                    window.location.replace(data.docs[0].data().route);
                    return;
                }
            });
        await users.doc(r1).set({
            p2: r2,
            route: "Round.html",
            r1q: arr,
            r1score: 0,
            score: 0,
            r1scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            r1checked: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
        localStorage.setItem("userDoc", r1);
        window.location.replace("Round.html");
    });
