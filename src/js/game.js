// 核心游戏逻辑：全局可访问，修复DOM获取容错，避免开发者模式报错
let currentLevel = 1; // 当前难度（1-简单3x3，2-中等4x4，3-困难5x5）
let gameArray = []; // 游戏数字数组
let stepCount = 0; // 步数统计
let isPlaying = false; // 是否正在游戏中

// 1. 初始化游戏（创建棋盘、生成数字）- 全局暴露，供index.js调用
function initGame() {
    // 修复：添加DOM元素获取容错，避免找不到元素时报错
    const gameBoard = document.getElementById('gameBoard');
    const stepCountEl = document.getElementById('stepCount');
    const levelTextEl = document.getElementById('levelText');
    
    // 容错处理：若DOM元素未找到，提示错误并终止执行，避免开发者模式报错
    if (!gameBoard || !stepCountEl || !levelTextEl) {
        console.error("错误：未找到游戏相关DOM元素，请检查index.html中元素ID是否正确（gameBoard、stepCount、levelText）");
        return;
    }

    // 重置步数、更新难度显示
    stepCount = 0;
    stepCountEl.textContent = stepCount;
    levelTextEl.textContent = currentLevel === 1 ? '简单（3x3）' : currentLevel === 2 ? '中等（4x4）' : '困难（5x5）';
    
    // 生成随机数组
    gameArray = generateRandomArray(currentLevel);
    const size = currentLevel === 1 ? 3 : currentLevel === 2 ? 4 : 5;
    
    // 设置棋盘网格（根据难度调整列数）
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoard.innerHTML = ''; // 清空棋盘
    
    // 生成游戏方块
    gameArray.forEach((num, index) => {
        const block = document.createElement('div');
        block.className = `game-block ${num === 0 ? 'empty' : ''}`;
        block.textContent = num !== 0 ? num : '';
        block.dataset.index = index; // 存储方块索引，用于后续移动判断
        
        // 非空白方块添加点击事件（移动逻辑）
        if (num !== 0) {
            block.addEventListener('click', () => moveBlock(index));
        }
        
        gameBoard.appendChild(block);
    });
    
    isPlaying = true; // 标记游戏开始
}

// 2. 移动方块逻辑 - 全局暴露
function moveBlock(blockIndex) {
    if (!isPlaying) return; // 未开始游戏，不允许移动
    
    const size = currentLevel === 1 ? 3 : currentLevel === 2 ? 4 : 5;
    const emptyIndex = gameArray.indexOf(0);
    const movableDirections = getMovableDirection(emptyIndex, currentLevel);
    let canMove = false;

    // 判断当前方块是否可移动（与空白方块相邻）
    if (movableDirections.includes('up') && emptyIndex - size === blockIndex) canMove = true;
    if (movableDirections.includes('down') && emptyIndex + size === blockIndex) canMove = true;
    if (movableDirections.includes('left') && emptyIndex - 1 === blockIndex) canMove = true;
    if (movableDirections.includes('right') && emptyIndex + 1 === blockIndex) canMove = true;
    
    // 可移动则交换方块位置
    if (canMove) {
        // 交换数组中数字位置
        [gameArray[emptyIndex], gameArray[blockIndex]] = [gameArray[blockIndex], gameArray[emptyIndex]];
        // 更新DOM显示
        updateGameBoard();
        // 步数+1
        stepCount++;
        document.getElementById('stepCount').textContent = stepCount;
        // 检查是否胜利
        if (checkWin(gameArray)) {
            isPlaying = false;
            setTimeout(() => {
                alert(`恭喜胜利！步数：${stepCount} 步🎉`);
            }, 300);
        }
    }
}

// 3. 更新棋盘DOM显示（移动后刷新方块位置）- 全局暴露
function updateGameBoard() {
    const blocks = document.querySelectorAll('.game-block');
    // 容错处理：若未找到方块元素，提示错误
    if (!blocks.length) {
        console.error("错误：未找到游戏方块元素，请检查game.js中initGame函数是否正常执行");
        return;
    }
    gameArray.forEach((num, index) => {
        blocks[index].className = `game-block ${num === 0 ? 'empty' : ''}`;
        blocks[index].textContent = num !== 0 ? num : '';
    });
}

// 4. 重置游戏 - 全局暴露
function resetGame() {
    initGame();
}

// 5. 切换难度（1→2→3→1循环）- 全局暴露
function switchLevel() {
    currentLevel = currentLevel === 3 ? 1 : currentLevel + 1;
    initGame();
}