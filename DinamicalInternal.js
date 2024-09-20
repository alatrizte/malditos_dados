export class DynamicInterval {
    constructor(callback, delay) {
        if (typeof callback !== 'function') {
            throw new TypeError('El callback debe ser una función');
        }
        this.callback = callback; // Función a ejecutar
        this.delay = delay;       // Intervalo inicial en milisegundos
        this.timerId = null;      // ID del timeout
        this.running = false;     // Estado del intervalo
    }

    // Inicia el intervalo
    start() {
        if (!this.running) {
            this.running = true;
            this._tick();
        }
    }

    // Detiene el intervalo
    stop() {
        if (this.running) {
            clearTimeout(this.timerId);
            this.running = false;
        }
    }

    // Actualiza el intervalo de tiempo
    setDelay(newDelay) {
        this.delay = newDelay;
        if (this.running) {
            clearTimeout(this.timerId);
            this._tick();
        }
    }

    // Función interna para manejar el timeout
    _tick() {
        if (!this.running) return;
        this.timerId = setTimeout(() => {
            this.callback();
            this._tick();
        }, this.delay);
    }
}
