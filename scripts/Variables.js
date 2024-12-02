// Declaración de variables principales
let canvas;
let ctx;

//Arrays de los obstaculos del juego (Coches y troncos)
let arrayCoches = [];
let arrayTroncos = [];

// Variables en relación con el estado de la rana
let rana;
let posicion = 0; 
let inicial = 0;
let puntuacion = 0;
let velocidadJuego = 1;

 // Estados del juego
let asalvo = false;
let muerte = false;

// Movimientos de la rana
let xDerecha;
let xIzquierda;
let yAbajo;
let yArriba;

//Audios del juego
let audioMeta;
let audioSalto;
let audioMuerte;
let audioAgua;
let audioJuego;

let pausa; //Estado de pausa del juego

let idRana; //Intervalo del juego