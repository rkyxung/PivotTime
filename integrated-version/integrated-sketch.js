/*
  [v10] 줌 아웃 시 rect 페이드 아웃 기능을 추가한 최종 스크립트
*/

// ===============================================
// Part 1: p5.js 캔버스 애니메이션 로직
// ===============================================

const originalPathDs = [
    "M604.274 1501.48C937.71 1501.48 1208.01 1165.48 1208.01 751.007C1208.01 336.533 937.71 0.536133 604.274 0.536133C270.839 0.536133 0.536255 336.533 0.536255 751.007C0.536255 1165.48 270.839 1501.48 604.274 1501.48Z",
    "M694.411 1501.48C978.062 1501.48 1208.01 1165.48 1208.01 751.007C1208.01 336.533 978.062 0.536133 694.411 0.536133C410.761 0.536133 180.817 336.533 180.817 751.007C180.817 1165.48 410.761 1501.48 694.411 1501.48Z",
    "M784.544 1501.48C1018.41 1501.48 1208 1165.48 1208 751.007C1208 336.533 1018.41 0.536133 784.544 0.536133C550.673 0.536133 361.083 336.533 361.083 751.007C361.083 1165.48 550.673 1501.48 784.544 1501.48Z",
    "M874.676 1501.48C1058.77 1501.48 1208 1165.48 1208 751.007C1208 336.533 1058.77 0.536133 874.676 0.536133C690.585 0.536133 541.349 336.533 541.349 751.007C541.349 1165.48 690.585 1501.48 874.676 1501.48Z",
    "M964.821 1501.48C1099.13 1501.48 1208 1165.48 1208 751.007C1208 336.533 1099.13 0.536133 964.821 0.536133C830.514 0.536133 721.637 336.533 721.637 751.007C721.637 1165.48 830.514 1501.48 964.821 1501.48Z",
    "M1054.95 1501.48C1139.48 1501.48 1208 1165.48 1208 751.007C1208 336.533 1139.48 0.536133 1054.95 0.536133C970.426 0.536133 901.903 336.533 901.903 751.007C901.903 1165.48 970.426 1501.48 1054.95 1501.48Z",
    "M1145.09 1501.48C1179.83 1501.48 1208 1165.48 1208 751.007C1208 336.533 1179.83 0.536133 1145.09 0.536133C1110.34 0.536133 1082.17 336.533 1082.17 751.007C1082.17 1165.48 1110.34 1501.48 1145.09 1501.48Z",
    "M1208 1501.48C1217.11 1501.48 1224.5 1165.48 1224.5 751.007C1224.5 336.533 1217.11 0.536133 1208 0.536133C1198.89 0.536133 1191.5 336.533 1191.5 751.007C1191.5 1165.48 1198.89 1501.48 1208 1501.48Z",
    "M1270.92 1501.48C1305.67 1501.48 1333.83 1165.48 1333.83 751.007C1333.83 336.533 1305.67 0.536133 1270.92 0.536133C1236.17 0.536133 1208 336.533 1208 751.007C1208 1165.48 1236.17 1501.48 1270.92 1501.48Z",
    "M1361.05 1501.48C1445.58 1501.48 1514.1 1165.48 1514.1 751.007C1514.1 336.533 1445.58 0.536133 1361.05 0.536133C1276.52 0.536133 1208 336.533 1208 751.007C1208 1165.48 1276.52 1501.48 1361.05 1501.48Z",
    "M1451.19 1501.48C1585.5 1501.48 1694.37 1165.48 1694.37 751.007C1694.37 336.533 1585.5 0.536133 1451.19 0.536133C1316.88 0.536133 1208.01 336.533 1208.01 751.007C1208.01 1165.48 1316.88 1501.48 1451.19 1501.48Z",
    "M1541.33 1501.48C1725.42 1501.48 1874.66 1165.48 1874.66 751.007C1874.66 336.533 1725.42 0.536133 1541.33 0.536133C1357.24 0.536133 1208 336.533 1208 751.007C1208 1165.48 1357.24 1501.48 1541.33 1501.48Z",
    "M1631.46 1501.48C1865.33 1501.48 2054.92 1165.48 2054.92 751.007C2054.92 336.533 1865.33 0.536133 1631.46 0.536133C1397.59 0.536133 1208 336.533 1208 751.007C1208 1165.48 1397.59 1501.48 1631.46 1501.48Z",
    "M1721.6 1501.48C2005.25 1501.48 2235.2 1165.48 2235.2 751.007C2235.2 336.533 2005.25 0.536133 1721.6 0.536133C1437.95 0.536133 1208.01 336.533 1208.01 751.007C1208.01 1165.48 1437.95 1501.48 1721.6 1501.48Z",
    "M1811.74 1501.48C2145.17 1501.48 2415.48 1165.48 2415.48 751.007C2415.48 336.533 2145.17 0.536133 1811.74 0.536133C1478.3 0.536133 1208 336.533 1208 751.007C1208 1165.48 1478.3 1501.48 1811.74 1501.48Z"
];
const originalRects = [
    { x: 758.056, y: 329.042, width: 10, height: 10, fill: '#014BFF' },
    { x: 1307.75, y: 183.523, width: 10, height: 10, fill: '#014BFF' },
    { x: 1952.34, y: 78.2216, width: 16.4656, height: 16.4656, fill: '#014BFF' },
    { x: 325.951, y: 207.83, width: 16.4656, height: 16.4656, fill: '#014BFF' },
    { x: 1652.22, y: 343.802, width: 10, height: 10, fill: '#014BFF' },
];

let scaledOriginalPathData = [];
let scaledRectData = [];
let scaledExtraPathData = [];
const MAX_DENSITY_LEVEL = 140;
let entryX = null;
const activeRatio = 0.89;

let mainElement;
let rectOpacity = 1.0; // [추가] 사각형의 투명도를 제어하는 변수

function vw(value) {
    return (value * window.innerWidth) / 100;
}

function setup() {
    const canvasWidth = vw(125.83);
    const canvasHeight = vw(78.23);
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    scaleAllData();
}

function draw() {
    clear();
    
    if (!mainElement) {
        mainElement = document.querySelector('main');
        if (!mainElement) return;
    }
    const isZoomedOut = mainElement.classList.contains('zoom_out');

    // --- 1. 경로(Path) 그리기 --- 
    const grad = drawingContext.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0.25, '#004AFF');
    grad.addColorStop(0.36, 'rgba(0, 74, 255, 0.4)');
    drawingContext.strokeStyle = grad;
    
    stroke(1);
    noFill();
    strokeWeight(1);

    // 1a. 기본 궤적 그리기
    for (const pathData of scaledOriginalPathData) {
        drawPathFromData(pathData);
    }

    // 1b. 인터랙션에 따른 추가 궤적 그리기 (줌 아웃 상태가 아닐 때만)
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && !isZoomedOut) {
        if (entryX === null) {
            entryX = mouseX;
        }
        const interactionWidth = (width * activeRatio) - entryX;
        const deltaX = mouseX - entryX;
        const ratio = max(0, min(1, deltaX / interactionWidth));
        const pathsToShow = floor(ratio * MAX_DENSITY_LEVEL);

        for (let i = 0; i < pathsToShow; i++) {
            if(scaledExtraPathData[i]) {
                drawPathFromData(scaledExtraPathData[i]);
            }
        }
    } else {
        if (entryX !== null) {
            entryX = null;
        }
    }

    // --- 2. 사각형(Rect) 그리기 (페이드 아웃/인 효과 추가) --- 
    const targetOpacity = isZoomedOut ? 0.0 : 1.0;
    rectOpacity = lerp(rectOpacity, targetOpacity, 0.1);

    if (rectOpacity > 0.01) {
        noStroke();
        for(const r of scaledRectData) {
            let c = color(r.fill);
            c.setAlpha(rectOpacity * 255);
            fill(c);
            rect(r.x, r.y, r.width, r.height);
        }
    }
}

function windowResized() {
    const canvasWidth = vw(125.83);
    const canvasHeight = vw(78.23);
    resizeCanvas(canvasWidth, canvasHeight);
    scaleAllData();
}

function scaleAllData() {
    const originalSvgWidth = 2416;
    const originalSvgHeight = 1502;

    const scaledPaths = originalPathDs.map(d => {
        const nums = d.match(/[\d\.]+/g).map(Number);
        return nums.map((num, i) => {
            return i % 2 === 0 ? num * (width / originalSvgWidth) : num * (height / originalSvgHeight);
        });
    }).sort((a, b) => a[0] - b[0]);
    scaledOriginalPathData = scaledPaths;

    scaledRectData = originalRects.map(r => ({
        x: r.x * (width / originalSvgWidth),
        y: r.y * (height / originalSvgHeight),
        width: r.width * (width / originalSvgWidth),
        height: r.height * (height / originalSvgHeight),
        fill: r.fill
    }));

    scaledExtraPathData = [];
    const pathsPerSegment = 10;
    for (let i = 0; i < scaledPaths.length - 1; i++) {
        const pathA = scaledPaths[i];
        const pathB = scaledPaths[i + 1];
        for (let j = 1; j <= pathsPerSegment; j++) {
            const t = j / pathsPerSegment;
            const interpolatedData = interpolatePathData(pathA, pathB, t);
            scaledExtraPathData.push(interpolatedData);
        }
    }
    scaledExtraPathData.sort((a,b) => a[0] - b[0]);
}

function interpolatePathData(arr1, arr2, t) {
    return arr1.map((n, i) => n * (1 - t) + arr2[i] * t);
}

function drawPathFromData(data) {
    beginShape();
    vertex(data[0], data[1]);
    bezierVertex(data[2], data[3], data[4], data[5], data[6], data[7]);
    bezierVertex(data[8], data[9], data[10], data[11], data[12], data[13]);
    bezierVertex(data[14], data[15], data[16], data[17], data[18], data[19]);
    bezierVertex(data[20], data[21], data[22], data[23], data[24], data[25]);
    endShape();
}


// ===============================================
// Part 2: 기존 main.js의 줌 아웃 로직
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    mainElement = document.querySelector('main');

    window.addEventListener('wheel', (e) => {
        if (!mainElement) return;
        if (e.deltaY < 0 && window.scrollY === 0) {
            e.preventDefault();
            mainElement.classList.add('zoom_out');
        } else if (e.deltaY > 0 && mainElement.classList.contains('zoom_out')) {
            e.preventDefault();
            mainElement.classList.remove('zoom_out');
        }
    });
});