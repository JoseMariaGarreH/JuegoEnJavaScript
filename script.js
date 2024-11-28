window.onload = function(){
    // Declaración de variables principales
    let canvas;
    let ctx;

    // Límites específicos para el jugador
    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 560;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 360;

    // Límites específicos para los obstaculos
    const LIMITECOCHEIZQUIERDA = -200;
    const LIMITECOCHEDERECHA = 600;

    //Arrays de los obstaculos del juego (Coches y troncos)
    let arrayCoches = [];
    let arrayTroncos = [];

    // Variables en relación con el estado de la rana
    let rana;
    let imagen;
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

    // Botones del juego
    const botonIniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[0];
    const botonPausar = document.getElementById("seccionBotones").getElementsByTagName("button")[1];
    const botonReiniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[2];

    //Audios del juego
    let audioMeta;
    let audioSalto;
    let audioMuerte;
    let audioAgua;
    let audioJuego;

    // Recogemos los audios de antes
    audioSalto = document.getElementById("audioSalto");
    audioMuerte = document.getElementById("audioMuerte");
    audioMeta = document.getElementById("audioMeta");
    audioAgua = document.getElementById("audioMuerteAgua");
    audioJuego = document.getElementById("audioJuego");

    audioJuego.loop=true;

    //Imagen del tronco
    const TRONCO = new Image();
    TRONCO.src = "imagenes/log.png";
    
    //Imagen del coche
    const VEHICULO = new Image();
    VEHICULO.src = "imagenes/cars.png";

    let pausa; //Estado de pausa del juego

    let idRana; //Intervalo del juego

    // Clase de rana
    class Rana {
        constructor(){
            this.x = canvas.width / 2 - 20;
            this.y = 350;
            this.velocidad = 40;
            this.animacionRana = [[57,60],[307,77],[49,303],[300,304],[48,559],[286,552],[53,801],[308,788]];
            this.tamañoX = 40;
            this.tamañoY = 40;
        }

         // Métodos para mover la rana respetando los límites del canvas
        moverDerecha(){
            this.x += this.velocidad;
            if(this.x > LIMITEDERECHA){
                this.x = LIMITEDERECHA;
            }
        }
    
        moverIzquierda(){
            this.x -= this.velocidad;
            if(this.x < LIMITEIZQUIERDA){
                this.x = LIMITEIZQUIERDA;
            }
        }
    
        moverArriba(){
            this.y -= this.velocidad;
            if(this.y < LIMITEARRIBA){
                this.y = LIMITEARRIBA;
            }
        }
    
        moverAbajo(){
            this.y += this.velocidad;
            if(this.y > LIMITEABAJO){
                this.y = LIMITEABAJO;
            }
        }
    }

     // Clase de los obstaculos (coches y troncos)
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

    // Función que actualiza periódicamente el estado del juego y el dibujo en el canvas
    function bucleJuego(){
        // Borramos el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Llamamos a los obstaculos en cada momento para comprobar su estado
        manejadorDeObstaculos();
        // Generamos el sprite según la flecha puesta
        ctx.drawImage(
            rana.imagen,
            rana.animacionRana[posicion][0],
            rana.animacionRana[posicion][1],
            155,
            155,
            rana.x,
            rana.y,
            rana.tamañoX,
            rana.tamañoY
        );

        // Puntuación que se va a mostrar todo el rato y que cambia según los logros conseguidos dentro del juego
        manejadorDePuntuacion();
        // Comprueba la muerte de la rana
        if(muerte){manejadorDeMuerte();}
    }

    // Calculo del sprite que se debe usar, según la dirección que coja
    function saltoRana() {
        
        // Cuando se pulsa la flecha derecha se le asigna la inicial = 2 que es donde se encuentra los sprites de la derecha en el array de sprites de la rana
        if(xDerecha){
            inicial = 2;
            rana.moverDerecha(); // Posteriormente movemos la x de la rana
        }

        // Cuando se pulsa la flecha izquierda se le asigna la inicial = 4 que es donde se encuentra los sprites de la izquierda en el array de sprites de la rana
        if(xIzquierda){
            inicial = 4;
            rana.moverIzquierda(); // Posteriormente movemos la x de la rana
        } 

         // Cuando se pulsa la flecha de arriba se le asigna la inicial = 0 que es donde se encuentra los sprites de arriba en el array de sprites de la rana
        if(yArriba){
            inicial = 0;
            rana.moverArriba(); // Posteriormente movemos la y de la rana
        }

        // Cuando se pulsa la flecha de abajo se le asigna la inicial = 6 que es donde se encuentra los sprites de abajo en el array de sprites de la rana
        if(yAbajo){
            inicial = 6
            rana.moverAbajo(); // Posteriormente movemos la y de la rana
        }

        // Calcula la animación que debe mostrarse, entre dos posiciones de la rana para dar la sensación de movimiento
        posicion = inicial + (posicion + 1) % 2;

        // vuelve a la animación inicial después de 100ms, para crear el efecto de salto
        setTimeout(() => {
            posicion = inicial;
        }, 100);
    }

    // Función que activa el movimiento de las flechas
    function activarMovimiento(evt) {
        // Según la tecla que pulse se comprueba el código de un evento que pondra en verdadero el estado de la dirección
        switch(evt.keyCode) {
            case 39: // Derecha
                xDerecha = true;
                break;
            case 37: // Izquierda
                xIzquierda = true;
                break;
            case 40: // Abajo
                yAbajo = true;
                break;
            case 38: // Arriba
                yArriba = true;
                break; 
        }

        // Cada vez que salta da igual que dirección sea se activa un audio y se calcula la posición del sprite
        if (xDerecha || xIzquierda || yArriba || yAbajo) {
            // Calculamos la posición del sprite
            saltoRana();
            audioSalto.currentTime = 0; // Ponemos a cero el audio en caso de que se este reproduciendo
            audioSalto.play(); // Y lo reproducimos desde cero
        }
    }

    // Función que desactiva el movimiento cuando se levanta la tecla
    function desactivarMovimiento(evt) {
        switch(evt.keyCode) {
            case 39: // Derecha
                xDerecha = false;
                break;
            case 37: // Izquierda
                xIzquierda = false;
                break;
            case 40: // Abajo
                yAbajo = false;
                break;
            case 38: // Arriba
                yArriba = false;
                break; 
        }

        // Si llega a la parte de final del canvas, gana la "ronda" y suma su puntuación
        if(rana.y <= 0) {
            puntuacion++;
            // Volviendo a su estado inicial
            rana.x = canvas.width / 2 - 20; 
            rana.y = 350;
            // Se aumenta la velocidad de los obstaculos
            velocidadJuego += 0.5;
            // Reproducimos el audio de llegada a la meta
            audioMeta.currentTime = 1; 
            audioMeta.play();
        }
    }

    // Función en caso de que exista una colisión
    function manejadorDeMuerte(){
        // Pausamos el bucle producido por el setInterval
        clearInterval(idRana);
        
        audioJuego.pause();
        audioJuego.currentTime = 0;

        // Reproducimos el audio de muerte según en la posición en la que este
        if(rana.y < 160 && rana.y > 40){
            audioAgua.currentTime = 0;
            audioAgua.play();
        }else{
            audioMuerte.currentTime = 0;
            audioMuerte.play();
        }

        // Desactivamos el moviento con las teclas para que no siga moviendose la rana
        document.removeEventListener("keydown", activarMovimiento, false);
        document.removeEventListener("keyup", desactivarMovimiento, false);

        // Creamos una pantalla de información, para informar al jugador que ha perdido 
        ctx.fillStyle = "#80808080";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 88, canvas.height / 2);
        ctx.font = "12px Arial"
        ctx.fillText("Puntuación: "+puntuacion, canvas.width / 2 - 30, canvas.height / 2 + 35);

        // Configuramos los botones
        botonPausar.disabled = true;
        botonIniciar.disabled = true;
        botonReiniciar.disabled = false;
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

    // Función que maneja la puntuación del juego
    function manejadorDePuntuacion(){
        ctx.strokeStyle = "black";
        ctx.font = "10px Arial";

        // Recuperar el máximo puntaje almacenado
        maximo = localStorage.getItem("PuntuacionMAX");
        if (maximo === null) {
            maximo = 0; // Si no hay puntaje máximo almacenado, ponemos 0
        } else {
            maximo = parseInt(maximo);
        }

        // Actualizar el sessionStorage con el nuevo puntaje máximo si cumple la codición
        if (puntuacion > maximo && muerte) {
            maximo = puntuacion;
            localStorage.setItem("PuntuacionMAX", maximo);
        }

        ctx.strokeText("Record: " + maximo, 530, 15);
        ctx.strokeText("Puntuación: "+puntuacion,530,25);
        ctx.strokeStyle = "black";
        ctx.font = "10px Arial";
        ctx.strokeText("Velocidad: "+velocidadJuego.toFixed(1),530,35);
    }

    // Función que reinicia el juego y pone todos los valores por defecto
    function reiniciarJuego() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        arrayCoches = [];
        arrayTroncos = [];

        posicion = 0;
        inicial = 0;
        puntuacion = 0;
        xDerecha = false;
        xIzquierda = false;
        yAbajo = false;
        yArriba = false;
        muerte = false;
        asalvo = false;
        velocidadJuego = 1;

        rana = new Rana();
        iniciarObstaculos();

        document.removeEventListener("keydown", activarMovimiento, false);
        document.removeEventListener("keyup", desactivarMovimiento, false);

        botonIniciar.disabled = false;
        botonPausar.disabled = true;
        botonReiniciar.disabled = true;

        if(botonPausar.textContent === "Reanudar"){
            botonPausar.textContent = "Pausar"; 
            pausa = false;
        }

        iniciarJuego();
    }


    // Función que pausa el juego 
    function pausarJuego() {
        pausa = !pausa;
        if (pausa) {
            clearInterval(idRana);
            ctx.fillStyle = "#80808080";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.font = "30px Arial";
            ctx.fillText('PAUSA', canvas.width / 2 - 50, canvas.height / 2);
            botonPausa.textContent = 'Reanudar';

            audioJuego.pause();

            document.removeEventListener("keydown", activarMovimiento, false);
            document.removeEventListener("keyup", desactivarMovimiento, false);
        } else {
            botonPausa.textContent = 'Pausa';
            idRana = setInterval(bucleJuego, 1000 / 50); // Vuelve a reanudar el juego

            audioJuego.play();

            document.addEventListener("keydown", activarMovimiento, false);
            document.addEventListener("keyup", desactivarMovimiento, false);
        }
    }

    // Función que inicia el juego
    function iniciarJuego() {
        idRana = setInterval(bucleJuego, 1000 / 50);

        audioJuego.currentTime = 0;
        audioJuego.play();

        document.addEventListener("keydown", activarMovimiento, false);
        document.addEventListener("keyup", desactivarMovimiento, false);

        botonIniciar.disabled = true;
        botonPausar.disabled = false;
        botonReiniciar.disabled = true;
    }

    // Definición del canvas
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Añadimos la imagen a la ran
    imagen = new Image();
    imagen.src = "imagenes/frogger.png";

    Rana.prototype.imagen = imagen;
    rana = new Rana();
    
    // Definimos los sprites de los coches según su dirección y definimos un numero random del 0 al 3
    Obstaculos.prototype.imagenesCochesDerecha = [[0, 10], [0, 168], [0, 86]];
    Obstaculos.prototype.imagenesCochesIzquierda = [[160, 11], [160, 164], [161, 86]];
    Obstaculos.prototype.randomizador = Math.floor(Math.random() * 3); // Este número random será la posición del sprite que se ponga

    // Configuración de los botones
    botonIniciar.disabled = false;  
    botonPausar.disabled = true;
    botonReiniciar.disabled = true;

    // Definición de los eventos de los botones declarados en HTML
    botonIniciar.addEventListener('click',iniciarJuego,false);
    botonPausar.addEventListener('click',pausarJuego,false);
    botonReiniciar.addEventListener('click',reiniciarJuego,false);
}
