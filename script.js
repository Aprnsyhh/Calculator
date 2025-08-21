document.addEventListener('DOMContentLoaded', () => {
    const pertandinganList = document.getElementById('pertandingan-list');
    const tambahPertandinganBtn = document.getElementById('tambah-pertandingan');
    const kurangiPertandinganBtn = document.getElementById('kurangi-pertandingan');
    const taruhanInput = document.getElementById('taruhan');
    const totalOddsSpan = document.getElementById('total-odds');
    const kemenanganSpan = document.getElementById('kemenangan');
    const peringatanP = document.getElementById('peringatan');

    // Tambahkan 2 pertandingan pertama secara default
    tambahPertandingan();
    tambahPertandingan();

    tambahPertandinganBtn.addEventListener('click', tambahPertandingan);
    kurangiPertandinganBtn.addEventListener('click', kurangiPertandingan);
    pertandinganList.addEventListener('input', hitungParlay);
    taruhanInput.addEventListener('input', hitungParlay);

    function tambahPertandingan() {
        const item = document.createElement('div');
        item.classList.add('pertandingan-item');
        item.innerHTML = `
            <div class="input-group">
                <label>Odds:</label>
                <input type="number" class="odds-input" value="1.90" min="1.00" step="0.01">
            </div>
            <div class="status-group">
                <label>Status:</label>
                <select class="status-select">
                    <option value="win">Win</option>
                    <option value="win-half">Win Half</option>
                    <option value="lose">Lose</option>
                    <option value="lose-half">Lose Half</option>
                    <option value="draw">Draw</option>
                </select>
            </div>
        `;
        pertandinganList.appendChild(item);
        hitungParlay();
    }

    function kurangiPertandingan() {
        const pertandinganItems = document.querySelectorAll('.pertandingan-item');
        if (pertandinganItems.length > 2) {
            pertandinganList.removeChild(pertandinganItems[pertandinganItems.length - 1]);
            hitungParlay();
        } else {
            peringatanP.textContent = 'Mix Parlay harus minimal 2 pertandingan.';
        }
    }

    function hitungParlay() {
        const oddsInputs = document.querySelectorAll('.odds-input');
        const statusSelects = document.querySelectorAll('.status-select');
        const taruhan = parseFloat(taruhanInput.value);
        let totalOdds = 1.00;
        let isLose = false;
        let isLoseHalf = false;
        peringatanP.textContent = '';

        if (oddsInputs.length < 2) {
            peringatanP.textContent = 'Mix Parlay harus minimal 2 pertandingan.';
            totalOddsSpan.textContent = '0.00';
            kemenanganSpan.textContent = '0.00';
            return;
        }

        for (let i = 0; i < oddsInputs.length; i++) {
            const odds = parseFloat(oddsInputs[i].value);
            const status = statusSelects[i].value;

            if (status === 'lose') {
                isLose = true;
                break;
            } else if (status === 'lose-half') {
                isLoseHalf = true;
                totalOdds /= 2;
            } else if (status === 'win') {
                totalOdds *= odds;
            } else if (status === 'win-half') {
                totalOdds *= ((odds - 1) / 2) + 1;
            }
            // Draw tidak mengubah total odds
        }

        if (isLose) {
            totalOdds = 0;
            peringatanP.textContent = 'Ada pertandingan yang kalah penuh (Lose), total odds menjadi 0.';
        }

        const kemenangan = totalOdds * taruhan;

        totalOddsSpan.textContent = totalOdds.toFixed(2);
        kemenanganSpan.textContent = (kemenangan - taruhan).toFixed(2);
    }
});