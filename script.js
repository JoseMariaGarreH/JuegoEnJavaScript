window.onload = function(){

    let canvas;
    let ctx;

    let nCoches = [];

    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 575;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 375;

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
            this.animacionRana = [[72,69],[317,68],[65,319],[267,317],[59,570],[310,568],[71,818],[318,765]];
            this.tamañoX = 120;
            this.tamañoY = 120;
        }
    }

    Rana.prototype.generaPosicionDerecha = function() {
        this.x += this.velocidad;
        if(this.x > LIMITEDERECHA){
            this.x = LIMITEDERECHA;
        }
    }

    Rana.prototype.generaPosicionIzquierda = function() {
        this.x -= this.velocidad;
        if(this.x < LIMITEIZQUIERDA){
            this.x = LIMITEIZQUIERDA;
        }
    }

    Rana.prototype.generaPosicionArriba = function() {
        this.y -= this.velocidad;
        if(this.y < LIMITEARRIBA){
            this.y = LIMITEARRIBA;
        }
    }

    Rana.prototype.generaPosicionAbajo = function() {
        this.y += this.velocidad;
        if(this.y > LIMITEABAJO){
            this.y = LIMITEABAJO;
        }
    }

    class Coche {
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
                if (this.x > LIMITEDERECHA + this.ancho) {
                    this.x = LIMITEIZQUIERDA;
                }
            }else{
                if (this.x < LIMITEIZQUIERDA - this.ancho) {
                    this.x = LIMITEDERECHA;
                }
            }
        }
    }
    
    function iniciarCoches(){
        for(let i = 0; i < 2; i++){
            let x = i * 350;
            nCoches.push(new Coche(x,250,50,120,1,"#000000"));
        }

        for(let i = 0; i < 2; i++){
            let x = i * 300;
            nCoches.push(new Coche(x,200,50,120,-2,"#000000"));
        }

        for(let i = 0; i < 2; i++){
            let x = i * 400;
            nCoches.push(new Coche(x,150,50,120,2,"#000000"));
        }
    }
    iniciarCoches();

    function manejarCoches() {
        for (let i = 0; i < nCoches.length; i++) {
            nCoches[i].actualizar();
            nCoches[i].dibujar();
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
            rana.animacionRana[0][0],  // Posición X del sprite en la hoja de sprites
            rana.animacionRana[0][1],  // Posición Y del sprite en la hoja de sprites
            rana.tamañoX,              // Ancho del sprite en la hoja de sprites (100 en este caso)
            rana.tamañoY,              // Alto del sprite en la hoja de sprites (100 en este caso)
            rana.x,                    // Posición X en el canvas
            rana.y,                    // Posición Y en el canvas
            40,                        // Ancho deseado en el canvas (escala a 40)
            40                         // Alto deseado en el canvas (escala a 40)
        );

        manejarCoches();
    }

    function activarMovimiento(evt){
        switch(evt.keyCode){
            // Flecha derecha activada
			case 39:
				xDerecha = true;
				break;
            // Flecha izquierda activada
			case 37:
				xIzquierda = true;
				break;
			// Flecha de abajo activada
			case 40:
				yAbajo = true;
				break;
			// Flecha de arriba activada
			case 38:
				yArriba = true;
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