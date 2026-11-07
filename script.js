let currentUser = null;
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;

// ১. লগইন বা গেস্ট হ্যান্ডেল করার ফাংশন
function loginAsGuest() {
    currentUser = { name: "Guest User", role: "guest" };
    loadMenu();
}

function login() {
    const userInp = document.getElementById('username').value;
    const passInp = document.getElementById('password').value;

    if (userInp === "admin" && passInp === "admin123") {
        currentUser = { name: "System Admin", role: "admin" };
    } else if (userInp !== "") {
        currentUser = { name: userInp, role: "user" };
    } else {
        alert("Please enter a username!");
        return;
    }
    loadMenu();
}

function logout() {
    currentUser = null;
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('hidden');
}

function loadMenu() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Hello, ${currentUser.name}`;

    // যদি অ্যাডমিন হয় তবেই অ্যাডমিন প্যানেল বাটন দেখাবে
    if (currentUser.role === "admin") {
        document.getElementById('admin-btn').classList.remove('hidden');
    } else {
        document.getElementById('admin-btn').classList.add('hidden');
    }
}

// ২. পেজ পরিবর্তনের নেভিগেশন ফাংশন
function showAdminPanel() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('hidden');
}

function backToMenu() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

// ৩. নতুন গেম ও কন্টিনিউ গেম লজিক
function startNewGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    updateBoard();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('status').innerText = `Turn: Player ${currentPlayer}`;
}

function continueGame() {
    const saved = localStorage.getItem('savedGame');
    if (saved) {
        const data = JSON.parse(saved);
        boardState = data.board;
        currentPlayer = data.player;
        gameActive = true;
        updateBoard();
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('status').innerText = `Resumed Game | Turn: Player ${currentPlayer}`;
    } else {
        alert("No saved game found!");
    }
}

function makeMove(index) {
    if (boardState[index] === "" && gameActive) {
        boardState[index] = currentPlayer;
        // গেমের বর্তমান অবস্থা ব্রাউজারে অটো সেভ হয়ে থাকে (Continue ফিচারের জন্য)
        localStorage.setItem('savedGame', JSON.stringify({ board: boardState, player: currentPlayer }));
        
        updateBoard();
        checkWinner();
        if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            document.getElementById('status').innerText = `Turn: Player ${currentPlayer}`;
        }
    }
}

function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = boardState[i];
    }
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            document.getElementById('status').innerText = `Player ${boardState[a]} Wins!`;
            gameActive = false;
            localStorage.removeItem('savedGame');
            return;
        }
    }

    if (!boardState.includes("")) {
        document.getElementById('status').innerText = "Game Tied!";
        gameActive = false;
        localStorage.removeItem('savedGame');
    }
}