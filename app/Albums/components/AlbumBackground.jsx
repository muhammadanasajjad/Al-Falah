import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import WebView from "react-native-webview";

import Colours from "../../utils/colours.json";
import { SuperContext } from "../../_layout";

function AlbumBackground({
    switchBackground,
    setSwitchBackground,
    onSketchSelected,
} = props) {
    // const [refresh, setRefresh] = useState(false);
    const textBackground =
        Platform.OS != "web"
            ? [false, true, true, true]
            : [false, false, false, false];
    const allSketches = [
        getStarfieldSketch(),
        getBlackHoleSketch(),
        getFlowingParticlesSketch(),
        getCompactExpandSketch(),
    ];
    const settings = useContext(SuperContext)[0];
    const [pickedSketch, setPickedSketch] = useState(
        settings.albums.defaultBackground.val
    );
    const sketch = allSketches[pickedSketch];
    onSketchSelected({ textBackground: textBackground[pickedSketch] });

    useEffect(() => {
        if (switchBackground) {
            if (pickedSketch == allSketches.length - 1) {
                setPickedSketch(0);
            } else {
                setPickedSketch(pickedSketch + 1);
            }
            setSwitchBackground(false);
        }
    }, [switchBackground]);

    // useEffect(() => {
    //     setRefresh(!refresh);
    //     setPickedSketch(settings.albums.defaultBackground.val);
    // }, [settings]);

    return (
        <View style={styles.container}>
            {Platform.OS != "web" && (
                <WebView
                    style={styles.sketch}
                    originWhitelist={["*"]}
                    source={{ html: sketch }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // position: "absolute",
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
    },
    sketch: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
        marginBottom: 2,
    },
});

function getStarfieldSketch() {
    return `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>p5.js Sketch</title>

            <style>
                body {
                    background-color: ${Colours.bgColour};
                    margin: 0;
                    padding: 0;
                    color: #ffffff;
                }
                canvas {
                    display: block;
                    margin: auto;
                    border: 0px solid black;
                }
            </style>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
            <script>
                class Star {
                    constructor(x, y, z) {
                        this.x = x;
                        this.y = y;
                        this.z = z;
                        
                        this.pz = z;
                        this.speed = width/50;
                    }
                    
                    update(speedDivider=50) {
                        this.speed = width/speedDivider;
                        this.z = this.z - this.speed;
                        if (this.z < 1) {
                            this.z = width;
                            this.pz = this.z;
                            this.x = random(-width/2, width/2);
                            this.y = random(-height/2, height/2);
                        }
                    }
                    
                    show() {
                        noStroke();
                        fill(255);
                        
                        let sx = map(this.x / this.z, 0, 1, 0, width);
                        let sy = map(this.y / this.z, 0, 1, 0, height);
                        
                        let r = map(this.z, 0, width, 8, 0);
                        ellipse(sx, sy, r, r);
                        
                        let px = map(this.x / this.pz, 0, 1, 0, width);
                        let py = map(this.y / this.pz, 0, 1, 0, height);
                        
                        stroke(255);
                        strokeWeight(r);
                        line(px, py, sx, sy);
                        
                        this.pz = this.z;
                    }
                }
            </script>     
            <script>
                const stars = [];
                const numStars = 200;
                let speedDivider = 35;
                let wantedDivider;

                function setup() {
                    createCanvas(windowWidth, windowHeight);

                    wantedDivider = random(20, 50);

                    for (let i = 0; i < numStars; i++) {
                        let x = random(-width/2, width/2);
                        let y = random(-height/2, height/2);
                        let z = random(0, width);
                        stars.push(new Star(x, y, z));
                    }
                    
                    frameRate(60);
                    background(...'${Colours.bgColourRGB}'.split(","));
                }

                function draw() {
                    background(...'${Colours.bgColourRGB}'.split(","));
                    translate(width / 2, height / 2);

                    // speedDivider = lerp(speedDivider, wantedDivider, 0.01);
                    // if (speedDivider - wantedDivider <= 0.1) {
                    //     wantedDivider = random(15, 50);
                    // }

                    for (let i = 0; i < numStars; i++) {
                        stars[i].update(speedDivider);
                        stars[i].show();
                    }
                }
            </script>
        </head>
        <body>
        </body>
    `;
}

function getFlowingParticlesSketch() {
    return `<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>p5.js Sketch</title>

            <style>
                body {
                    background-color: ${Colours.bgColour};
                    margin: 0;
                    padding: 0;
                    color: #ffffff;
                }
                canvas {
                    display: block;
                    margin: auto;
                    border: 0px solid black;
                }
            </style>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
            <script>
                class Particle {
                    constructor(x, y) {
                        this.x = x;
                        this.y = y;
                    }
                    
                    onScreen() {
                        return this.x >= 0 && this.x <= width && this.y >= 0 && this.y <= height;
                    }
                    
                    update(noiseScale) {
                        let n = noise(this.x * noiseScale, this.y * noiseScale);
                        let a = map(n, 0, 1, 0, TWO_PI);
                        this.x += cos(a);
                        this.y += sin(a);
                        
                        if (!this.onScreen()) {
                        this.x = random(width);
                        this.y = random(height);
                        }
                    }
                    
                    show() {
                        stroke(255);  
                        point(this.x, this.y);
                    }
                }
            </script>     
            <script>
                let particles = [];
                const num = 500;

                let n = 100;
                let noiseScale = 1 / n;

                function setup() {
                    createCanvas(400, windowHeight);
                    
                    for (let i = 0; i < num; i++) {
                        particles.push(new Particle(random(width), random(height)));
                    }

                    frameRate(60);
                    background(...'${Colours.bgColourRGB}'.split(","));
                }

                function draw() {
                    background(...'${Colours.bgColourRGB}'.split(","), 10);
                    
                    for (let i = 0; i < num; i++) {
                        let p = particles[i];
                        //moving
                        p.update(noiseScale);
                        
                        //drawing
                        p.show();
                    }
                }

                function onScreen(v) {
                    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
                }
            </script>
        </head>
        <body>
        </body>`;
}

function getBlackHoleSketch() {
    return `<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>p5.js Sketch</title>

            <style>
                body {
                    background-color: ${Colours.bgColour};
                    margin: 0;
                    padding: 0;
                    color: #ffffff;
                }
                canvas {
                    display: block;
                    margin: auto;
                    border: 0px solid black;
                }
            </style>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
            <script>
                class Particle {
                    constructor(x, y) {
                        this.pos = createVector(x, y);
                        this.vel = createVector(0, 0);
                        this.acc = createVector(0, 0);
                    }
                    
                    update(pos=createVector(width / 2, height / 2), radius=10) {
                        this.acc = createVector(pos.x - this.pos.x, pos.y - this.pos.y).normalize().mult(0.1);
                        this.vel = this.vel.add(this.acc);
                        
                        let distance = dist(pos.x, pos.y, this.pos.x, this.pos.y);
                        this.acc = createVector(- pos.y + this.pos.y, pos.x - this.pos.x).normalize().mult(0.15);
                        this.vel = this.vel.add(this.acc);
                        
                        this.pos = this.pos.add(this.vel);
                        this.vel = this.vel.mult(0.9);
                        
                        if (distance < radius) {
                            this.pos = createVector(random(width), random(height));
                            this.vel = this.vel.mult(0);
                        }
                    }
                    
                    show() {
                        noStroke();
                        fill(255);
                        circle(this.pos.x, this.pos.y, 3);
                    }
                }
            </script>     
            <script>
                const numParticles = 300;
                let particles = [];
                let vacuum;
                let chosenPos;
                const lerpFactor = 0.03;
                let radius = 30;

                function setup() {
                    createCanvas(windowWidth, windowHeight);
                    vacuum = createVector(width / 2, 1.75 * height / 8);
                    chosenPos = createVector(width / 2, height / 2);
                    
                    for (let i = 0; i < numParticles; i++) {
                        particles.push(new Particle(random(width), random(height)));
                    }

                    frameRate(60);
                    background(...'${Colours.bgColourRGB}'.split(","));
                }

                function draw() {
                    background(...'${Colours.bgColourRGB}'.split(","), 10);
                    
                    radius += 3 * (sin(frameCount));
                    if (dist(vacuum.x, vacuum.y, chosenPos.x, chosenPos.y) < 10) {
                        // chosenPos = createVector(random(width / 3, 2 * width / 3), random(height / 3, 2 * height / 3));
                    }
                    
                    for (let i = 0; i < numParticles; i++) {
                        particles[i].update(vacuum, radius);
                        particles[i].show();
                    }
                    
                    
                    noStroke();
                    fill(0);
                    // circle(vacuum.x, vacuum.y, radius * 2);
                    vacuum = createVector(lerp(vacuum.x, chosenPos.x, lerpFactor), lerp(vacuum.y, chosenPos.y, lerpFactor))
                }
            </script>
        </head>
        <body>
        </body>`;
}

function getCompactExpandSketch() {
    return `<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>p5.js Sketch</title>

            <style>
                body {
                    background-color: ${Colours.bgColour};
                    margin: 0;
                    padding: 0;
                    color: #ffffff;
                }
                canvas {
                    display: block;
                    margin: auto;
                    border: 0px solid black;
                }
            </style>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
            <script>
                class Particle {
                    constructor(x, y) {
                        this.pos = createVector(x, y);
                        this.vel = createVector(0, 0);
                        this.acc = createVector(0, 0);
                    }
                    
                    outOfBounds() {
                        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
                    }
                    
                    update(pos=createVector(width / 2, height / 2), radius=10, pull=true) {
                        let distance = dist(pos.x, pos.y, this.pos.x, this.pos.y);
                        if (!this.pull) {
                            this.acc = createVector(- pos.y + this.pos.y, pos.x - this.pos.x).normalize().mult(0.1);
                            this.vel = this.vel.add(this.acc);
                        }
                        
                        if (pull) {
                            this.acc = createVector(pos.x - this.pos.x, pos.y - this.pos.y).normalize().mult(0.2);
                        } else {
                            this.acc = createVector(-pos.x + this.pos.x, -pos.y + this.pos.y).normalize().mult(0.2);
                        }
                        this.vel = this.vel.add(this.acc);
                        
                        this.pos = this.pos.add(this.vel);
                        this.vel = this.vel.mult(0.9);
                        
                        if (this.outOfBounds() || distance < radius) {
                            // this.pos = createVector(random(width), random(height));
                            // this.vel = this.vel.mult(0);
                        }
                        return [this.outOfBounds(), distance < radius];
                    }
                    
                    show() {
                        noStroke();
                        fill(255);
                        circle(this.pos.x, this.pos.y, 3);
                    }
                }
            </script>     
            <script>
                const numParticles = 300;
                let particles = [];
                let vacuum;
                let chosenPos;
                const lerpFactor = 0.03;
                let radius = 5;
                let pull = true;

                function setup() {
                    createCanvas(400, windowHeight);
                    vacuum = createVector(width / 2, height / 2);
                    chosenPos = createVector(width / 2, height / 2);
                    
                    for (let i = 0; i < numParticles; i++) {
                        particles.push(new Particle(random([random(width, width * 3 / 2),
                                                            random(0, -width / 2)]),
                                                        random([random(height, height * 3 / 2),
                                                            random(0, -height / 2)])));
                    }

                    frameRate(60);
                    background(...'${Colours.bgColourRGB}'.split(","));
                }

                function draw() {
                    background(...'${Colours.bgColourRGB}'.split(","), 10);
                    
                    radius += 3 * (sin(frameCount));
                    if (dist(vacuum.x, vacuum.y, chosenPos.x, chosenPos.y) < 10) {
                        // chosenPos = createVector(random(width / 3, 2 * width / 3), random(height / 3, 2 * height / 3));
                    }
                    
                    let allOutOfBound = true;
                    let allTooClose = true;
                    for (let i = 0; i < numParticles; i++) {
                        let [outOfBound, tooClose] = particles[i].update(vacuum, radius, pull);
                        allOutOfBound = outOfBound && allOutOfBound;
                        allTooClose = tooClose && allTooClose;
                        particles[i].show();
                    }
                    
                    if (allOutOfBound) {
                        if (!pull) {
                        pull = true;
                        for (let i = 0; i < numParticles; i++) {
                            particles[i] = new Particle(random([random(width, width * 3 / 2),
                                                            random(0, -width / 2)]),
                                                        random([random(height, height * 3 / 2),
                                                            random(0, -height / 2)]));
                        }
                        }
                    }
                    
                    if (allTooClose) {
                        pull = false;
                    }
                    
                    noStroke();
                    fill(0);
                    // circle(vacuum.x, vacuum.y, radius * 2);
                    vacuum = createVector(lerp(vacuum.x, chosenPos.x, lerpFactor), lerp(vacuum.y, chosenPos.y, lerpFactor))
                }

                function mousePressed() {
                    // pull = !pull;
                }
            </script>
        </head>
        <body>
        </body>`;
}

export default AlbumBackground;
