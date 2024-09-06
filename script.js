import { Dice } from './Dice.js';

const canvas = document.getElementById("canvas");
const print_button = document.getElementById("print");
const control_button = document.getElementById("control");
const marcador = document.getElementById("marcador");
let intervalId; 

if (canvas.getContext) {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.width = 310;
    canvas.height = 310;
    
    const gridSize = 6; // Tamaño de la cuadrícula (6x6)
    const squareSize = 50; // Tamaño de cada cuadrado (50px * 50px)
    const offset = 5; // Offset inicial para x e y
    const gridPositions = {};

    let puntuacion = 0;
    marcador.innerHTML = puntuacion;
    let timer = 7000;

    // Itera sobre las filas y columnas de la cuadrícula
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const position = row * gridSize + col + 1;
            const x = offset + col * squareSize;
            const y = offset + row * squareSize;
            gridPositions[position] = { x: x, y: y };
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
                    console.log(`checkeando matches de ${activeDice.numberFace}`);
                }
            }
            else {
                isOccupied.active = true;
                activeDice.active = false;
            }
        }
    });

    function crearMatrizDePosiciones(posiciones, filas=6, columnas=6) {
        // Crear una matriz llena de ceros
        const matriz = Array.from({ length: filas }, () => Array(columnas).fill(0));
    
        // Llenar la matriz basándose en las posiciones dadas
        posiciones.forEach(posicion => {
            if (posicion > 0 && posicion <= filas * columnas) {
                const fila = Math.floor((posicion - 1) / columnas);
                const columna = (posicion - 1) % columnas;
                matriz[fila][columna] = 1;
            }
        });
    
        return matriz;
    }

    function contarGrupos(grid, number) {
        const filas = grid.length;
        const columnas = grid[0].length;
        const visitados = Array.from({ length: filas }, () => Array(columnas).fill(false));
        const grupos = [];
    
        function dfs(x, y) {
            if (x < 0 || y < 0 || x >= filas || y >= columnas || visitados[x][y] || grid[x][y] === 0) {
                return 0;
            }
    
            visitados[x][y] = true;
            let tamaño = 1;
    
            // Explorar las cuatro direcciones
            tamaño += dfs(x - 1, y); // arriba
            tamaño += dfs(x + 1, y); // abajo
            tamaño += dfs(x, y - 1); // izquierda
            tamaño += dfs(x, y + 1); // derecha
    
            return tamaño;
        }
    
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (grid[i][j] === 1 && !visitados[i][j]) {
                    const tamaño = dfs(i, j);
                    if (tamaño == number){
                        grupos.push(tamaño);
                    }
                }
            }
        }
    
        return grupos;
    }

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
        // console.log(diceGroup);
        let matrizResultante = crearMatrizDePosiciones(diceGroup);

        let gruposEncontrados = contarGrupos(matrizResultante, number);
        if (gruposEncontrados.length > 0){
            deleteDices(number);
            // matrizResultante.forEach(fila => console.log(fila.join(' ')));
        };
        
    }

    function deleteDices(number){
        // Guardamos la longitud original del array
        const longitudOriginal = dices.length;

        dices = dices.filter(dice => dice.numberFace !== number || dice.active === true);

        // Calculamos la diferencia
        const elementosEliminados = longitudOriginal - dices.length;

        puntuacion += elementosEliminados * number
        timer -= puntuacion * 10;
        console.log(puntuacion);
        startInterval();
        marcador.innerHTML = puntuacion;
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
            if (dices.length < 36){
            const newKey = Object.keys(dict).length + 1;
            let numberFace = getRandomNumber(1, maxN);
            let position = generateUniquePosition(usedPositions, maxPosition);
            usedPositions.push(position);
            // Creamos un nuevo dado y lo añadimos al array
            let dice = new Dice(position, numberFace);
            dices.push(dice);
        } else  {
            console.log("Game OVER");
            stopInterval();
        }

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

    // Función para iniciar el intervalo
    function startInterval() {
        intervalId = setInterval(() => {
            addNewObject(dices);
        }, timer);
    }

    // Función para detener el intervalo
    function stopInterval() {
        clearInterval(intervalId);
    }
    

    function animate() {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar fondo
        ctx.fillStyle = "#6b7f82";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Actualizar y dibujar cada dado
        for (let dice of dices) {
            dice.update(ctx);
            if (!usedPositions.includes(dice.position)){
                usedPositions.push(dice.position);
            }
        }

        // Solicitar el siguiente cuadro de animación
        window.requestAnimationFrame(animate);
    }
    animate();
    startInterval();

    print_button.addEventListener("click", (e) => {
        console.log(dices);
        console.log(timer)
        // const objetoActivo = dices.find(objeto => objeto.active === true);
    })

    // Evento para el botón de control
    control_button.addEventListener('click', function() {
        if (this.classList.contains('paused')) {
            // Si está pausado, reiniciar el intervalo
            startInterval();
            this.classList.remove('paused');
            this.textContent = 'Pausar';
        } else {
            // Si está en marcha, detener el intervalo
            stopInterval();
            this.classList.add('paused');
            this.textContent = 'Reanudar';
        }
    });
}

