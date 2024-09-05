let sketch1 = function(p) {
    let audioContext;
    let soundSources = [];
    let isPlaying = false;

    p.setup = function() {
        let canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-container-1');
        
        // Create a new audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    p.draw = function() {
        p.background(220);

        // Draw each sound source
        for (let source of soundSources) {
            let x = p.map(source.panner.positionX.value, -1, 1, 0, p.width);
            let y = p.map(source.panner.positionY.value, -1, 1, p.height, 0);

            p.fill(255, 0, 0);
            p.ellipse(x, y, 20, 20);
        }
    }

    p.mousePressed = function() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            createSoundSource();
        }
    }

    function createSoundSource() {
        // Create a new oscillator node
        let oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = p.random(200, 800); // Random frequency

        // Create a new panner node for spatial audio
        let panner = new PannerNode(audioContext, { panningModel: 'HRTF' });
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;

        // Connect the oscillator to the panner
        oscillator.connect(panner);

        // Connect the panner to the audio context's destination
        panner.connect(audioContext.destination);

        // Map the mouse position to 3D coordinates
        let x = p.map(p.mouseX, 0, p.width, -1, 1);
        let y = p.map(p.mouseY, 0, p.height, 1, -1);
        let z = 0;

        // Set the position of the panner node
        panner.setPosition(x, y, z);

        // Start the oscillator
        oscillator.start();

        // Add the sound source to the array
        soundSources.push({ oscillator, panner });
    }

    function startGenerating() {
        if (!isPlaying) {
            audioContext.resume();
            isPlaying = true;
        }
    }

    function stopGenerating() {
        if (isPlaying) {
            // Stop all oscillators and clear the soundSources array
            for (let source of soundSources) {
                source.oscillator.stop();
            }
            soundSources = [];
            isPlaying = false;
        }
    }

    document.getElementById('generate-1').addEventListener('click', startGenerating);
    document.getElementById('stop-1').addEventListener('click', stopGenerating);
    document.getElementById('save-1').addEventListener('click', () => saveSketch(1, 'Spatial Audio Generator'));
};

new p5(sketch1);