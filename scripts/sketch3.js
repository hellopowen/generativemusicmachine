let sketch3 = function(p) {
    let points = [];
    let agents = [];
    let numAgents = 10;
    let drawingActive = false;
    let turnRadiusMin = 0;
    let turnRadiusMax = 2;
    let velocityMin = 20;
    let velocityMax = 30;
    let tailLength = 100;

    p.setup = function() {
        let canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-container-3');
        p.colorMode(p.RGB, 255);
        p.strokeWeight(4);
        p.background(0);
    };

    p.draw = function() {
        p.background(0, 20);

        for (let i = 0; i < agents.length; i++) {
            let agent = agents[i];

            if (drawingActive && points.length > 1) {
                let prevPoint = points[points.length - 2];
                let currentPoint = points[points.length - 1];
                let desired = p5.Vector.sub(currentPoint, agent.position);
                desired.normalize();
                desired.mult(agent.velocityScalar);

                let steer = p5.Vector.sub(desired, agent.velocity);
                steer.limit(agent.maxTurnRadius);

                agent.velocity.add(steer);
                agent.position.add(agent.velocity);
                agent.path.push(agent.position.copy());

                if (agent.path.length > tailLength) {
                    agent.path.splice(0, 1);
                }
            }

            p.stroke(agent.color.levels[0], agent.color.levels[1], agent.color.levels[2], 128);
            p.strokeWeight(1);
            p.noFill();
            p.beginShape();
            for (let v of agent.path) {
                p.vertex(v.x, v.y);
            }
            p.endShape();
        }
    };

    p.mousePressed = function() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            initializeAgents();
        }
    };

    p.mouseDragged = function() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            drawingActive = true;
            let currentPoint = p.createVector(p.mouseX, p.mouseY);
            points.push(currentPoint);
        }
    };

    p.mouseReleased = function() {
        drawingActive = false;
        points = [];
    };

    function initializeAgents() {
        agents = [];
        let turnRadiusStep = (turnRadiusMax - turnRadiusMin) / (numAgents - 1);
        let velocityStep = (velocityMax - velocityMin) / (numAgents - 1);

        for (let i = 0; i < numAgents; i++) {
            let grayValue = p.map(i, 0, numAgents - 1, 0, 255);
            let agent = {
                position: p.createVector(p.mouseX, p.mouseY),
                velocity: p.createVector(p.random(-1, 1), p.random(-1, 1)).mult(velocityMin + i * velocityStep),
                maxTurnRadius: turnRadiusMin + i * turnRadiusStep,
                velocityScalar: velocityMin + i * velocityStep,
                path: [],
                color: p.color(grayValue)
            };
            agents.push(agent);
        }
    }

    function startGenerating() {
        p.loop();
    }

    function stopGenerating() {
        p.noLoop();
        agents = [];
        drawingActive = false;
        points = [];
    }

    function resetSketch() {
        p.background(0);
        agents = [];
        drawingActive = false;
        points = [];
    }

    document.getElementById('generate-3').addEventListener('click', startGenerating);
    document.getElementById('stop-3').addEventListener('click', stopGenerating);
    document.getElementById('save-3').addEventListener('click', () => saveSketch(3, 'Agent Trails'));
    
    // Add a reset button
    let resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetSketch);
    document.getElementById('controls-3').appendChild(resetButton);
};

new p5(sketch3);