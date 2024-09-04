const canvas = document.getElementById('music-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate');
const stopBtn = document.getElementById('stop');

let isPlaying = false;
let animationId;
let audioContext;
let oscillator;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function initAudio() {
    if (audioContext) {
        audioContext.close();
    }
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(audioContext.destination);
}

function generateMusic() {
    stopMusic(); // Stop any existing music before starting new
    isPlaying = true;

    initAudio();
    oscillator.start();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate random shapes and colors
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 50 + 10,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fill();
        }

        // Play a random note
        const frequency = 220 + Math.random() * 880;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

function stopMusic() {
    if (!isPlaying) return;
    isPlaying = false;
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (oscillator) {
        oscillator.stop();
    }
}

generateBtn.addEventListener('click', generateMusic);
stopBtn.addEventListener('click', stopMusic);
window.addEventListener('resize', resizeCanvas);

resizeCanvas();