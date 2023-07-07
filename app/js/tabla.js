export class Tabla {
    constructor(id, addColumn) {

        this.table = document.createElement("table");
        this.head = document.createElement("thead");
        this.body = document.createElement("tbody");
        this.table.appendChild(this.head);
        this.table.appendChild(this.body);

        this.addColumn = addColumn;
        this.id = id;

        this.columns = [];
        this.rows = {};
    }

    createTabla(datos) {
        if (Array.isArray(datos)){
            this.setCulumns(datos);
            this.createHeader(datos);
            this.createBody(datos);
            return this.table;
        }
    }

    setCulumns (datos) {
        for (const key in datos[0]) {
            if (this.addColumn(key)){
                this.columns.push(key);
            }
        }
    }

    createHeader(datos) {
        this.head.innerHTML = "";
        const headRow = document.createElement("tr");

        if(datos && datos.length > 0){

            for (const column of this.columns) {
                
                const th = document.createElement("th");
                th.classList.add(column);
                th.textContent = column;
                headRow.appendChild(th);
            }
        }
        this.head.appendChild(headRow);
    }

    createBody(datos) {
        this.body.innerHTML = "";
        if(datos && datos.length > 0){
            datos.forEach((dato) => {
                this.createRow(dato);
            });
        }
    }

    createRow(dato) {
        const tr = document.createElement("tr");
        tr.dataset.id = dato[this.id];
        for (const column of this.columns) {
            const td = document.createElement("td");
            td.classList.add(column);
            td.textContent = dato[column];
            tr.appendChild(td);
        }
        this.rows[dato[this.id]] = tr;
        this.body.appendChild(tr);
        return tr;
    }

    updateRow(dato) {
        this.rows[dato[this.id]] = this.createRow(dato);
    }

    deleteRow(dato) {
        const row = this.rows[dato[this.id]];
        this.body.removeChild(row);
    }
    
    refresh(datos) {
        if( this.columns.length == 0){
            this.createTabla(datos);
        }
        this.createBody(datos);
    }      
}
