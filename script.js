window.onload = function(){

    let canvas;
    let ctx;

    let nObstaculos  = [];

    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 555;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 355;

    const LIMITECOCHEIZQUIERDA = -200;
    const LIMITECOCHEDERECHA = 600;

    let xDerecha;
    let xIzquierda;
    let yArriba;
    let yAbajo;

    let rana;
    let imagen;

    let posicion = 0; 
	let inicial = 0;

    let idRana;

    class Rana {
        constructor(){
            this.x = canvas.width / 2;
            this.y = 350;
            this.velocidad = 20;
            this.animacionRana = [[72,69],[317,68],[65,319],[265,317],[59,570],[310,568],[71,818],[318,765]];
            this.tamañoX = 200;
            this.tamañoY = 200;
        }

        generaPosicionDerecha(){
            this.x += this.velocidad;
            if(this.x > LIMITEDERECHA){
                this.x = LIMITEDERECHA;
            }
        }
    
        generaPosicionIzquierda(){
            this.x -= this.velocidad;
            if(this.x < LIMITEIZQUIERDA){
                this.x = LIMITEIZQUIERDA;
            }
        }
    
        generaPosicionArriba(){
            this.y -= this.velocidad;
            if(this.y < LIMITEARRIBA){
                this.y = LIMITEARRIBA;
            }
        }
    
        generaPosicionAbajo(){
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
            }else{
                if (this.x < LIMITECOCHEIZQUIERDA - this.ancho) {
                    this.x = LIMITECOCHEDERECHA;
                }
            }
        }
    }
    
    function iniciarObstaculos() {
        // Primera fila de coches
        for(let i = 0;i < 2;i++){
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

        // Cuarta fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 450;
            nObstaculos.push(new Obstaculos(x, 100, 50, 120, 0.7, "blue"));
        }

        // Quinta fila de troncos
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
        // Limpiamos el canvas
        ctx.clearRect(0, 0, 600, 400);		

        if(xDerecha){
            rana.generaPosicionDerecha();
        }

        if(xIzquierda){
            rana.generaPosicionIzquierda();
        }

        if(yAbajo){
            rana.generaPosicionAbajo();
        }

        if(yArriba){
            rana.generaPosicionArriba();
        }
        ctx.drawImage(
            rana.imagen,               // Imagen completa con todos los sprites
            rana.animacionRana[posicion][0],  // Posición X del sprite en la hoja de sprites
            rana.animacionRana[posicion][1],  // Posición Y del sprite en la hoja de sprites
            rana.tamañoX,              // Ancho del sprite en la hoja de sprites (100 en este caso)
            rana.tamañoY,              // Alto del sprite en la hoja de sprites (100 en este caso)
            rana.x,                    // Posición X en el canvas
            rana.y,                    // Posición Y en el canvas
            50,                        // Ancho deseado en el canvas (escala a 50)
            50                         // Alto deseado en el canvas (escala a 50)
        );
        movimientoObstaculos();
    }
    function saltar() {		
        if(yArriba){
            inicial = 0;
        }

        if(xDerecha){
            inicial = 2;
        }

        if(xIzquierda){
            inicial = 4;
        }
        
        if(yAbajo){
            inicial = 6;
        }
        posicion = inicial + (posicion + 1) % 2;
    }

    function activarMovimiento(evt){
        switch(evt.keyCode){
            // Flecha derecha activada
			case 39:
				xDerecha = true;
                saltar();
				break;
            // Flecha izquierda activada
			case 37:
				xIzquierda = true;
                saltar();
				break;
			// Flecha de abajo activada
			case 40:
				yAbajo = true;
                saltar();
				break;
			// Flecha de arriba activada
			case 38:
				yArriba = true;
                saltar();
				break; 
        }
    }

    function desactivarMovimiento(evt){
        switch(evt.keyCode){
            // Flecha derecha desactivada
			case 39:
				xDerecha = false;
				break;
            // Flecha izquierda desactivada
			case 37:
				xIzquierda = false;
				break;
			// Flecha de abajo desactivada
			case 40:
				yAbajo = false;
				break;
			// Flecha de arriba desactivada
			case 38:
				yArriba = false;
				break; 
        }
    }

    document.addEventListener("keydown",activarMovimiento,false);
    document.addEventListener("keyup",desactivarMovimiento,false);

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    imagen = new Image();
    imagen.src = "frogger.png";
    Rana.prototype.imagen = imagen;
    rana = new Rana();

    idRana = setInterval(pintarPersonaje,1000/50);
}