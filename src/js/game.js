/**
 * 游戏核心逻辑模块：封装游戏业务逻辑，解耦DOM操作
 * 依赖utils.js工具函数，提供对外暴露的方法供index.js调用
 */
import { generateOrderArray, shuffleArray, checkWin, getHint, formatTime } from './utils.js';

// 游戏核心状态（私有变量，不对外暴露）
let gameState = {
    level: 3, // 默认难度（3×3）
    currentArr: [], // 当前数字数组
    stepCount: 0, // 当前步数
    timeCount: 0, // 当前耗时（秒）
    timer: null, // 计时定时器
    bestStep: {}, // 各难度最短步数（当前会话，不缓存）
    bestTime: {} // 各难度最短耗时（当前会话，不缓存）
};

// 1. 游戏初始化：根据难度生成棋盘
export function initGame(level = 3) {
    // 重置游戏状态
    gameState.level = level;
    gameState.stepCount = 0;
    gameState.timeCount = 0;
    clearInterval(gameState.timer);

    // 生成有序数组并打乱
    const orderArr = generateOrderArray(level);
    gameState.currentArr = shuffleArray(orderArr, level);

    // 返回当前游戏状态，供index.js渲染DOM
    return {
        level: gameState.level,
        currentArr: gameState.currentArr,
        stepCount: gameState.stepCount,
        timeCount: formatTime(gameState.timeCount)
    };
}

// 2. 开始计时（修正：直接更新时间，适配本地测试）
export function startTimer(updateTimeCallback) {
    gameState.timer = setInterval(() => {
        gameState.timeCount++;
        // 回调函数更新DOM，避免定时器回调return无效问题
        updateTimeCallback(formatTime(gameState.timeCount));
    }, 1000);
}

// 3. 停止计时
export function stopTimer() {
    clearInterval(gameState.timer);
}

// 4. 数字块移动逻辑
export function moveBlock(index) {
    const { level, currentArr } = gameState;
    const emptyIndex = currentArr.indexOf(0);
    const adjacentIndices = getAdjacentIndices(emptyIndex, level);

    // 判断当前点击的数字块是否可移动（是否在空白块相邻位置）
    if (!adjacentIndices.includes(index)) return false;

    // 交换数字块和空白块位置
    [currentArr[emptyIndex], currentArr[index]] = [currentArr[index], currentArr[emptyIndex]];
    gameState.stepCount++; // 步数+1

    // 检查是否通关
    const isWin = checkWin(currentArr, level);
    if (isWin) {
        stopTimer();
        updateBestRecord(); // 更新最短步数、最短耗时
    }

    // 返回移动后的状态，供index.js更新DOM
    return {
        currentArr: [...currentArr],
        stepCount: gameState.stepCount,
        isWin: isWin,
        timeCount: formatTime(gameState.timeCount)
    };
}

// 辅助函数：获取空白块相邻索引（复用utils.js逻辑，避免重复导入）
function getAdjacentIndices(index, level) {
    const indices = [];
    const row = Math.floor(index / level);
    const col = index % level;
    if (row > 0) indices.push(index - level);
    if (row < level - 1) indices.push(index + level);
    if (col > 0) indices.push(index - 1);
    if (col < level - 1) indices.push(index + 1);
    return indices;
}

// 5. 更新最短记录（当前会话，不本地缓存）
function updateBestRecord() {
    const { level, stepCount, timeCount } = gameState;
    // 初始化当前难度的最佳记录（若不存在）
    if (!gameState.bestStep[level]) {
        gameState.bestStep[level] = stepCount;
        gameState.bestTime[level] = timeCount;
    } else {
        // 更新最短步数（更小则替换）
        if (stepCount < gameState.bestStep[level]) {
            gameState.bestStep[level] = stepCount;
        }
        // 更新最短耗时（更小则替换）
        if (timeCount < gameState.bestTime[level]) {
            gameState.bestTime[level] = timeCount;
        }
    }
}

// 6. 获取通关提示
export function getGameHint() {
    return getHint(gameState.currentArr, gameState.level);
}

// 7. 获取当前难度的最佳记录
export function getBestRecord() {
    const { level, bestStep, bestTime } = gameState;
    return {
        bestStep: bestStep[level] || '--',
        bestTime: bestTime[level] ? formatTime(bestTime[level]) : '--:--'
    };
}

// 8. 获取当前游戏状态（供index.js使用）
export function getCurrentGameState() {
    return {
        level: gameState.level,
        stepCount: gameState.stepCount,
        timeCount: formatTime(gameState.timeCount)
    };
}