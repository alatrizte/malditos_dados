export function contarGrupos(grid, number) {
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