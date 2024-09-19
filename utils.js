
// Funciones auxiliares (mantén las que ya teníamos)
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUniquePosition(usedPositions, maxPosition) {
    let randomPos;
    do {
        randomPos = getRandomNumber(1, maxPosition);
    } while (usedPositions.includes(randomPos));
    return randomPos;
}


export function activateRandomDice(dices) {
    // Seleccionar un dado aleatorio
    const randomIndex = Math.floor(Math.random() * dices.length);
    const selectedDice = dices[randomIndex];

    // Activar el dado seleccionado
    selectedDice.active = true;
}

export function crearMatrizDePosiciones(posiciones, filas=6, columnas=6) {
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
};