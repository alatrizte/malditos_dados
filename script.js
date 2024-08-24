const canvas = document.getElementById("canvas");
if (canvas.getContext) {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.width = 310;
    canvas.height = 310;
    
    const gridSize = 6; // Tamaño de la cuadrícula (6x6)
    const squareSize = 50; // Tamaño de cada cuadrado (50px * 50px)
    const offset = 5; // Offset inicial para x e y
    const gridPositions = {};

    // Itera sobre las filas y columnas de la cuadrícula
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const position = row * gridSize + col + 1;
            const x = offset + col * squareSize;
            const y = offset + row * squareSize;
            gridPositions[position] = { x: x, y: y };
        }
    }

    class Dice {
        constructor(position, numberFace, active=false) {
            this.position = position;
            this.coord_position = { ...gridPositions[position] };
            this.numberFace = numberFace;
            this.active = active;
        }
        
        draw() {
            // Dibujar el cuadrado
            if (this.active) {
                ctx.strokeStyle = 'green'; // Color del borde
            } else {
                ctx.strokeStyle = 'red';
            }
            
            ctx.strokeRect(this.coord_position.x, this.coord_position.y, squareSize, squareSize);

            // Dibujar el número en el centro del cuadrado
            if (this.active) {
                ctx.fillStyle = 'green'; // Color del texto
            } else {
                ctx.fillStyle = 'red'; 
            }
            ctx.font = '20px Arial'; // Fuente del texto
            ctx.textAlign = 'center'; // Alinear el texto al centro
            ctx.textBaseline = 'middle'; // Alinear verticalmente al medio
            ctx.fillText(this.numberFace, this.coord_position.x + squareSize / 2, this.coord_position.y + squareSize / 2);
        }

        update() {
            this.draw();
        }
    }

    // Mapeo de las caras del dado según la dirección de la tecla
    const diceMap = {
        1: { ArrowLeft: {number: 3, x: -50, y: 0}, 
            ArrowRight: {number: 4, x: 50, y: 0},
            ArrowUp: {number: 5, x: 0, y: -50},
            ArrowDown: {number: 2, x: 0, y: 50} 
        },
        2: { ArrowLeft: {number: 4, x: -50, y: 0}, 
            ArrowRight: {number: 3, x: 50, y: 0}, 
            ArrowUp: {number: 1, x: 0, y: -50}, 
            ArrowDown: {number: 6, x: 0, y: 50} 
        },
        3: { ArrowLeft: {number: 5, x: -50, y: 0}, 
            ArrowRight: {number: 2, x: 50, y: 0}, 
            ArrowUp: {number: 1, x: 0, y: -50}, 
            ArrowDown: {number: 6, x: 0, y: 50} 
        },
        4: { ArrowLeft: {number: 6, x: -50, y: 0}, 
            ArrowRight: {number: 1, x: 50, y: 0}, 
            ArrowUp: {number: 5, x: 0, y: -50}, 
            ArrowDown: {number: 2, x: 0, y: 50} 
        },
        5: { ArrowLeft: {number: 3, x: -50, y: 0}, 
            ArrowRight: {number: 4, x: 50, y: 0}, 
            ArrowUp: {number: 6, x: 0, y: -50}, 
            ArrowDown: {number: 1, x: 0, y: 50} 
        },
        6: { ArrowLeft: {number: 3, x: -50, y: 0}, 
            ArrowRight: {number: 4, x: 50, y: 0}, 
            ArrowUp: {number: 2, x: 0, y: -50}, 
            ArrowDown: {number: 5, x: 0, y: 50} 
        },
    };

    // Escucha las teclas de flecha
    document.addEventListener('keydown', (event) => {
        const { key } = event;
    
        // Encontrar el dado que está activo
        let activeDice = dices.find(dice => dice.active);
    
        if (key.startsWith('Arrow') && activeDice) {
            // Verificar los límites del tablero
            if (activeDice.coord_position.x >= 255 && key == "ArrowRight") return;
            if (activeDice.coord_position.x <= 5 && key == "ArrowLeft") return;
            if (activeDice.coord_position.y >= 255 && key == "ArrowDown") return;
            if (activeDice.coord_position.y <= 5 && key == "ArrowUp") return;
    
            // Calcular la nueva posición
            const newX = activeDice.coord_position.x + diceMap[activeDice.numberFace][key].x;
            const newY = activeDice.coord_position.y + diceMap[activeDice.numberFace][key].y;
            
            // Verificar si la nueva posición está ocupada
            const isOccupied = dices.find(dice => dice.coord_position.x === newX && dice.coord_position.y === newY);

            if (!isOccupied) {
                // Mover el dado según el mapeo de teclas y actualizar la posición
                activeDice.coord_position.x = newX;
                activeDice.coord_position.y = newY;
                activeDice.numberFace = diceMap[activeDice.numberFace][key].number;

                // Actualizar la posición del dado en el tablero
                for (const [k, v] of Object.entries(gridPositions)) {
                    if (v.x === activeDice.coord_position.x && v.y === activeDice.coord_position.y) {
                        activeDice.position = parseInt(k);
                        break; // Rompe el ciclo una vez que se encuentra la coincidencia
                    }
                }

                // Después de mover, verificar si hay dados adyacentes con la misma cara
                checkForMatches();
            }
            else {
                isOccupied.active = true;
                activeDice.active = false;
            }
        }
    });

    // Verificar si hay dados adyacentes con el mismo numberFace
    function checkForMatches() {
        // Agrupar los dados por su numberFace
        let diceGroups = {};
        for (let dice of dices) {
            if (dice.numberFace > 1){
                if (!diceGroups[dice.numberFace]) {
                    diceGroups[dice.numberFace] = [];
                }
                diceGroups[dice.numberFace].push(dice);
            }
        }

        // Verificar cada grupo
        for (let face in diceGroups) {
            let group = diceGroups[face];

            // Verificar si hay suficientes dados adyacentes para que desaparezcan
            if (group.length >= face) {
                let toRemove = [];

                // Ordenar por posición en el tablero para facilitar la comparación
                group.sort((a, b) => a.position - b.position);
                // Verificar si están consecutivamente adyacentes
                for (let i = 0; i <= group.length - face; i++) {
                    let consecutive = true;

                    for (let j = 0; j < face - 1; j++) {
                        let currentPos = group[i + j].position;
                        let nextPos = group[i + j + 1].position;

                        if (!areAdjacent(currentPos, nextPos)) {
                            consecutive = false;
                            break;
                        }
                    }

                    if (consecutive) {
                        const itemNoActivo = group.filter(item => item.active !== true);
                        toRemove.push(...itemNoActivo);
                    }
                }

                // Eliminar los dados que coinciden
                if (toRemove.length > 0) {
                    dices = dices.filter(dice => !toRemove.includes(dice));
                }
            }
        }
    }

    // Verificar si dos posiciones son adyacentes
    function areAdjacent(pos1, pos2) {
        const pos1Coord = gridPositions[pos1];
        const pos2Coord = gridPositions[pos2];

        return (
            (pos1Coord.x === pos2Coord.x && Math.abs(pos1Coord.y - pos2Coord.y) === squareSize) || // Verticalmente adyacente
            (pos1Coord.y === pos2Coord.y && Math.abs(pos1Coord.x - pos2Coord.x) === squareSize)    // Horizontalmente adyacente
        );
    }

    // let dictPositions = {
    //     1:{pos:1, active:true, n: 1},
    //     2:{pos:15, active:false, n: 3},
    //     3:{pos:17, active:false, n: 3},
    // }
    // Función para generar un número aleatorio entre 1 y 36
    function getRandomPosition() {
        return Math.floor(Math.random() * 36) + 1;
    }

    // Función para generar el nuevo diccionario
    function generateRandomDictPositions() {
        let newDict = {};
        let usedPositions = new Set();
        let activeIndex = Math.floor(Math.random() * 3) + 1; // Elegimos aleatoriamente cuál será el elemento activo

        for (let i = 1; i <= 8; i++) {
            let randomPos;
            do {
                randomPos = getRandomPosition();
            } while (usedPositions.has(randomPos));

            usedPositions.add(randomPos);

            newDict[i] = {
                pos: randomPos,
                active: i === activeIndex, // Solo será true para el elemento elegido
                n: Math.floor(Math.random() * 6) + 1 // Número aleatorio entre 1 y 3
            };
        }

        return newDict;
    }

    // Generar el nuevo diccionario
    let dictPositions = generateRandomDictPositions();

    // Ahora, creamos un array para almacenar los dados
    let dices = [];
    // Iteramos sobre el diccionario para crear los dados
    for (let key in dictPositions) {
        // Convertimos la clave a número y lo usamos como numberFace
        let numberFace = dictPositions[key].n;
        
        // Usamos el valor de 'pos' como position
        let position = dictPositions[key].pos;
        // Usamos el valor de 'active' como active
        let active = dictPositions[key].active;
        
        // Creamos un nuevo dado y lo añadimos al array
        let dice = new Dice(position, numberFace, active);
        dices.push(dice);
    }   

    function animate() {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar fondo
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Actualizar y dibujar cada dado
        for (let dice of dices) {
            dice.update();
        }

        // Solicitar el siguiente cuadro de animación
        window.requestAnimationFrame(animate);
    }
    animate();
}
