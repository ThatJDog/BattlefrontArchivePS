const pointRadius = 5;
const pointPadding = 10;


export function loadEloGraph(playerName, db, containerElement) {

    if (!containerElement) {
        console.error('Invalid container element for ELO graph.');
        return;
    }
    containerElement.innerHTML = ""; // Clear previous graph

    // Initial draw
    let data = getPlayerData(playerName);
    drawEloGraph(data);

    // Resize observer to redraw graph when the container resizes
    const resizeObserver = new ResizeObserver(() => {
        drawEloGraph(data);
    });

    resizeObserver.observe(containerElement);

    // Return a cleanup function to stop observing when necessary
    return () => {
        resizeObserver.disconnect();
    };


    function drawEloGraph(data) {
        containerElement.innerHTML = ""; // Clear previous graph

        const width = containerElement.clientWidth || 1000;
        const height =  containerElement.clientHeight || 500;
        const yPadding = 20;
        const xPadding = 50;

        const baseElo = 400;
        let currentElo = 0;
        let maxElo = 0;
        let minElo = 0;

        // Create SVG and gradient
        const svg = createSVG();
        containerElement.appendChild(svg);

        // Add gradient definition
        const defs = createGradientDef();
        svg.appendChild(defs);

        // Create Tooltip (Hidden initially)
        const tooltip = createTooltip();
        document.body.appendChild(tooltip);

        data.reduce((acc, cur) => {
            const cumulative = acc + cur.Elo;
            maxElo = Math.max(maxElo, cumulative);
            minElo = Math.min(minElo, cumulative);
            return cumulative;
        }, 0);

        currentElo = baseElo;
        maxElo += baseElo;
        minElo += baseElo;

        const xSpacing = (width - xPadding - pointPadding) / (data.length - 1);

        drawAxes(data);
        drawGraph(data);


        function drawAxes(data) {

            // Y-axis labels
            drawYLabels(svg, height * .95, xPadding, yPadding, 5, minElo, maxElo);
    
            // X-axis labels
            drawXLabels(svg, width * .95, height, xPadding, yPadding, 10, data.length);

            const yAxis = drawYAxisLine(height, xPadding, yPadding)
            svg.appendChild(yAxis);
    
            const xAxis = drawXAxisLine(width, height, xPadding, yPadding);
            svg.appendChild(xAxis);
        }
    
        function drawGraph(data) {
            const linePath = [];
            const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            svg.appendChild(dotsGroup);
    
            for (let i = 0; i < data.length; i++) {
                const point = data[i];
                const x = xPadding + pointPadding + i * xSpacing;
                currentElo += point.Elo;
                const y = height - yPadding - ((currentElo - minElo) / (maxElo - minElo)) * (height - yPadding);
                linePath.push([x, y]);
    
                const circle = createDataPoint(x, y, point, tooltip);
                dotsGroup.appendChild(circle);
            }
    
            // Create gradient path
            const gradientPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const bottomLine = `L ${linePath[linePath.length - 1][0]} ${height - yPadding} L ${linePath[0][0]} ${height - yPadding} Z`;
            gradientPath.setAttribute(
                'd',
                `M ${linePath.map(([x, y]) => `${x} ${y}`).join(' L ')} ${bottomLine}`
            );
            gradientPath.classList.add('elo-gradient');
            svg.appendChild(gradientPath);
    
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            line.setAttribute('points', linePath.map(([x, y]) => `${x},${y}`).join(' '));
            line.classList.add('elo-line');
            svg.appendChild(line);
    
            svg.appendChild(dotsGroup);
        }
    }

    function getPlayerData(targetPlayer) {
        return db.select('Ranked', row => row.PlayerName === targetPlayer).records;
    }
}


function createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('elo-graph');
    // svg.style.border = '1px solid #ccc';
    // svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // svg.setAttribute('viewBox', `0 0 1000 500`);
    return svg;
}

function createGradientDef() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'lineGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const startColor = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    startColor.setAttribute('offset', '0%');
    startColor.classList.add('gradient-start');

    const endColor = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    endColor.setAttribute('offset', '100%');
    endColor.classList.add('gradient-end');

    gradient.appendChild(startColor);
    gradient.appendChild(endColor);
    defs.appendChild(gradient);
    return defs;
}

function createTooltip(){
    const tooltip = document.createElement('div');
    tooltip.classList.add('elo-tooltip');
    return tooltip;
}

function drawYAxisLine(height, xPadding, yPadding){
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', xPadding);
    yAxis.setAttribute('y1', 0); // yPadding only from bottom
    yAxis.setAttribute('x2', xPadding);
    yAxis.setAttribute('y2', height - yPadding);
    yAxis.classList.add('y-axis');
    return yAxis;
}

function drawXAxisLine(width, height, xPadding, yPadding){
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', xPadding);
    xAxis.setAttribute('y1', height - yPadding);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height - yPadding);
    xAxis.classList.add('x-axis');
    return xAxis;
}

function drawYLabels(svg, height, xPadding, yPadding, bins, minVal, maxVal){
    const step = (height - yPadding) / bins; // Only padding from bottom
    const valStep = (maxVal - minVal) / bins;

    for (let i = 0; i <= bins; i++) {
        const y = (height - yPadding - i * step) + 10; // Offset to move labels down
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.classList.add('y-label');
        label.setAttribute('x', 0); // Ignore xPadding for labels
        label.setAttribute('y', y + 5);
        label.textContent = Math.round(minVal + i * valStep);
        svg.appendChild(label);
    }
}

function drawXLabels(svg, width, height, xPadding, yPadding, bins, dataLength){
    const step = (width - xPadding) / (bins - 1); // Adjust to ensure spacing includes the last bin
    const valStep = (dataLength - 1) / (bins - 1); // Ensure last index is included

    for (let i = 0; i < bins; i++) {
        const dataIndex = Math.round(i * valStep); // Ensure evenly spaced indexes
        const x = xPadding + pointPadding + i * step;
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.classList.add('x-label');
        label.setAttribute('x', x - 5);
        label.setAttribute('y', height - yPadding + 20);
        label.textContent = dataIndex + 1; // Label as 1-based index
        svg.appendChild(label);
    }
}

function createDataPoint(x, y, point, tooltip){
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('elo-point');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', pointRadius);
    circle.style.pointerEvents = 'all';
    circle.addEventListener('mouseover', (e) => {
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 40}px`;
        tooltip.style.display = 'block';
        tooltip.textContent = `${point.Elo > 0 ? '+' : ''}${parseFloat(point.Elo).toFixed(0)} ELO`;
    });
    circle.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });
    circle.addEventListener('click', () => {
        window.location.href = `/front/HTML/match-score?matchID=${point.MatchID}`;
    });
    return circle;
}



    // Create Dropdown
    /*const dropdown = document.createElement('select');
    dropdown.style.marginBottom = '10px';
    const options = ["Current Season", "All Time"];
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        dropdown.appendChild(opt);
    });
    containerElement.prepend(dropdown);

    dropdown.addEventListener('change', () => {
        const selectedDataSet = dropdown.value === "Current Season" ? "RankedCurrent" : "RankedAllTime";
        const data = getPlayerData(playerName, selectedDataSet);
        drawEloGraph(data);
    });*/