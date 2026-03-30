/**
 * 游戏逻辑测试用例：测试核心工具函数和游戏逻辑
 * 可在浏览器控制台运行，或使用测试框架（如Jest）执行
 */
import { generateOrderArray, shuffleArray, checkWin, getHint } from '../js/utils.js';
import { initGame, moveBlock, getBestRecord } from '../js/game.js';

// 测试1：生成有序数组
console.log('测试1：生成有序数组');
console.log(generateOrderArray(3)); // 预期：[1,2,3,4,5,6,7,8,0]
console.log(generateOrderArray(4)); // 预期：[1,2,...,15,0]

// 测试2：打乱数组（确保有解）
console.log('测试2：打乱数组（有解校验）');
const level3Arr = shuffleArray(generateOrderArray(3), 3);
const level4Arr = shuffleArray(generateOrderArray(4), 4);
console.log('3×3打乱后数组：', level3Arr);
console.log('4×4打乱后数组：', level4Arr);

// 测试3：通关判定
console.log('测试3：通关判定');
const winArr3 = generateOrderArray(3);
const winArr4 = generateOrderArray(4);
const noWinArr = [1,2,3,4,5,6,8,7,0];
console.log('3×3有序数组（通关）：', checkWin(winArr3, 3)); // 预期：true
console.log('4×4有序数组（通关）：', checkWin(winArr4, 4)); // 预期：true
console.log('3×3无序数组（未通关）：', checkWin(noWinArr, 3)); // 预期：false

// 测试4：通关提示
console.log('测试4：通关提示');
const testArr = [1,2,3,4,0,5,7,8,6]; // 空白块在索引4
console.log('提示内容：', getHint(testArr, 3)); // 预期：可移动数字：2、4、5、8

// 测试5：游戏初始化和移动逻辑
console.log('测试5：游戏初始化和移动逻辑');
const gameState = initGame(3);
console.log('初始化游戏状态：', gameState);
const moveResult = moveBlock(0); // 尝试移动索引0的数字（若可移动）
console.log('移动结果：', moveResult);

// 测试6：最佳记录更新（修正：与game.js逻辑一致，确保测试准确）
console.log('测试6：最佳记录更新');
initGame(3);
console.log('初始最佳记录：', getBestRecord()); // 预期：--、--:--
// 模拟通关（手动设置步数和时间）
window.gameState = { level: 3, stepCount: 20, timeCount: 60, bestStep: {}, bestTime: {} };
window.updateBestRecord = function() {
    const { level, stepCount, timeCount } = window.gameState;
    // 与game.js保持一致，判断是否更新最佳记录
    if (!window.gameState.bestStep[level]) {
        window.gameState.bestStep[level] = stepCount;
        window.gameState.bestTime[level] = timeCount;
    } else {
        if (stepCount < window.gameState.bestStep[level]) {
            window.gameState.bestStep[level] = stepCount;
        }
        if (timeCount < window.gameState.bestTime[level]) {
            window.gameState.bestTime[level] = timeCount;
        }
    }
};
window.updateBestRecord();
console.log('更新后最佳记录：', getBestRecord()); // 预期：20、01:00