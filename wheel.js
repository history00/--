class WheelOfFortune {
    constructor() {
        this.canvas = document.getElementById('wheel-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spin-button');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 20;
        
        this.names = [
            "Антон", "Мирослава", "Федя", "Маша", "Борис", "Егор", "Софья", "Месси", 
            "Лиза", "Даник К.", "Сергей", "Иван Золо", "Олимпиадник", "Кирил М.", "Роман", "Санечка", 
            "Аня", "Матвей С.", "Даник С.", "Кирил С.", "Матвей Ф.", "Паша", "Арина", 
            "Влад", "Глеб", "Иван Б."
        ];
        
        this.colors = ['#BD4932', '#FFFAD5'];
        this.angle = 0;
        this.spinning = false;
        this.rotationSpeed = 0;
        this.friction = 0.98;
        this.minSpeed = 0.05;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.drawWheel();
    }
    
    setupCanvas() {
        const container = document.getElementById('wheel-wrapper');
        const size = Math.min(container.clientWidth, container.clientHeight) * 0.8;
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 20;
        
        this.drawWheel();
    }
    
    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.setupCanvas(), 100);
        });
    }
    
    drawWheel() {
        const ctx = this.ctx;
        const segmentAngle = (2 * Math.PI) / this.names.length;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);
        
        for (let i = 0; i < this.names.length; i++) {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = this.colors[i % this.colors.length];
            ctx.fill();
            
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.save();
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.translate(this.radius * 0.75, 0);
            
            ctx.fillStyle = i % 2 === 0 ? '#FFFAD5' : '#401911';
            const fontSize = Math.max(14, this.radius * 0.08);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const name = this.names[i];
            const maxWidth = this.radius * 0.4;
            
            if (ctx.measureText(name).width > maxWidth) {
                ctx.font = `bold ${fontSize * 0.8}px Arial`;
            }
            
            ctx.fillText(name, 0, 0);
            
            ctx.restore();
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.12, 0, 2 * Math.PI);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 0.12);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#B8860B');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.names.length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(i * segmentAngle) * this.radius, 
                      Math.sin(i * segmentAngle) * this.radius);
            ctx.stroke();
        }
        
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    spin() {
        if (this.spinning) return;
        
        this.spinning = true;
        this.rotationSpeed = 8 + Math.random() * 12;
        
        this.spinButton.style.display = 'none';
        
        this.animate();
    }
    
    animate() {
        if (!this.spinning) return;
        
        this.angle += this.rotationSpeed * 0.05;
        this.rotationSpeed *= this.friction;
        
        this.drawWheel();
        
        if (this.rotationSpeed < this.minSpeed) {
            this.rotationSpeed = 0;
            this.spinning = false;
            this.onSpinComplete();
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }
    
    onSpinComplete() {
        const segmentAngle = (2 * Math.PI) / this.names.length;
        const normalizedAngle = (this.angle % (2 * Math.PI));
        const winningIndex = Math.floor(normalizedAngle / segmentAngle);
        
        const winnerName = this.names[winningIndex];
        const isWinner = winningIndex % 2 === 0;
        
        this.spinButton.style.display = 'block';
        
        this.showWinner(winnerName, isWinner);
    }
    
    showWinner(name, isWinner) {
        const winnerDiv = document.createElement('div');
        winnerDiv.className = 'winner-display';
        winnerDiv.innerHTML = `
            <div class="winner-content ${isWinner ? 'winner' : ''}">
                <div class="winner-crown">${isWinner ? '👑' : '🎯'}</div>
                <div class="winner-title">${isWinner ? 'ПОБЕДИТЕЛЬ!' : 'ВЫБРАНО:'}</div>
                <div class="winner-name">${name}</div>
                <div class="winner-message">${isWinner ? 'Поздравляем с победой! 🎉' : 'Удачи в следующий раз! ✨'}</div>
                <div class="winner-timer">Исчезнет через <span class="timer-count">5</span> сек</div>
            </div>
        `;
        
        document.getElementById('wheel-wrapper').appendChild(winnerDiv);
        
        setTimeout(() => {
            winnerDiv.classList.add('show');
        }, 100);

        let countdown = 5;
        const timerElement = winnerDiv.querySelector('.timer-count');
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        setTimeout(() => {
            winnerDiv.classList.remove('show');
            setTimeout(() => {
                if (winnerDiv.parentNode) {
                    winnerDiv.remove();
                }
            }, 500);
        }, 5000);
    }
}

let wheel;

function initWheel() {
    setTimeout(() => {
        if (!wheel) {
            wheel = new WheelOfFortune();
        } else {
            wheel.setupCanvas();
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    const wheelModal = document.getElementById('wheel-modal');
    if (wheelModal) {
        wheelModal.addEventListener('click', function(e) {
            if (e.target === this) {
                setTimeout(initWheel, 100);
            }
        });
    }
});

window.addEventListener('resize', function() {
    if (wheel) {
        setTimeout(() => wheel.setupCanvas(), 100);
    }
});

setTimeout(initWheel, 1000);