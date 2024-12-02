window.onload = function(){

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

        // Actualizar el localStorage con el nuevo puntaje máximo si cumple la codición
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

        rana = new Rana();

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

    // Recogemos los audios de antes
    audioSalto = document.getElementById("audioSalto");
    audioMuerte = document.getElementById("audioMuerte");
    audioMeta = document.getElementById("audioMeta");
    audioAgua = document.getElementById("audioMuerteAgua");
    audioJuego = document.getElementById("audioJuego");

    audioJuego.loop = true;

    // Configuración de los botones
    botonIniciar.disabled = false;  
    botonPausar.disabled = true;
    botonReiniciar.disabled = true;

    // Definición de los eventos de los botones declarados en HTML
    botonIniciar.addEventListener('click',iniciarJuego,false);
    botonPausar.addEventListener('click',pausarJuego,false);
    botonReiniciar.addEventListener('click',reiniciarJuego,false);
}
