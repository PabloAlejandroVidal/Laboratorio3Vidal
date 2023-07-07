export class Lista {
    constructor(options = {}) {
        this.lista = document.createElement("ul");
        this.options = options;
        this.items = [];
    }

    crearLista(datos) {
        if (Array.isArray(datos)) {
        this.items = datos.map((dato) => this.crearItem(dato));
        this.items.forEach((item) => this.lista.appendChild(item));
        return this.lista;
        }
    }

    crearItem(dato) {
        const li = document.createElement("li");
        for (const key in dato) {
        if (dato.hasOwnProperty(key)) {
            const span = document.createElement("span");
            span.textContent = `${key}: ${dato[key]}`;
            li.appendChild(span);
        }
        }
        return li;
    }
}
  