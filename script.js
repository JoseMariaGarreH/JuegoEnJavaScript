window.onload = function(){
    let canvas;
    let ctx;

    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 560;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 360;

    const LIMITECOCHEIZQUIERDA = -200;
    const LIMITECOCHEDERECHA = 600;

    let arrayCoches = [];
    let arrayTroncos = [];

    let rana;
    let imagen;

    let posicion = 0; 
    let inicial = 0;
    let puntuacion = 0;
    let velocidadJuego = 1;
    let asalvo = false;

    let xDerecha;
    let xIzquierda;
    let yAbajo;
    let yArriba;

    const botonIniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[0];
    const botonPausar = document.getElementById("seccionBotones").getElementsByTagName("button")[1];
    const botonReiniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[2];

    let audioMeta;
    let audioSalto;
    let audioMuerte;


    const TRONCO = new Image();
    TRONCO.src = "imagenes/log.png";

    const VEHICULO = new Image();
    VEHICULO.src = "imagenes/cars.png";

    let pausa;

    let idRana;

    class Rana {
        constructor(){
            this.x = canvas.width / 2;
            this.y = 350;
            this.velocidad = 40;
            this.animacionRana = [[57,60],[307,77],[49,303],[300,304],[48,559],[286,552],[53,801],[308,754]];
            this.tamañoX = 40;
            this.tamañoY = 40;
        }

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

    class Obstaculos {
        constructor(x, y, alto, ancho, velocidad,tipo) {
            this.x = x;
            this.y = y;
            this.alto = alto;
            this.ancho = ancho;
            this.velocidad = velocidad;
            this.tipo = tipo;
        }

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
    
        actualizar() {
            this.x += this.velocidad * velocidadJuego;
            if(this.velocidad > 0){
                if (this.x > LIMITECOCHEDERECHA + this.ancho) {
                    this.x = LIMITECOCHEIZQUIERDA;
                    this.randomizador = Math.floor(Math.random() * 3);
                }
            } else {
                if (this.x < LIMITECOCHEIZQUIERDA - this.ancho) {
                    this.x = LIMITECOCHEDERECHA;
                    this.randomizador = Math.floor(Math.random() * 3);
                }
            }
        }
    }

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
            arrayTroncos.push(new Obstaculos(x, 120, 50, 100, 0.7,"tronco"));
        }
        // Quita fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 500;
            arrayTroncos.push(new Obstaculos(x, 60, 50, 50, 1,"tronco"));
        }
    }
    iniciarObstaculos();

    function movimientoObstaculos() {
        for (let i = 0; i < arrayCoches.length; i++) {
            arrayCoches[i].actualizar();
            arrayCoches[i].dibujar();
        }

        for (let i = 0; i < arrayTroncos.length; i++) {
            arrayTroncos[i].actualizar();
            arrayTroncos[i].dibujar();
        }

        if(rana.y < 160 && rana.y > 40){
            asalvo = false;
            for (let i = 0; i < arrayTroncos.length; i++) {
                if(colisiones(arrayTroncos)){
                    rana.y = arrayTroncos[i].y;
                    rana.x += arrayTroncos[i].velocidad;
                    asalvo = true;
                    break;
                }
            }

            if(!asalvo){
                clearInterval(idRana);
            }
        }
    }

    function pintarPersonaje(){
        ctx.clearRect(0, 0, 600, 400);

        movimientoObstaculos();
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

        manejadorDePuntuacion();
        
        if (colisiones(arrayCoches)) {
			clearInterval(idRana);

            audioMuerte.currentTime = 0;
            audioMuerte.play();

			botonPausar.disabled = true;
            botonIniciar.disabled = true;
            botonReiniciar.disabled = false;
		}
    }

    // Calculo del sprite que se debe usar, según la dirección que coja
    function saltoRana() {
        if(xDerecha){
            inicial = 2;
            rana.moverDerecha();
        }

        if(xIzquierda){
            inicial = 4;
            rana.moverIzquierda();
        }

        if(yArriba){
            inicial = 0;
            rana.moverArriba();
        }

        if(yAbajo){
            inicial = 6
            rana.moverAbajo();
        }

        posicion = inicial + (posicion + 1) % 2;

        posicion = inicial + 1;

        setTimeout(() => {
            posicion = inicial;
        }, 100);
    }

    function activarMovimiento(evt) {
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

        if (xDerecha || xIzquierda || yArriba || yAbajo) {
            saltoRana();
            audioSalto.currentTime = 0;
            audioSalto.play();
        }
    }

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

        // Si llega a la parte de arriba del canvas gana la "ronda" y suma su puntuación
        if(rana.y <= 0) {
            puntuacion++;
            rana.x = canvas.width / 2; 
            rana.y = 350;
            velocidadJuego += 0.5;
            audioMeta.currentTime = 1;
            audioMeta.play();
        }
    }

    // Método que comprueba si ha habido alguna colisión entre los objetos y la rana
    function colisiones(arrayObstaculos) {
        let colision = false;
        let i = 0;

        const margenRana = 5;
        const margenObstaculo = 5;

        let rIzq = rana.x + margenRana;
        let rDer = rana.x + rana.tamañoX - margenRana;
        let rDown = rana.y + margenRana;
        let rUp = rana.y + rana.tamañoY - margenRana;
    
        do {
            if (i >= arrayObstaculos.length){
                break;
            }

            let oIzq = Math.round(arrayObstaculos[i].x + margenObstaculo);
            let oDer = Math.round(arrayObstaculos[i].x + arrayObstaculos[i].ancho - margenObstaculo);
            let oDown = Math.round(arrayObstaculos[i].y + margenObstaculo);
            let oUp = Math.round(arrayObstaculos[i].y + arrayObstaculos[i].alto - margenObstaculo);

            if ((rDer > oIzq) &&
                (rIzq < oDer) &&
                (rUp > oDown) &&
                (rDown < oUp)) {
                colision = true;
            } else {
                i++;
            }
        } while (!colision);
    
        return colision;
    }

    function manejadorDePuntuacion(){
        ctx.strokeStyle = "black";
        ctx.font = "10px Arial";
        ctx.strokeText("Puntuación: "+puntuacion,530,10);

        ctx.strokeStyle = "black";
        ctx.font = "10px Arial";
        ctx.strokeText("Velocidad: "+velocidadJuego.toFixed(1),530,25);
    }


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
        velocidadJuego = 1;

        rana = new Rana();
        iniciarObstaculos();

        botonIniciar.disabled = false;
        botonPausar.disabled = true;
        botonReiniciar.disabled = true;

        if(botonPausar.textContent === "Reanudar"){
            botonPausar.textContent = "Pausar"; 
            pausa = false;
        }

        clearInterval(idRana);
    }

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
        } else {
            botonPausa.textContent = 'Pausa';
            idRana = setInterval(pintarPersonaje, 1000 / 50);
        }
    }

    function iniciarJuego() {
        idRana = setInterval(pintarPersonaje, 1000 / 50);
        botonIniciar.disabled = true;
        botonPausar.disabled = false;
        botonReiniciar.disabled = false;
    }

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    imagen = new Image();
    imagen.src = "imagenes/frogger.png";

    Rana.prototype.imagen = imagen;
    rana = new Rana();

    audioSalto = document.getElementById("audioSalto");
    audioMuerte = document.getElementById("audioMuerte");
    audioMeta = document.getElementById("audioMeta");
    
    Obstaculos.prototype.imagenesCochesDerecha = [[0, 10], [0, 168], [0, 86]];
    Obstaculos.prototype.imagenesCochesIzquierda = [[160, 11], [160, 164], [161, 86]];
    Obstaculos.prototype.randomizador = Math.floor(Math.random() * 3);

    botonIniciar.disabled = false;
    botonPausar.disabled = true;
    botonReiniciar.disabled = true;

    document.addEventListener("keydown", activarMovimiento, false);
    document.addEventListener("keyup", desactivarMovimiento, false);

    botonIniciar.addEventListener('click',iniciarJuego,false);
    botonPausar.addEventListener('click',pausarJuego,false);
    botonReiniciar.addEventListener('click',reiniciarJuego,false);
}
