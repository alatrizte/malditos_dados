export const gridPositions = {};
const gridSize = 6; // Tamaño de la cuadrícula (6x6)
const squareSize = 50; // Tamaño de cada cuadrado (50px * 50px)
const offset = 5; // Offset inicial para x e y

// Itera sobre las filas y columnas de la cuadrícula
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let position = row * gridSize + col + 1;
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
        // Cuadrado con esquinas redondeadas
        function fillRectRound(ctx, x, y, lado, radio, color) {
            ctx.strokeStyle = "#8eb8e5";
            ctx.lineWidth = 2; // Grosor de la línea
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + radio, y);
            ctx.lineTo(x + lado - radio, y);
            ctx.quadraticCurveTo(x + lado, y, x + lado, y + radio);
            ctx.lineTo(x + lado, y + lado - radio);
            ctx.quadraticCurveTo(x + lado, y + lado, x + lado - radio, y + lado);
            ctx.lineTo(x + radio, y + lado);
            ctx.quadraticCurveTo(x, y + lado, x, y + lado - radio);
            ctx.lineTo(x, y + radio);
            ctx.quadraticCurveTo(x, y, x + radio, y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        let color
        // Dibujar el cuadrado
        if (this.active) {
            color = '#8eb8e5'; // Color del borde
        } else {
            color = '#7c99b4';
        }
        
        // ctx.fillRect(this.coord_position.x, this.coord_position.y, squareSize, squareSize);
        fillRectRound(ctx, this.coord_position.x, this.coord_position.y, 50, 10, color);

        // Dibujar el número en el centro del cuadrado
        if (this.active) {
            ctx.fillStyle = '#492c1d'; // Color del texto
        } else {
            ctx.fillStyle = 'white'; 
        }
        // ctx.font = 'bold 24px Ubuntu'; // Fuente del texto
        // ctx.textAlign = 'center'; // Alinear el texto al centro
        // ctx.textBaseline = 'middle'; // Alinear verticalmente al medio
        // ctx.fillText(this.numberFace, this.coord_position.x + squareSize / 2, this.coord_position.y + squareSize / 2);

        // Coordenadas para los 6 puntos del dado
        const dict_lados = {
            6 : [
                    [12.5, 12.5],  // Superior izquierdo
                    [12.5, 25], // Medio izquierdo
                    [12.5, 37.5], // Inferior izquierdo
                    [37.5, 12.5], // Superior derecho
                    [37.5, 25], // Medio derecho
                    [37.5, 37.5]  // Inferior derecho
                ],

            5 : [
                    [12.5, 12.5],  // Superior izquierdo
                    [12.5, 37.5], // Inferior izquierdo
                    [25, 25], // Medio Medio
                    [37.5, 12.5], // Superior derecho
                    [37.5, 37.5]  // Inferior derecho
                ],
            4 : [
                    [12.5, 12.5],  // Superior izquierdo
                    [12.5, 37.5], // Inferior izquierdo
                    [37.5, 12.5], // Superior derecho
                    [37.5, 37.5]  // Inferior derecho
                ],
            3 : [
                    [12.5, 12.5],  // Superior izquierdo
                    [25, 25], // Medio Medio
                    [37.5, 37.5]  // Inferior derecho
                ],
            2 : [
                    [12.5, 12.5],  // Superior izquierdo
                    [37.5, 37.5]  // Inferior derecho
                ],
            1 : [
                    [25, 25], // Medio Medio
                ]
        }
        // Dibujar los círculos
        let puntos = dict_lados[this.numberFace];
        for (var i = 0; i < puntos.length; i++) {
            var x = puntos[i][0];
            var y = puntos[i][1];
            ctx.beginPath();
            ctx.arc(this.coord_position.x+x, this.coord_position.y+y, 6, 0, 2 * Math.PI);  // Dibujar círculo con radio de 15
            ctx.fill();
        }
    }

    update(ctx) {
        this.draw(ctx);
    }
}
