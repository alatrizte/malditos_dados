import { Dice } from './Dice.js';
import { gridPositions } from './Dice.js';
import { contarGrupos } from './contar_grupos.js';
import { diceMap } from './dice_map.js';
import { generateUniquePosition } from './utils.js';
import { getRandomNumber } from './utils.js';
import { activateRandomDice } from './utils.js';
import { crearMatrizDePosiciones } from './utils.js';
import { DynamicInterval } from './DinamicalInternal.js';
import { incrementarValor } from './utils.js';

// Función para emular el evento 'keydown'
function emulateKey(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}
// Añadir los event listeners para los botones de la cruceta
document.querySelector('.arrow.up').addEventListener('click', () => {
    emulateKey('ArrowUp');
});

document.querySelector('.arrow.left').addEventListener('click', () => {
    emulateKey('ArrowLeft');
});

document.querySelector('.arrow.right').addEventListener('click', () => {
    emulateKey('ArrowRight');
});

document.querySelector('.arrow.down').addEventListener('click', () => {
    emulateKey('ArrowDown');
});

const canvas = document.getElementById("canvas");
// const print_button = document.getElementById("print");
const control_button = document.getElementById("control");
const marcador = document.getElementById("marcador");

let tiempoParado = false;

if (canvas.getContext) {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.width = 310;
    canvas.height = 310;
    
    let puntuacion = 0;
    marcador.innerHTML = puntuacion;

    ////////// Tiempo inicial de aparición de dados ///////
    let timer = 5000;
    ///////////////////////////////////////////////////////

    let usedPositions = [];
    // Ahora, creamos un array para almacenar los dados
    let dices = [];

    // lista de números que han eliminado
    const del_num = {
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1
    }

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

            if (dices.length == 36) {
                document.getElementsByClassName("game-over")[0].style.display = "block";
                control_button.textContent = "Nueva Partida";
                control_button.classList.add("reload");
                intervalo.stop();
                tiempoParado = true;
            }
        }
    }

    // Borrar dados
    function deleteDices(number){
        // Guardamos la longitud original del array
        const longitudOriginal = dices.length;

        dices = dices.filter(dice => dice.numberFace !== number || dice.active === true);

        // Calculamos la diferencia
        const elementosEliminados = longitudOriginal - dices.length;

        puntuacion += elementosEliminados * number * del_num[number];
        document.getElementById(`${number}x`).innerHTML = `${number}x<span>${del_num[number].toString().padStart(2, '0')}</span>`;

        // añadimos a la lista de números eliminados
        incrementarValor(del_num, number);
        
        timer -= puntuacion;
        timer < 1000 ? timer = 1000 : timer = timer


        intervalo.setDelay(timer);
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
        if (!tiempoParado) {
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
        }
    });

    // Iniciamos creando 6 dados aleatorios
    for (let i = 1; i <= 6; i++) {
        addNewObject(dices)
    }
    
    // De los 6 dados activamos uno aleatoriamente
    activateRandomDice(dices);

    // Función para iniciar el intervalo
    const intervalo = new DynamicInterval(() => addNewObject(dices), timer);

    // animate
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
    intervalo.start();

    // print_button.addEventListener("click", (e) => {
    //     console.log("OBJETOS:");
    //     console.log(dices);
    //     console.log(usedPositions);
    //     const objetoActivo = dices.find(objeto => objeto.active === true);
    //     checkForMatches(objetoActivo);
    // })

    // Evento para el botón de control
    control_button.addEventListener('click', function() {
        if (this.classList.contains("reload")) {
            location.reload()
        } else if (this.classList.contains('paused')) {
            // Si está pausado, reiniciar el intervalo
            // startInterval();
            intervalo.start();
            this.classList.remove('paused');
            this.textContent = 'Pausar';
            tiempoParado = false;
            console.log("Tiempo reiniciado");
        } else {
            // Si está en marcha, detener el intervalo
            // stopInterval();
            intervalo.stop();
            this.classList.add('paused');
            this.textContent = 'Reanudar';
            tiempoParado = true;
            console.log("Tiempo pausaoo");
        }
    });
}

