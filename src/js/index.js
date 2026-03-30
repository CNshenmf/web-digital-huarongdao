// 入口文件：绑定按钮点击事件，直接执行，不使用DOMContentLoaded避免作用域锁定
// 修复：移除DOMContentLoaded包裹，确保能访问到game.js中的全局函数（initGame、resetGame等）

// 获取按钮元素（添加容错处理，避免找不到按钮时报错）
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const levelBtn = document.getElementById('levelBtn');

// 容错处理：若按钮元素未找到，提示错误，避免开发者模式报错
if (!startBtn || !resetBtn || !levelBtn) {
    console.error("错误：未找到游戏控制按钮，请检查index.html中按钮ID是否正确（startBtn、resetBtn、levelBtn）");
} else {
    // 绑定按钮点击事件（直接关联game.js中的全局函数）
    startBtn.addEventListener('click', () => {
        if (!isPlaying) {
            initGame();
        } else {
            alert('游戏已在进行中！');
        }
    });

    resetBtn.addEventListener('click', resetGame);
    levelBtn.addEventListener('click', switchLevel);
}