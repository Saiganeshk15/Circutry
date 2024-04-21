firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userDoc = localStorage.getItem("userDoc");

const users = db.collection("users");
const questions = db.collection("round3");
const team = users.doc(userDoc).get();

team.then((doc) => {
    if (doc.data().route == "Round3.html") {
    } else {
        window.location.replace(doc.data().route);
    }
});
