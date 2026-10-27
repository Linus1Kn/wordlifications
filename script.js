async function getWordler() {
    try {
        const response = await fetch(
            "https://random-word-api.herokuapp.com/word?number=1&length=15"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const words = await response.json();
        return words[0].toLowerCase();
    } catch (error) {
        console.error("Failed to fetch word:", error);
        return null;
    }
}

getWordler().then((ANSWER) => {
    if (!ANSWER) {
        document.getElementById("message").textContent =
            "Failed to load the word. Please refresh.";
        return;
    }

    const container = document.getElementById("rowContainer");
    const message = document.getElementById("message");

    let guess = "";
    let cards = [];
    let won = false;

    function addRow() {
        const row = document.createElement("div");
        row.className = "card-row";
        cards = [];

        for (let i = 0; i < ANSWER.length; i++) {
            const card = document.createElement("div");
            card.className = "card";
            row.appendChild(card);
            cards.push(card);
        }

        container.appendChild(row);
        row.scrollIntoView({ block: "nearest" });
    }

    function showGuess() {
        cards.forEach((card, i) => {
            card.textContent = guess[i] || "";
            card.classList.toggle("written", i < guess.length);
        });
    }

    function score(guess) {
        const result = Array(ANSWER.length).fill("none");
        const remaining = {};

        for (let i = 0; i < ANSWER.length; i++) {
            if (guess[i] === ANSWER[i]) {
                result[i] = "correct";
            } else {
                remaining[ANSWER[i]] =
                    (remaining[ANSWER[i]] || 0) + 1;
            }
        }

        for (let i = 0; i < ANSWER.length; i++) {
            if (result[i] === "correct") continue;

            if (remaining[guess[i]] > 0) {
                result[i] = "close";
                remaining[guess[i]]--;
            }
        }

        return result;
    }

    function submit() {
        if (guess.length !== ANSWER.length) {
            message.textContent =
                `Guess must be ${ANSWER.length} letters.`;
            return;
        }

        const result = score(guess);

        cards.forEach((card, i) => {
            card.classList.remove("written");
            card.classList.add(result[i]);
        });

        if (guess === ANSWER) {
            won = true;
            message.textContent = "You got it!";
            return;
        }

        guess = "";
        message.textContent = "";
        addRow();
    }

    document.addEventListener("keydown", (e) => {
        if (won || e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === "Enter") {
            submit();
        } else if (e.key === "Backspace") {
            guess = guess.slice(0, -1);
            message.textContent = "";
            showGuess();
        } else if (
            /^[a-z]$/i.test(e.key) &&
            guess.length < ANSWER.length
        ) {
            guess += e.key.toLowerCase();
            message.textContent = "";
            showGuess();
        }
    });

    addRow();
});

const menu = document.getElementById("menu");
const playButton = document.getElementById("playButton");

playButton.addEventListener("click", function (e) {
    menu.classList.add("closed")
})