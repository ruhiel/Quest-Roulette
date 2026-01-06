let questQueue = [];
let pastQuest = null;
let isStarted = false;
const imageMap = { "レ・ダウ": "img/レ・ダウ.png", "ラギアクルス": "img/ラギアクルス.png", "アルシュベルド": "img/アルシュベルド.png", "セルレギオス": "img/セルレギオス.png", "ウズ・トゥナ": "img/ウズ・トゥナ.png" };

function addNewRow() {
    const container = document.getElementById('inputs-container');
    const newRow = document.createElement('div');
    newRow.className = 'input-row';
    newRow.innerHTML = `<select class="name-select"><option value="レ・ダウ">レ・ダウ</option><option value="ラギアクルス">ラギアクルス</option><option value="アルシュベルド">アルシュベルド</option><option value="セルレギオス">セルレギオス</option><option value="ウズ・トゥナ">ウズ・トゥナ</option></select><input type="number" class="count-input" value="0">`;
    container.appendChild(newRow);
}

function getAndConsumeQuest() {
    const rows = document.querySelectorAll('.input-row');
    let pool = [];
    rows.forEach((row, index) => {
        const select = row.querySelector('.name-select');
        const countInput = row.querySelector('.count-input');
        const count = parseInt(countInput.value);
        if (select.value && count > 0) {
            for (let i = 0; i < count; i++) pool.push({ name: select.value, inputIndex: index });
        }
    });
    if (pool.length === 0) return null;

    // 別ファイルの mt インスタンスを使用
    const selected = pool[Math.floor(mt.random() * pool.length)];

    const targetInput = rows[selected.inputIndex].querySelector('.count-input');
    targetInput.value = parseInt(targetInput.value) - 1;
    return { name: selected.name, img: imageMap[selected.name] || "" };
}

function updateCard(id, data) {
    const card = document.getElementById(id);
    if (!data) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    card.querySelector('.monster-name').innerText = data.name;
    const imgTag = card.querySelector('img');
    if (data.img) { imgTag.src = data.img; imgTag.style.display = "block"; } else { imgTag.style.display = "none"; }
}

function handleNextClick() {
    if (!isStarted) {
        const q0 = getAndConsumeQuest();
        if (!q0) { alert("回数を入力してください"); return; }
        isStarted = true;
        questQueue = [q0, getAndConsumeQuest(), getAndConsumeQuest()];
    } else {
        pastQuest = questQueue[0];
        questQueue.shift();
        questQueue.push(getAndConsumeQuest());
    }
    updateCard('past-1', pastQuest);
    updateCard('current', questQueue[0]);
    updateCard('future-1', questQueue[1]);
    updateCard('future-2', questQueue[2]);
    if (!questQueue[0]) {
        document.getElementById('current').querySelector('.monster-name').innerText = "FINISH!";
        document.getElementById('spin-button').disabled = true;
    }
}