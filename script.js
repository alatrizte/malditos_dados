import { Dice } from './Dice.js';
import { gridPositions } from './Dice.js';
import { contarGrupos } from './contar_grupos.js';
import { diceMap } from './dice_map.js';
import { generateUniquePosition } from './utils.js';
import { getRandomNumber } from './utils.js';
import { activateRandomDice } from './utils.js';
import { crearMatrizDePosiciones } from './utils.js';

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
    
    let puntuacion = 0;
    marcador.innerHTML = puntuacion;
    let timer = 7000;

    let usedPositions = [];
    // Ahora, creamos un array para almacenar los dados
    let dices = [];

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

    function deleteDices(number){
        // Guardamos la longitud original del array
        const longitudOriginal = dices.length;

        dices = dices.filter(dice => dice.numberFace !== number || dice.active === true);

        // Calculamos la diferencia
        const elementosEliminados = longitudOriginal - dices.length;

        puntuacion += elementosEliminados * number
        timer -= puntuacion * 10;
        console.log(puntuacion);
        marcador.innerHTML = puntuacion;
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

        usedPositions = []
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
        console.log("OBJETOS:");
        console.log(dices);
        console.log(usedPositions);
        const objetoActivo = dices.find(objeto => objeto.active === true);
        checkForMatches(objetoActivo);
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

