 // Límites específicos para el jugador
const LIMITEIZQUIERDA = 0;
const LIMITEDERECHA = 560;
const LIMITEARRIBA = 0;
const LIMITEABAJO = 360;

// Límites específicos para los obstaculos
const LIMITECOCHEIZQUIERDA = -200;
const LIMITECOCHEDERECHA = 600;

// Botones del juego
const botonIniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[0];
const botonPausar = document.getElementById("seccionBotones").getElementsByTagName("button")[1];
const botonReiniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[2];

//Imagen del tronco
const TRONCO = new Image();
TRONCO.src = "imagenes/log.png";

//Imagen del coche
const VEHICULO = new Image();
VEHICULO.src = "imagenes/cars.png";