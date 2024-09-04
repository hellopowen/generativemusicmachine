let sketch2 = function(p) {
    let audioContext;
    let panner;
    let oscillator;
    let isPlaying = false;

    p.setup = function() {
        let canvas = p.createCanvas(400, 400);
        canvas.parent('canvas-container-2');

        // Create a new audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a new oscillator node
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 440; // A4 note

        // Create a new panner node for spatial audio
        panner = new PannerNode(audioContext, { panningModel: 'HRTF' });
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;

        // Connect the oscillator to the panner
        oscillator.connect(panner);

        // Connect the panner to the audio context's destination
        panner.connect(audioContext.destination);
    }

    p.draw = function() {
        p.background(220);

        if (isPlaying) {
            // Map the mouse position to 3D coordinates
            let x = p.map(p.mouseX, 0, p.width, -1, 1);
            let y = p.map(p.mouseY, 0, p.height, 1, -1);
            let z = 0;

            // Set the position of the panner node
            panner.setPosition(x, y, z);

            // Draw a circle representing the sound source
            p.fill(255, 0, 0);
            p.ellipse(p.mouseX, p.mouseY, 20, 20);
        }
    }

    function startGenerating() {
        if (!isPlaying) {
            audioContext.resume().then(() => {
                oscillator.start();
                isPlaying = true;
            });
        }
    }

    function stopGenerating() {
        if (isPlaying) {
            oscillator.stop();
            isPlaying = false;
            // Create a new oscillator for next time
            oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 440;
            oscillator.connect(panner);
        }
    }

    document.getElementById('generate-2').addEventListener('click', startGenerating);
    document.getElementById('stop-2').addEventListener('click', stopGenerating);
    document.getElementById('save-2').addEventListener('click', () => saveSketch(2, 'Moving Sound Source'));
};

new p5(sketch2);