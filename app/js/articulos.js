export class Articulos {
    constructor(id, addProp) {

        this.contenedor = document.createElement("div");
        this.addFirstProp = addProp;
        this.addProp = addProp;
        this.id = id;

        this.firstProps = [];
        this.props = [];
    }

    setFirstProps (datos) {
        for (const key in datos) {
            if (this.addFirstProp(key)){
                this.firstProps.push(key);
            }
        }
    }
    setProps (datos) {
        for (const key in datos) {
            if (this.addProp(key)){
                this.props.push(key);
            }
        }
    }

    addArticle(articulo) {
        const article = document.createElement("article");
        article.classList.add("article-item");
        article.dataset.id = articulo[this.id];
          
        for (const prop of this.firstProps) {
            const line = document.createElement("div");
            line.classList.add("row-line");

            const claveDiv = document.createElement("p");
            claveDiv.classList.add("key-column");
            claveDiv.textContent = prop;
            line.appendChild(claveDiv);
        
            const valorDiv = document.createElement("p");
            valorDiv.classList.add("value-column");
            valorDiv.textContent = articulo[prop];
            line.appendChild(valorDiv);
        
            article.appendChild(line);
        }          

        this.contenedor.appendChild(article);
    }

    createPropertyCheckboxes() {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");
      
        const selectedCheckboxes = []; // Array para guardar los nombres de los checkboxes seleccionados
      
        for (const prop of this.firstProps) {
          const checkboxDiv = document.createElement("div");
          checkboxDiv.classList.add("property-checkbox");
      
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = prop;
          checkbox.value = prop;
          checkbox.id = prop;
      
          const label = document.createElement("label");
          label.textContent = prop;
          label.setAttribute("for", prop);
      
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);
          checkboxContainer.appendChild(checkboxDiv);
      
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
              selectedCheckboxes.push(prop); // Agregar el nombre del checkbox seleccionado al array
            } else {
              const index = selectedCheckboxes.indexOf(prop);
              if (index !== -1) {
                selectedCheckboxes.splice(index, 1); // Remover el nombre del checkbox deseleccionado del array
              }
            }
            
            const stringChecks = JSON.stringify(selectedCheckboxes);
            localStorage.setItem("checks", stringChecks);
            
          });
        }
      
        this.contenedor.appendChild(checkboxContainer);
      }
      
      
      refresh(datos) {
        this.contenedor.innerHTML = "";
        if (Array.isArray(datos) && datos.length > 0) {
          if (this.props.length == 0) {
            this.setProps(datos[0]);
            this.setFirstProps(datos[0]);
          }
      
          this.createPropertyCheckboxes();
      
          datos.forEach(articulo => {
            this.addArticle(articulo);
          });
        }
        return this.contenedor;
      }
      
    
/*     refresh(datos) {
        this.contenedor.innerHTML = "";
        if(Array.isArray(datos) && datos.length > 0){
            if(this.props.length == 0){
                this.setProps(datos[0]);
            }
            datos.forEach(articulo => {
                this.addArticle(articulo);
            });
        }
        return this.contenedor;
    } */
}
