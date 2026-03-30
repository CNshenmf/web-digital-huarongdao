// 工具函数：全局可访问，无需import，提供游戏所需辅助功能
// 1. 生成随机打乱的数字数组（核心游戏逻辑辅助）
function generateRandomArray(level) {
    let size = level === 1 ? 3 : level === 2 ? 4 : 5; // 3x3、4x4、5x5
    let total = size * size;
    let arr = Array.from({ length: total - 1 }, (_, i) => i + 1);
    arr.push(0); // 0表示空白方块

    // 打乱数组（确保可解，简单判断：逆序数为偶数）
    do {
        arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr, size));

    return arr;
}

// 2. 判断打乱的数组是否可解（避免出现无解情况）
function isSolvable(arr, size) {
    let inversions = 0;
    let emptyIndex = arr.indexOf(0);
    let emptyRow = Math.floor(emptyIndex / size) + 1; // 空白方块所在行（从1开始）

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }

    // 判断逻辑：3x3（奇数）需逆序数为偶数；4x4/5x5（偶数）需逆序数+空白行=奇数
    if (size % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        return (inversions + emptyRow) % 2 === 1;
    }
}

// 3. 判断游戏是否胜利（所有方块按顺序排列，空白在最后）
function checkWin(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] !== i + 1) {
            return false;
        }
    }
    return arr[arr.length - 1] === 0;
}

// 4. 获取空白方块可移动的方向（上下左右）
function getMovableDirection(emptyIndex, level) {
    let size = level === 1 ? 3 : level === 2 ? 4 : 5;
    let directions = [];
    // 上：emptyIndex - size >= 0
    if (emptyIndex - size >= 0) directions.push('up');
    // 下：emptyIndex + size < size*size
    if (emptyIndex + size < size * size) directions.push('down');
    // 左：emptyIndex % size !== 0
    if (emptyIndex % size !== 0) directions.push('left');
    // 右：emptyIndex % size !== size - 1
    if (emptyIndex % size !== size - 1) directions.push('right');
    return directions;
}