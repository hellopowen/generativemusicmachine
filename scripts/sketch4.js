let sketch4 = function(p) {
    let audioContext;
    let panner;
    let oscillator;

    p.setup = function() {
        let canvas = p.createCanvas(300, 300, p.WEBGL);
        canvas.parent('canvas-container-4');

        // Create a new audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a new oscillator node
        oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 110; // A4 note

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

        // Start the oscillator
        oscillator.start();
    }

    p.draw = function() {
        p.background(0);

        // Map the mouse position to 3D coordinates
        let x = p.map(p.mouseX, 0, p.width, -1, 1);
        let y = p.map(p.mouseY, 0, p.height, 1, -1);
        let z = 0;

        // Set the position of the panner node
        panner.setPosition(x, y, z);

        // Set the camera position based on the sound source position
        p.camera(x * 500, y * 500, z * 500, 0, 0, 0, 0, 1, 0);

        // Draw a cube representing the sound source
        p.push();
        p.translate(x * 100, y * 100, z * 100);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.02);
        p.fill(255, 0, 0);
        p.box(50);
        p.pop();
    }

    function startGenerating() {
        audioContext.resume();
    }

    function stopGenerating() {
        oscillator.stop();
        oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 110;
        oscillator.connect(panner);
        oscillator.start();
    }

    document.getElementById('generate-4').addEventListener('click', startGenerating);
    document.getElementById('stop-4').addEventListener('click', stopGenerating);
    document.getElementById('save-4').addEventListener('click', () => saveSketch(4, '3D Sound Source'));
};

new p5(sketch4);