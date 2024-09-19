// Mapeo de las caras del dado según la dirección de la tecla
export const diceMap = {
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