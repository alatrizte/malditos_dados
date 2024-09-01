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
                let actualPosition = activeDice.position;
                // Actualizar la posición del dado en el tablero
                for (const [k, v] of Object.entries(gridPositions)) {
                    if (v.x === activeDice.coord_position.x && v.y === activeDice.coord_position.y) {
                        activeDice.position = parseInt(k);
                        break; // Rompe el ciclo una vez que se encuentra la coincidencia
                    }
                }
                usedPositions = usedPositions.filter(item => item !== actualPosition);
                usedPositions.push(activeDice.position);                

                // Después de mover, verificar si hay dados adyacentes con la misma cara
                if (activeDice.numberFace > 1){
                    checkForMatches(activeDice.numberFace);
                }
            }
            else {
                isOccupied.active = true;
                activeDice.active = false;
            }
        }
    });

    // Verificar si hay dados adyacentes con el mismo numberFace
    function checkForMatches(number) {
        // Agrupar los dados por su numberFace
        let diceGroup = [];
        for (let dice of dices){
            if (dice.numberFace == number){
                diceGroup.push(dice.position);
            }
        }
        diceGroup.sort((a, b) => a - b);
        let count = 1;
        console.log(diceGroup);
        for (let i=0; i < diceGroup.length; i++){
            if (diceGroup[i] == diceGroup[i+1] - 1){
                count++;
            }
            if (diceGroup[i] == diceGroup[i+1] - 6){
                count++;
            }
            if (diceGroup[i+1] == diceGroup[i+2] - 5){
                count++;
            }
            if (diceGroup[i] == diceGroup[i+1] - 5 && diceGroup[i+1] == diceGroup[i+2] - 1){
                count++;
            }
            console.log(count);
            if (count >= number){
                console.log("Exito!!!");
                // deleteDices(number);
            }
        }
    }
    function deleteDices(number){
        dices = dices.filter(dice => dice.numberFace !== number || dice.active === true);
    }


    // Funciones auxiliares (mantén las que ya teníamos)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateUniquePosition(usedPositions, maxPosition) {
        let randomPos;
        do {
            randomPos = getRandomNumber(1, maxPosition);
        } while (usedPositions.includes(randomPos));
        return randomPos;
    }

    let usedPositions = [];
    // Función para añadir un nuevo objeto
    function addNewObject(dict, maxPosition=36, maxN=6) {
        const newKey = Object.keys(dict).length + 1;
        let numberFace = getRandomNumber(1, maxN);
        let position = generateUniquePosition(usedPositions, maxPosition);
        usedPositions.push(position);
        // Creamos un nuevo dado y lo añadimos al array
        let dice = new Dice(position, numberFace);
        dices.push(dice);
    }

    function activateRandomDice(dices) {
        // Seleccionar un dado aleatorio
        const randomIndex = Math.floor(Math.random() * dices.length);
        const selectedDice = dices[randomIndex];
    
        // Activar el dado seleccionado
        selectedDice.active = true;
    }

    // Ahora, creamos un array para almacenar los dados
    let dices = [];

    for (let i = 1; i <= 6; i++) {
        addNewObject(dices)
    }

    activateRandomDice(dices);

    // Añadir un nuevo objeto cada 15 segundos
    // setInterval(() => {
    //     addNewObject(dices);
    // }, 7000);

    function animate() {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar fondo
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Actualizar y dibujar cada dado
        for (let dice of dices) {
            dice.update();
            if (!usedPositions.includes(dice.position)){
                usedPositions.push(dice.position);
            }
        }

        // Solicitar el siguiente cuadro de animación
        window.requestAnimationFrame(animate);
    }
    animate();
}
