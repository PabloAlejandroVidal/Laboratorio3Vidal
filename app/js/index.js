import { Tabla } from "./tabla.js";
import { Articulos } from "./articulos.js";
import { DataStorage } from "./datosManager.js";
import { Superheroe } from "./superheroe.js";

const $form = document.getElementById("form");
const $tableSection  = document.getElementById("table-section");
const $listSection  = document.getElementById("etiquetas-section");
const $armas = document.getElementById("armas"); 


const superheroeData = new DataStorage("superheroeData");
const tabla = new Tabla("id", (clave) => !["id"].includes(clave));
const listaArticulos = new Articulos("id", (clave) => !["id"].includes(clave));

tabla.table.setAttribute("id", "tabla-registros");
tabla.createTabla(superheroeData.getAllRecords());
const contenedor = listaArticulos.refresh(superheroeData.getAllRecords());

$tableSection.appendChild(tabla.table);
$listSection.appendChild(contenedor);


const armas = ["Armadura", "Espada", "Martillo", "Escudo", "Arma de Fuego", "Flechas"];

const stringArmas = JSON.stringify(armas);
localStorage.setItem("armas", stringArmas);

const armasFromLocal = localStorage.getItem("armas");
const parsedArmas = JSON.parse(armasFromLocal);
parsedArmas.forEach((opcion)=>{

	const optionElement = document.createElement("option");
	optionElement.value = opcion;
	optionElement.textContent = opcion;
	$armas.appendChild(optionElement); 
});




async function actualizarDom () {
	const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const overlay = document.getElementById("overlay");
	overlay.style.display = "block";
	await sleep(2000);
	overlay.style.display = "none";

	tabla.refresh(superheroeData.getAllRecords());
	listaArticulos.refresh(superheroeData.getAllRecords());
};

async function showAlert(title, message) {
	return new Promise((resolve) => {
	  const alertDiv = document.getElementById('custom-alert');
	  const titleElement = document.getElementById('custom-alert-title');
	  const messageElement = document.getElementById('custom-alert-message');
	  const acceptButton = document.getElementById('custom-alert-accept');
	  const rejectButton = document.getElementById('custom-alert-reject');
  
	  titleElement.textContent = title;
	  messageElement.textContent = message;
  
	  acceptButton.addEventListener('click', () => {
		alertDiv.style.display = 'none';
		resolve(true); // Resuelve la promesa con true al aceptar
	  });
  
	  rejectButton.addEventListener('click', () => {
		alertDiv.style.display = 'none';
		resolve(false); // Resuelve la promesa con false al rechazar
	  });
  
	  alertDiv.style.display = 'flex';
	});
}
  
  
  
  

const guardar = async (form) => {
	const {txtId, txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	const nuevoSuperheroe = new Superheroe(txtId.value, txtNombre.value, rngFuerza.value, txtAlias.value, rdoEditorial.value, slcArma.value);

	const confirmacion = await showAlert("Guardar Cambios", "¿Estás seguro de que deseas actualizar los datos?");
	//const confirmacion = confirm("¿Estás seguro de que deseas actualizar a " + txtNombre.value + "?");
	if (confirmacion){
		superheroeData.updateRecord(nuevoSuperheroe);
		actualizarDom();
		form.reset();
		mostrarBotones((boton) => ["Agregar", "Blanquear"].includes(boton.name) );
	}
}

const eliminar = async (form) =>{
	const {txtNombre, txtId} = form.elements;
	const confirmacion = await showAlert("Eliminar Registro", "¿Estás seguro de que deseas eliminar el elemento?");
//	const confirmacion = confirm("¿Estás seguro de que deseas eliminar a " + txtNombre.value + "?");

	if(confirmacion){
		superheroeData.deleteRecord(txtId.value);
		actualizarDom();
		desactivarInputs(false);
		form.reset();
		mostrarBotones((boton) => ["Agregar", "Blanquear"].includes(boton.name) );
	}
};

const modificar = () =>{
	desactivarInputs(false);
	mostrarBotones((boton) => ["Guardar", "Cancelar", "Blanquear"].includes(boton.name) );
};

const agregar = (form) =>{
	const {txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	const nuevoSuperheroe = new Superheroe(null, txtNombre.value, rngFuerza.value, txtAlias.value, rdoEditorial.value,  slcArma.value);
	superheroeData.addRecord(nuevoSuperheroe);
	actualizarDom();
	form.reset();
	mostrarBotones((boton) => ["Agregar", "Blanquear"].includes(boton.name) );
};

const divBotones = document.getElementById("botones-form");

const crearBoton = (name, valor, tipo) =>{
	const button = document.createElement("button");
	button.name = name;
	button.type = tipo;
	button.textContent = valor;
	button.classList.add("boton-form");
	button.setAttribute("id", "boton-" + name);
	button.style.display = "none";
	return button;
}

const botones = {
	Agregar: { Boton: crearBoton("Agregar", "Agregar", "submit"), Accion: agregar},
	Modificar: { Boton: crearBoton("Modificar", "Modificar", "submit"), Accion: modificar },
	Eliminar: { Boton: crearBoton("Eliminar", "Eliminar", "submit"), Accion: eliminar },
	Guardar: { Boton: crearBoton("Guardar", "Guardar", "submit"), Accion: guardar },
	Cancelar: { Boton: crearBoton("Cancelar", "Cancelar", "button") },
	Blanquear: { Boton: crearBoton("Blanquear", "Blanquear", "button") }
}

const agregarBotones = () =>{
	const fragmentBotones = document.createDocumentFragment();

	for (const key in botones) {
		const boton = botones[key];
		fragmentBotones.appendChild(boton.Boton);
	}
	divBotones.appendChild(fragmentBotones);
};

const mostrarBotones = (mostrar) =>{

	for (const key in botones) {
		const boton = botones[key];

		if(mostrar(boton.Boton)){
			boton.Boton.style.display = "block";
		}else{
			boton.Boton.style.display = "none";
		}
	}
};

const desactivarInputs = (opcion) => {
  const formulario = document.querySelector("#form");
  const inputs = formulario.querySelectorAll("input");
  const selects = formulario.querySelectorAll("select")
  inputs.forEach((input) => {
    input.disabled = opcion;
  });
  selects.forEach((select) => {
    select.disabled = opcion;
  });
};

const cargarForm = (form, dato) =>{
	const {txtId, txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	txtId.value = dato["id"];
	txtNombre.value = dato["Nombre"];
	txtAlias.value = dato["Alias"];
	rdoEditorial.value = dato["Editorial"];
	rngFuerza.value = dato["Fuerza"];
	slcArma.value = dato["Arma"];
}



botones.Blanquear.Boton.addEventListener("click", (e) =>{
	e.currentTarget.form.reset();
});

botones.Cancelar.Boton.addEventListener("click", (e) =>{
	desactivarInputs(false);
	e.currentTarget.form.reset();
});

tabla.body.addEventListener("click", (e) =>{
	const selectedRowId = e.target.parentElement.dataset.id;
	const selectedHeroe = superheroeData.getRecordById(parseInt(selectedRowId));

	if (e.target.tagName == "TD"){
		$form.txtId.value = selectedHeroe["id"];
		$form.txtNombre.value = selectedHeroe["nombre"];
		$form.txtAlias.value = selectedHeroe["alias"];
		$form.rdoEditorial.value = selectedHeroe["editorial"];
		$form.rngFuerza.value = selectedHeroe["fuerza"];
		$form.slcArma.value = selectedHeroe["arma"];

		desactivarInputs(true);
		mostrarBotones((boton) => ["Modificar", "Eliminar", "Cancelar"].includes(boton.name) )
	}
});

$form.addEventListener("submit", (e) =>{
  e.preventDefault();
  botones[e.submitter.name].Accion($form);
});


window.addEventListener("DOMContentLoaded", () => {
	agregarBotones();
	mostrarBotones((boton) => ["Agregar", "Blanquear"].includes(boton.name) )
});