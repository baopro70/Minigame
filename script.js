body {
    font-family: Arial, sans-serif;
    background-color: #2c3e50;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.game-container {
    text-align: center;
    background-color: #34495e;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.board {
    display: grid;
    gap: 0;
    justify-content: center;
    margin: 15px auto;
    background-color: #111;
    border: 4px solid #7f8c8d;
    padding: 2px;
}

/* Cấu hình ô & Kẻ viền phân cách các ô */
.cell {
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 0, 0, 0.15);
}

/* Nền tường và sàn */
.wall { 
    background-color: #7f8c8d; 
    border: 1px solid #95a5a6; 
}
.floor { 
    background-color: #ecf0f1; 
}

/* Gắn hình ảnh PNG (nền #ecf0f1 giữ ảnh trong suốt chuẩn) */
.player { 
    background-image: url('player.png'); 
    background-color: #ecf0f1;
}
.player-on-target { 
    background-image: url('player.png'); 
    background-color: #ecf0f1;
}
.target { 
    background-image: url('target.png'); 
    background-color: #ecf0f1;
}
.box { 
    background-image: url('box.png'); 
    background-color: #ecf0f1;
}
.box-on-target { 
    background-image: url('box.png'); 
    background-color: #ecf0f1;
}

/* Nút bấm & Bảng điều khiển */
.mobile-controls {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.mobile-controls .horizontal {
    display: flex;
    gap: 5px;
}

button {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #e74c3c;
    color: white;
}

button:hover {
    background-color: #c0392b;
}

select {
    padding: 8px;
    font-size: 16px;
    border-radius: 4px;
}

/* UI MODAL POPUP */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-overlay.hidden {
    display: none;
}

.modal-content {
    background-color: #2c3e50;
    color: #fff;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    border: 2px solid #f1c40f;
    max-width: 320px;
    width: 90%;
    animation: popIn 0.3s ease-out;
}

.modal-content h2 {
    margin-top: 0;
    color: #f1c40f;
}

.modal-content p {
    font-size: 16px;
    line-height: 1.5;
    margin: 15px 0 20px 0;
}

.modal-content button {
    background-color: #2ecc71;
    font-size: 16px;
    padding: 10px 20px;
}

.modal-content button:hover {
    background-color: #27ae60;
}

@keyframes popIn {
    0% { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
