window.onload = function(){
    let canvas;
    let ctx;

    let nObstaculos  = [];

    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 565;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 365;

    const LIMITECOCHEIZQUIERDA = -200;
    const LIMITECOCHEDERECHA = 600;

    let rana;
    let imagen;

    let posicion = 0; 
    let inicial = 0;

    let xDerecha;
    let xIzquierda;
    let yAbajo;
    let yArriba;

    let idRana;

    class Rana {
        constructor(){
            this.x = canvas.width / 2;
            this.y = 350;
            this.velocidad = 40;
            this.animacionRana = [[72,69],[317,68],[65,319],[265,317],[59,570],[310,568],[71,818],[318,765]];
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
        constructor(x, y, alto, ancho, velocidad, color) {
            this.x = x;
            this.y = y;
            this.alto = alto;
            this.ancho = ancho;
            this.velocidad = velocidad;
            this.color = color;
        }
    
        dibujar() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        }
    
        actualizar() {
            this.x += this.velocidad;
            if(this.velocidad > 0){
                if (this.x > LIMITECOCHEDERECHA + this.ancho) {
                    this.x = LIMITECOCHEIZQUIERDA;
                }
            } else {
                if (this.x < LIMITECOCHEIZQUIERDA - this.ancho) {
                    this.x = LIMITECOCHEDERECHA;
                }
            }
        }
    }
    
    function iniciarObstaculos() {
        // Primera fila de coches
        for(let i = 0; i < 2; i++) {
            let x = i * 350;
            nObstaculos.push(new Obstaculos(x, 250, 50, 120, 1, "blue"));
        }
        // Segunda fila de coches
        for (let i = 0; i < 2; i++) {
            let x = i * 300;
            nObstaculos.push(new Obstaculos(x, 200, 50, 120, -2, "blue"));
        }
        // Tercera fila de coches
        for (let i = 0; i < 2; i++) {
            let x = i * 400;
            nObstaculos.push(new Obstaculos(x, 150, 50, 120, 2, "blue"));
        }
        //Cuarta fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 450;
            nObstaculos.push(new Obstaculos(x, 100, 50, 120, 0.7, "blue"));
        }
        // Quita fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 500;
            nObstaculos.push(new Obstaculos(x, 50, 50, 50, 1, "blue"));
        }
    }
    iniciarObstaculos();

    function movimientoObstaculos() {
        for (let i = 0; i < nObstaculos.length; i++) {
            nObstaculos[i].actualizar();
            nObstaculos[i].dibujar();
        }
    }

    function pintarPersonaje(){
        ctx.clearRect(0, 0, 600, 400);
        
        ctx.fillStyle = "green";
        ctx.fillRect(rana.x,rana.y,rana.tamañoX,rana.tamañoY);
        /*ctx.drawImage(
            rana.imagen,
            rana.animacionRana[posicion][0],
            rana.animacionRana[posicion][1],
            111,
            111,
            rana.x,
            rana.y,
            rana.tamañoX,
            rana.tamañoY
        );*/
        movimientoObstaculos();
    }

    function movimimientoRana() {
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
        movimimientoRana();
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
    }

    document.addEventListener("keydown", activarMovimiento, false);
    document.addEventListener("keyup", desactivarMovimiento, false);

    const botonIniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[0];
    botonIniciar.addEventListener('click',() => {
        idRana = setInterval(pintarPersonaje, 1000 / 50);
    })

    const botonReiniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[1];
    const botonPausar = document.getElementById("seccionBotones").getElementsByTagName("button")[2];

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    imagen = new Image();
    imagen.src = "frogger.png";
    Rana.prototype.imagen = imagen;
    rana = new Rana();

    
}
