

class MapGenerator {
    constructor() {
        const initialMap = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, -1, -1, -1, -1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1],
            [-1, -1, -1, 0, -1, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, -1, 0, 0, -1, -1, -1, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        ];

        this.map = initialMap;
    }

    getMap() {
        return this.map;
    }

    setCat(pos) {
        this.map[pos.x][pos.y] = -2;
    }

    setExit(pos) {
        this.map[pos.x][pos.y] = -3;
    }
}

class MapPrinter {
    printRawData(map) {
        let output = "";

        for (const row of map) {
            for (const cell of row) {
                output += String(cell).padStart(5, " ");
            }
            output += "\n";
        }
        output += "\n".repeat(3);

        return output;
    }

    printColoredMap(map) {
        let output = "";

        for (const row of map) {
            for (const cell of row) {
                switch (cell) {
                    case 0:
                        output += "░";
                        break;
                    case -1:
                        output += "▓";
                        break;
                    case -2:
                        output += "К";
                        break;
                    case -3:
                        output += "E";
                        break;
                    default:
                        output += " ";
                }
            }
            output += "\n";
        }
        output += "\n".repeat(3);
        return output;
    }
}

class WaveAlgorithm {
    constructor(map) {
        this.map = map;
    }

    colorize(startPoint) {
        const queue = [];
        queue.push(startPoint);
        this.map[startPoint.x][startPoint.y] = 1;

        while (queue.length > 0) {
            const p = queue.shift();

            if (this.map[p.x - 1]?.[p.y] === 0) {
                queue.push({ x: p.x - 1, y: p.y });
                this.map[p.x - 1][p.y] = this.map[p.x][p.y] + 1;
            }
            if (this.map[p.x]?.[p.y - 1] === 0) {
                queue.push({ x: p.x, y: p.y - 1 });
                this.map[p.x][p.y - 1] = this.map[p.x][p.y] + 1;
            }
            if (this.map[p.x + 1]?.[p.y] === 0) {
                queue.push({ x: p.x + 1, y: p.y });
                this.map[p.x + 1][p.y] = this.map[p.x][p.y] + 1;
            }
            if (this.map[p.x]?.[p.y + 1] === 0) {
                queue.push({ x: p.x, y: p.y + 1 });
                this.map[p.x][p.y + 1] = this.map[p.x][p.y] + 1;
            }
        }
    }

    getRoad(exit) {
        const road = [];
        let currentPoint = exit;

        while (this.map[currentPoint.x][currentPoint.y] !== 1){
            road.push(currentPoint);

            const currentValue = this.map[currentPoint.x][currentPoint.y];
            let nextPoint = null;

            if (this.map[currentPoint.x - 1]?.[currentPoint.y] === currentValue - 1) {
                nextPoint = {x: currentPoint.x - 1, y: currentPoint.y};
                
            }else if (this.map[currentPoint.x]?.[currentPoint.y - 1] === currentValue - 1){
                nextPoint = {x: currentPoint.x, y: currentPoint.y - 1}; 
            }else if (this.map[currentPoint.x + 1]?.[currentPoint.y] === currentValue - 1){
                nextPoint = {x: currentPoint.x + 1, y: currentPoint.y}; 
            }else if (this.map[currentPoint.x]?.[currentPoint.y + 1] === currentValue - 1){
                nextPoint = {x: currentPoint.x, y: currentPoint.y + 1}; 
            }
            if (!nextPoint){
                throw new Error("Путь не найден")
            }

            currentPoint = nextPoint;
                      
        }

        road.push(currentPoint);
        road.reverse();

        return road;
    }
}

const main = () => {
    const mapGenerator = new MapGenerator();
    console.log(new MapPrinter().printColoredMap(mapGenerator.getMap()));

    const waveAlgorithm = new WaveAlgorithm(mapGenerator.getMap());
    waveAlgorithm.colorize({ x: 3, y: 3 });

    const road = waveAlgorithm.getRoad({ x: 12, y: 12 });
    console.log(road);

    console.log(new MapPrinter().printRawData(mapGenerator.getMap()));
}

main();
