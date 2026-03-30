/**
 * 入口文件：DOM操作、事件绑定、页面切换，串联整个游戏流程
 * 依赖game.js核心逻辑，不处理具体游戏业务
 */
import { initGame, startTimer, moveBlock, getGameHint, getBestRecord, getCurrentGameState, stopTimer } from './game.js';

// DOM元素获取（一次性获取，避免重复查询）
const difficultyPage = document.getElementById('difficultyPage');
const gamePage = document.getElementById('gamePage');
const winModal = document.getElementById('winModal');
const hintModal = document.getElementById('hintModal');

const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const gameBoard = document.getElementById('gameBoard');
const stepCountEl = document.getElementById('stepCount');
const timeCountEl = document.getElementById('timeCount');
const hintBtn = document.getElementById('hintBtn');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backBtn');
const restartSameBtn = document.getElementById('restartSameBtn');
const changeDiffBtn = document.getElementById('changeDiffBtn');
const currentStepEl = document.getElementById('currentStep');
const currentTimeEl = document.getElementById('currentTime');
const bestStepEl = document.getElementById('bestStep');
const bestTimeEl = document.getElementById('bestTime');
const hintTextEl = document.getElementById('hintText');
const closeHintBtn = document.getElementById('closeHintBtn');

// 1. 渲染棋盘（根据游戏状态渲染数字块）
function renderBoard(gameState) {
    const { level, currentArr } = gameState;
    // 设置棋盘网格布局（根据难度动态调整列数）
    gameBoard.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    // 清空棋盘
    gameBoard.innerHTML = '';

    // 渲染每个数字块
    currentArr.forEach((num, index) => {
        const block = document.createElement('div');
        block.className = `game-block ${num === 0 ? 'empty' : ''}`;
        block.dataset.index = index; // 存储当前块的索引，用于点击事件
        if (num !== 0) {
            block.textContent = num;
            // 绑定点击事件（移动数字块）
            block.addEventListener('click', handleBlockClick);
        }
        gameBoard.appendChild(block);
    });
}

// 2. 数字块点击事件处理
function handleBlockClick(e) {
    const index = parseInt(e.target.dataset.index);
    const moveResult = moveBlock(index);
    if (!moveResult) return; // 不可移动，直接返回

    // 更新步数和棋盘
    stepCountEl.textContent = moveResult.stepCount;
    renderBoard({
        level: getCurrentGameState().level,
        currentArr: moveResult.currentArr
    });

    // 若通关，显示通关弹窗
    if (moveResult.isWin) {
        showWinModal();
    }
}

// 3. 难度选择按钮事件（修正计时回调，解决本地测试耗时不更新问题）
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const level = parseInt(btn.dataset.level);
        // 初始化游戏
        const gameState = initGame(level);
        // 渲染棋盘
        renderBoard(gameState);
        // 更新步数和时间
        stepCountEl.textContent = gameState.stepCount;
        timeCountEl.textContent = gameState.timeCount;
        // 切换页面
        difficultyPage.style.display = 'none';
        gamePage.style.display = 'flex';
        // 开始计时（传入回调，实时更新耗时DOM）
        startTimer((formattedTime) => {
            timeCountEl.textContent = formattedTime;
        });
    });
});

// 4. 通关提示按钮事件
hintBtn.addEventListener('click', () => {
    const hint = getGameHint();
    hintTextEl.textContent = hint;
    hintModal.style.display = 'flex';
});

// 关闭提示弹窗
closeHintBtn.addEventListener('click', () => {
    hintModal.style.display = 'none';
});

// 5. 重新开始按钮事件（修正计时回调）
resetBtn.addEventListener('click', () => {
    const level = getCurrentGameState().level;
    const gameState = initGame(level);
    renderBoard(gameState);
    stepCountEl.textContent = gameState.stepCount;
    timeCountEl.textContent = gameState.timeCount;
    // 重新开始计时
    startTimer((formattedTime) => {
        timeCountEl.textContent = formattedTime;
    });
});

// 6. 返回难度选择按钮事件
backBtn.addEventListener('click', () => {
    stopTimer();
    difficultyPage.style.display = 'flex';
    gamePage.style.display = 'none';
});

// 7. 通关弹窗 - 再来一局按钮事件（修正计时回调）
restartSameBtn.addEventListener('click', () => {
    winModal.style.display = 'none';
    const level = getCurrentGameState().level;
    const gameState = initGame(level);
    renderBoard(gameState);
    stepCountEl.textContent = gameState.stepCount;
    timeCountEl.textContent = gameState.timeCount;
    startTimer((formattedTime) => {
        timeCountEl.textContent = formattedTime;
    });
});

// 8. 通关弹窗 - 切换难度按钮事件
changeDiffBtn.addEventListener('click', () => {
    winModal.style.display = 'none';
    stopTimer();
    difficultyPage.style.display = 'flex';
    gamePage.style.display = 'none';
});

// 9. 显示通关弹窗
function showWinModal() {
    const { stepCount, timeCount } = getCurrentGameState();
    const { bestStep, bestTime } = getBestRecord();
    currentStepEl.textContent = stepCount;
    currentTimeEl.textContent = timeCount;
    bestStepEl.textContent = bestStep;
    bestTimeEl.textContent = bestTime;
    winModal.style.display = 'flex';
}

// 10. 适配iPad横竖屏切换（重新渲染棋盘）
window.addEventListener('orientationchange', () => {
    const currentState = getCurrentGameState();
    renderBoard({
        level: currentState.level,
        currentArr: initGame(currentState.level).currentArr
    });
});