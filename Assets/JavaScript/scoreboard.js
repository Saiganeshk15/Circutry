firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const scores = db.collection("score");
const table = document.querySelector("table");

async function updateScores() {
    await scores.orderBy("score", "desc").onSnapshot((snapshot) => {
        table.innerHTML = `<tr>
        <th>Participant 1</th>
        <th>Participant 2</th>
        <th>Score</th>
    </tr>`;
        snapshot.forEach((doc) => {
            const tr = document.createElement("tr");
            if (doc.data().p2 == doc.id) {
                tr.innerHTML = `<td>${doc.id}</td><td>-</td><td>${
                    doc.data().score
                }</td>`;
            } else {
                tr.innerHTML = `<td>${doc.id}</td><td>${
                    doc.data().p2
                }</td><td>${doc.data().score}</td>`;
                // <td>${
                //     String(doc.data().timeStamp.toDate()).split(" ")[4]
                // }</td>
            }
            table.appendChild(tr);
        });
    });
}
updateScores();
