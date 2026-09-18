// Danh sách màn chơi
const levels = [
    // MÀN 0: Tutorial (Hướng dẫn - 1 thùng)
    [
        "######",
        "# @$.#",
        "######"
    ],
    // MÀN 1: Cấp 1 (Dễ - 2 thùng)
    [
        "#######",
        "# @   #",
        "# $ $ #",
        "# . . #",
        "#     #",
        "#######"
    ],
    // MÀN 2: Cấp 2 (Tư duy xíu - 3 thùng)
    [
        "#########",
        "#   #   #",
        "# @ $ . #",
        "# # $ # #",
        "#   $ . #",
        "#   .   #",
        "#########"
    ],
    // MÀN 3: Cấp 3 (Khó - 4 thùng)
    [
        "  ###### ",
        "###  @ # ",
        "# $ #$ # ",
        "# . .  # ",
        "##$## ## ",
        "# . $  # ",
        "#   .  # ",
        "######## "
    ]
];

let currentLevelIndex = 0;
let map = [];
let playerPos = { r: 0, c: 0 };
let moveHistory = [];
let ytPlayer = null;
let gameStarted = false;
let levelCompleted = false;

// YouTube player được dùng cho nhạc ở màn cuối.
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '3Y6vx9wdGJc',
        playerVars: { playsinline: 1 }
    });
}

function playSFX(id) {
    if (id === 'sfx-birthday') {
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
        }
        return;
    }

    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

function loadLevel(levelIdx) {
    if (!Number.isInteger(levelIdx) || levelIdx < 0 || levelIdx >= levels.length) return;

    currentLevelIndex = levelIdx;
    map = levels[levelIdx].map(row => row.split(''));
    const maxCols = Math.max(...map.map(row => row.length));
    map.forEach(row => {
        while (row.length < maxCols) row.push(' ');
    });

    moveHistory = [];
    levelCompleted = false;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === '@' || map[r][c] === '+') {
                playerPos = { r, c };
            }
        }
    }

    renderMap();
}

function renderMap() {
    const board = document.getElementById('board');
    if (!board || map.length === 0) return;

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${map[0].length}, 32px)`;

    map.forEach(row => row.forEach(char => {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const classes = {
            '#': ['wall'],
            '.': ['target'],
            '$': ['box'],
            '*': ['box-on-target'],
            '@': ['player', 'floor'],
            '+': ['player-on-target'],
            ' ': ['floor']
        };
        cell.classList.add(...(classes[char] || classes[' ']));
        board.appendChild(cell);
    }));
}

function saveState() {
    moveHistory.push({
        map: map.map(row => [...row]),
        playerPos: { ...playerPos }
    });
}

function handleMove(dr, dc) {
    if (!gameStarted || levelCompleted) return;

    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[nr].length) return;

    const targetCell = map[nr][nc];
    if (targetCell === '#') return;

    if (targetCell === ' ' || targetCell === '.') {
        saveState();
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';
        playSFX('sfx-step');
    } else if (targetCell === '$' || targetCell === '*') {
        const boxNr = nr + dr;
        const boxNc = nc + dc;
        if (boxNr < 0 || boxNr >= map.length || boxNc < 0 || boxNc >= map[boxNr].length) return;

        const boxTargetCell = map[boxNr][boxNc];
        if (boxTargetCell !== ' ' && boxTargetCell !== '.') return;

        saveState();
        map[boxNr][boxNc] = boxTargetCell === '.' ? '*' : '$';
        map[nr][nc] = targetCell === '*' ? '+' : '@';
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        playSFX('sfx-push');
    } else {
        return;
    }

    renderMap();
    checkWin();
}

function undoMove() {
    if (!gameStarted || moveHistory.length === 0) return;
    const lastState = moveHistory.pop();
    map = lastState.map;
    playerPos = lastState.playerPos;
    levelCompleted = false;
    renderMap();
}

function restartLevel() {
    if (gameStarted) loadLevel(currentLevelIndex);
}

function changeLevel(idx) {
    if (gameStarted) loadLevel(Number.parseInt(idx, 10));
}

function checkWin() {
    if (map.some(row => row.includes('$'))) return;
    levelCompleted = true;

    const isGameCompleted = currentLevelIndex === levels.length - 1;
    playSFX(isGameCompleted ? 'sfx-birthday' : 'sfx-win');

    setTimeout(() => showWinModal(isGameCompleted), 300);
}

function showWinModal(isGameCompleted) {
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const button = document.getElementById('modalBtn');
    const modal = document.getElementById('winModal');
    if (!title || !message || !button || !modal) return;

    title.textContent = isGameCompleted ? '🎂 Chiến thắng!' : '🎉 Chiến thắng!';
    message.textContent = isGameCompleted
        ? 'Chúc mừng sinh nhật chị Minh Hạnh!!'
        : 'Bạn đã chiến thắng!';
    button.textContent = isGameCompleted ? 'Chơi lại' : 'Màn tiếp theo';
    button.dataset.completed = String(isGameCompleted);
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('winModal');
    const button = document.getElementById('modalBtn');
    if (!modal || !button) return;

    modal.classList.add('hidden');
    if (button.dataset.completed === 'true') {
        restartLevel();
        return;
    }

    currentLevelIndex = Math.min(currentLevelIndex + 1, levels.length - 1);
    const select = document.getElementById('levelSelect');
    if (select) select.value = String(currentLevelIndex);
    loadLevel(currentLevelIndex);
}

function startGame() {
    gameStarted = true;
    const modal = document.getElementById('startModal');
    if (modal) modal.classList.add('hidden');
}

document.addEventListener('keydown', event => {
    const keyMap = {
        ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
        ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
        ArrowLeft: [0, -1], a: [0, -1], A: [0, -1],
        ArrowRight: [0, 1], d: [0, 1], D: [0, 1]
    };
    const direction = keyMap[event.key];
    if (direction) {
        event.preventDefault();
        handleMove(...direction);
    }
});

window.addEventListener('load', () => loadLevel(0));
