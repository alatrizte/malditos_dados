const gridPositions = {};
const gridSize = 6; // Tamaño de la cuadrícula (6x6)
const squareSize = 50; // Tamaño de cada cuadrado (50px * 50px)
const offset = 5; // Offset inicial para x e y

// Itera sobre las filas y columnas de la cuadrícula
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const position = row * gridSize + col + 1;
        const x = offset + col * squareSize;
        const y = offset + row * squareSize;
        gridPositions[position] = { x: x, y: y };
    }
}

export class Dice {
    constructor(position, numberFace, active=false) {
        this.position = position;
        this.coord_position = { ...gridPositions[position] };
        this.numberFace = numberFace;
        this.active = active;
    }

    draw(ctx) {
        // Dibujar el cuadrado
        if (this.active) {
            ctx.fillStyle = '#8eb8e5'; // Color del borde
        } else {
            ctx.fillStyle = '#7c99b4';
        }
        
        ctx.fillRect(this.coord_position.x, this.coord_position.y, squareSize, squareSize);

        // Dibujar el número en el centro del cuadrado
        if (this.active) {
            ctx.fillStyle = '#492c1d'; // Color del texto
        } else {
            ctx.fillStyle = 'white'; 
        }
        ctx.font = 'bold 24px Ubuntu'; // Fuente del texto
        ctx.textAlign = 'center'; // Alinear el texto al centro
        ctx.textBaseline = 'middle'; // Alinear verticalmente al medio
        ctx.fillText(this.numberFace, this.coord_position.x + squareSize / 2, this.coord_position.y + squareSize / 2);
    }

    update(ctx) {
        this.draw(ctx);
    }
}
