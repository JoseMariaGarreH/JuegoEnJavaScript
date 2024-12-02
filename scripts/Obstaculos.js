class Obstaculos {
    constructor(x, y, alto, ancho, velocidad,tipo) {
        this.x = x;
        this.y = y;
        this.alto = alto;
        this.ancho = ancho;
        this.velocidad = velocidad;
        this.tipo = tipo;
    }

    // Dibujar los obstáculos en el canvas
    dibujar() {
        switch (this.tipo) {
            case "tronco":
                ctx.drawImage(
                    TRONCO,
                    this.x,
                    this.y,
                    this.ancho,
                    this.alto
                );
                break;
            case "vehiculo":
                if(this.velocidad > 0){
                    // Imagen de coche moviéndose hacia la derecha con sprites aleatorios
                    ctx.drawImage(
                        VEHICULO,
                        this.imagenesCochesDerecha[this.randomizador][0],
                        this.imagenesCochesDerecha[this.randomizador][1],
                        161,
                        64,
                        this.x,
                        this.y,
                        this.ancho,
                        this.alto
                    );
                }else{
                    // Imagen de coche moviéndose hacia la izquierda con sprites aleatorios
                    ctx.drawImage(
                        VEHICULO,
                        this.imagenesCochesIzquierda[this.randomizador][0],
                        this.imagenesCochesIzquierda[this.randomizador][1],
                        161,
                        64,
                        this.x,
                        this.y,
                        this.ancho,
                        this.alto
                    );
                }
            break;
        }  
    }
    
    // Actualizar la posición del obstáculo
    actualizar() {
        this.x += this.velocidad * velocidadJuego;
          // Si se mueve hacia la derecha y sale del canvas, reiniciamos su posición
        if(this.velocidad > 0){
            if (this.x > LIMITECOCHEDERECHA + this.ancho) {
                this.x = LIMITECOCHEIZQUIERDA; // Reaparece en el lado opuesto
                this.randomizador = Math.floor(Math.random() * 3); // Cambia el sprite del coche
            }
        } else {
            // En el caso que se mueva a la izquierda, hacemos lo mismo que si fuera a la derecha
            if (this.x < LIMITECOCHEIZQUIERDA - this.ancho) {
                this.x = LIMITECOCHEDERECHA;
                this.randomizador = Math.floor(Math.random() * 3);
            }
        }
    }
}

// Función para inciar los obstaculos del juego
function iniciarObstaculos() {
    // Primera fila de coches
    for(let i = 0; i < 2; i++) {
        let x = i * 350;
        arrayCoches.push(new Obstaculos(x, 285, 50, 100, 1,"vehiculo"));
    }
    // Segunda fila de coches
    for (let i = 0; i < 2; i++) {
        let x = i * 300;
        arrayCoches.push(new Obstaculos(x, 230, 50, 100, -2,"vehiculo"));
    }
    // Tercera fila de coches
    for (let i = 0; i < 2; i++) {
        let x = i * 400;
        arrayCoches.push(new Obstaculos(x, 175, 50, 100, 2,"vehiculo"));
    }
    //Cuarta fila de troncos
    for (let i = 0; i < 2; i++) {
        let x = i * 450;
        arrayTroncos.push(new Obstaculos(x, 120, 50, 100, -1.5,"tronco"));
    }
    // Quita fila de troncos
    for (let i = 0; i < 6; i++) {
        let x = i * 150;
        arrayTroncos.push(new Obstaculos(x, 60, 60, 60, 0.7,"tronco"));
    }
}
iniciarObstaculos(); // Creamos los obstaculos

// Manejar el movimiento y la lógica de los obstáculos
function manejadorDeObstaculos() {
    // Actualizamos la posición de los coches y cambiamos los sprites de los coches en caso necesario
    for (let i = 0; i < arrayCoches.length; i++) {
        arrayCoches[i].actualizar();
        arrayCoches[i].dibujar();
    }

    // Actualizamos la posición de los troncos
    for (let i = 0; i < arrayTroncos.length; i++) {
        arrayTroncos[i].actualizar();
        arrayTroncos[i].dibujar();
    }

    // Comprobación de la colisión con los coches
    for(let i = 0;i < arrayCoches.length;i++){
        if(colision(arrayCoches[i])){ // Si existe alguna colisión con los coches muere directamente
            muerte = true; // Y cambia el estado
        }
    }

    // Comprobación de la colisión con los troncos
    if(rana.y < 160 && rana.y > 40){ // Si se encuentra en esa posición (que es donde se encuentra el agua y los troncos) la rana
        asalvo = false;
        // Comprobamos todos los troncos del array y miramos si ha colisionado con alguno
        for (let i = 0; i < arrayTroncos.length; i++) {
            if(colision(arrayTroncos[i])){ // Si colisiona con un tronco
                rana.y = arrayTroncos[i].y; // Actualiza la posición de la rana con la del tronco que ha golpeado
                rana.x += arrayTroncos[i].velocidad * velocidadJuego; // Y con ello también su velocidad
                asalvo = true; // Y ahora se encuentra a salvo
                break;
            }
        }

        // Si ha pasado por esa posición y no ha habido ninguna colisión con algun tronco significa que ha tocado agua
        if(!asalvo){
            muerte = true; // Cambia el estado de muerte a verdero
        }
    }
}

// Método que comprueba si ha habido alguna colisión entre los obstaculos y la rana
function colision(obstaculo) {
    // margen que le añadimos a los objetos creados, para que la colisión sea mas cercana
    const margenRana = 5;
    const margenObstaculo = 5;

    let rIzq = rana.x + margenRana; // lado izquierdo de la rana
    let rDer = rana.x + rana.tamañoX - margenRana;  // lado derecho de la rana
    let rDown = rana.y + margenRana; // Parte de abajo de la rana
    let rUp = rana.y + rana.tamañoY - margenRana; // Parte de arriba de la rana

    let oIzq = Math.round(obstaculo.x + margenObstaculo); // Lado izquierdo del obstaculo
    let oDer = Math.round(obstaculo.x + obstaculo.ancho - margenObstaculo); // Lado derecho del obstaculo
    let oDown = Math.round(obstaculo.y + margenObstaculo); // Parte de abajo del obstaculo
    let oUp = Math.round(obstaculo.y + obstaculo.alto - margenObstaculo); // Parte de arriba del obstaculo

    // Lado derecho de rDer es mayor que el lado izquierdo de oIzq.
    // Lado izquierdo de rIzq es menor que el lado derecho de oDer.
    // Lado superior de rUp es mayor que el lado inferior de oDown.
    // Lado inferior de rDown es menor que lado superior de oUp.

    // Si se cumplen las condiciones descritas arriba hay colisión
    return (
        rDer > oIzq &&
        rIzq < oDer &&
        rUp > oDown &&
        rDown < oUp
    );
}

// Definimos los sprites de los coches según su dirección y definimos un numero random del 0 al 3
Obstaculos.prototype.imagenesCochesDerecha = [[0, 10], [0, 168], [0, 86]];
Obstaculos.prototype.imagenesCochesIzquierda = [[160, 11], [160, 164], [161, 86]];
Obstaculos.prototype.randomizador = Math.floor(Math.random() * 3); // Este número random será la posición del sprite que se ponga