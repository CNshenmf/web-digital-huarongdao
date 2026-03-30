/**
 * 工具函数模块：封装通用功能，解耦核心逻辑
 * 包含：打乱算法、通关判定、提示逻辑、时间格式化
 */

// 1. 生成指定阶数的有序数字数组（如3×3生成[1,2,3,4,5,6,7,8,0]，0代表空白块）
export function generateOrderArray(level) {
    const length = level * level;
    const arr = [];
    for (let i = 1; i < length; i++) {
        arr.push(i);
    }
    arr.push(0); // 0表示空白块
    return arr;
}

// 2. 打乱数组（保证必有解，避免死局）
export function shuffleArray(arr, level) {
    const newArr = [...arr];
    const length = newArr.length;
    let emptyIndex = newArr.indexOf(0); // 空白块索引

    // 打乱逻辑：随机交换空白块相邻的数字，保证有解
    for (let i = 0; i < 100; i++) { // 打乱次数，可调整
        const adjacentIndices = getAdjacentIndices(emptyIndex, level);
        const randomIndex = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];
        // 交换空白块和相邻数字
        [newArr[emptyIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[emptyIndex]];
        emptyIndex = randomIndex;
    }

    // 校验是否有解（容错处理，避免极端情况）
    if (!isSolvable(newArr, level)) {
        // 无解则交换前两个非0数字，确保有解
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i] !== 0 && newArr[i+1] !== 0) {
                [newArr[i], newArr[i+1]] = [newArr[i+1], newArr[i]];
                break;
            }
        }
    }

    return newArr;
}

// 辅助函数：获取空白块的相邻索引（上下左右）
function getAdjacentIndices(index, level) {
    const indices = [];
    const row = Math.floor(index / level);
    const col = index % level;

    // 上
    if (row > 0) indices.push(index - level);
    // 下
    if (row < level - 1) indices.push(index + level);
    // 左
    if (col > 0) indices.push(index - 1);
    // 右
    if (col < level - 1) indices.push(index + 1);

    return indices;
}

// 辅助函数：判断打乱后的数组是否有解（华容道有解判定规则）
function isSolvable(arr, level) {
    const length = arr.length;
    let inversionCount = 0; // 逆序数
    let emptyIndex = arr.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / level) + 1; // 空白块所在行（从1开始）

    // 计算逆序数（除空白块外）
    for (let i = 0; i < length; i++) {
        if (arr[i] === 0) continue;
        for (let j = i + 1; j < length; j++) {
            if (arr[j] === 0) continue;
            if (arr[i] > arr[j]) inversionCount++;
        }
    }

    // 判定规则：
    // 1. 奇数阶：逆序数为偶数 → 有解
    // 2. 偶数阶：逆序数 + 空白块所在行 → 奇数 → 有解
    if (level % 2 === 1) {
        return inversionCount % 2 === 0;
    } else {
        return (inversionCount + emptyRow) % 2 === 1;
    }
}

// 3. 通关判定：判断当前数组是否与有序数组一致
export function checkWin(currentArr, level) {
    const orderArr = generateOrderArray(level);
    return JSON.stringify(currentArr) === JSON.stringify(orderArr);
}

// 4. 通关提示：获取可移动的数字块提示
export function getHint(currentArr, level) {
    const emptyIndex = currentArr.indexOf(0);
    const adjacentIndices = getAdjacentIndices(emptyIndex, level);
    const hintNums = adjacentIndices.map(index => currentArr[index]).filter(num => num !== 0);
    if (hintNums.length === 0) return "暂无可移动数字，请重置游戏！";
    return `可移动数字：${hintNums.join('、')}，点击/滑动即可移动`;
}

// 5. 时间格式化：将秒数转为 mm:ss 格式
export function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}