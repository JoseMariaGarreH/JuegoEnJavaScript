window.onload = function(){
    let canvas;
    let ctx;

    let nObstaculos = [];

    const LIMITEIZQUIERDA = 0;
    const LIMITEDERECHA = 575;
    const LIMITEARRIBA = 0;
    const LIMITEABAJO = 375;

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

    const botonIniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[0];
    const botonPausar = document.getElementById("seccionBotones").getElementsByTagName("button")[1];
    const botonReiniciar = document.getElementById("seccionBotones").getElementsByTagName("button")[2];

    let pausa;

    let idRana;
    let idMovimiento;

    class Rana {
        constructor(){
            this.x = canvas.width / 2;
            this.y = 350;
            this.velocidad = 50;
            this.animacionRana = [[45,57],[307,60],[49,303],[250,304],[48,559],[286,552],[53,801],[308,754]];
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
        constructor(x, y, alto, ancho, velocidad, color,tipo) {
            this.x = x;
            this.y = y;
            this.alto = alto;
            this.ancho = ancho;
            this.velocidad = velocidad;
            this.color = color;
            this.tipo = tipo;
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
            nObstaculos.push(new Obstaculos(x, 250, 50, 120, 1, "blue","vehiculo"));
        }
        // Segunda fila de coches
        for (let i = 0; i < 2; i++) {
            let x = i * 300;
            nObstaculos.push(new Obstaculos(x, 200, 50, 120, -2, "blue","vehiculo"));
        }
        // Tercera fila de coches
        for (let i = 0; i < 2; i++) {
            let x = i * 400;
            nObstaculos.push(new Obstaculos(x, 150, 50, 120, 2, "blue","vehiculo"));
        }
        //Cuarta fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 450;
            nObstaculos.push(new Obstaculos(x, 100, 50, 120, 0.7, "blue","tronco"));
        }
        // Quita fila de troncos
        for (let i = 0; i < 2; i++) {
            let x = i * 500;
            nObstaculos.push(new Obstaculos(x, 50, 50, 50, 1, "blue","tronco"));
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

        ctx.drawImage(
            rana.imagen,
            rana.animacionRana[posicion][0],
            rana.animacionRana[posicion][1],
            130,
            130,
            rana.x,
            rana.y,
            rana.tamañoX,
            rana.tamañoY
        );

        movimientoObstaculos();

        if (ranaMuerta()) {
			clearInterval(idRana);
			botonPausar.disabled = true;
            botonIniciar.disabled = true;
            botonReiniciar.disabled = false;
		}
    }

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
        saltoRana();
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


    function ranaMuerta() {
		let estamosMuertos = false;
		
		let i = 0;

		let bIzq = rana.x;
		let bDer = rana.x + rana.tamañoX;
		let bDown = rana.y;
		let bUp = rana.y + rana.tamañoY;

		do {
			let nIzq = Math.round(nObstaculos[i].x,0);
			let nDer = Math.round((nObstaculos[i].x + nObstaculos[i].ancho),0);
			let nDown = Math.round(nObstaculos[i].y,0);
			let nUp = Math.round((nObstaculos[i].y + nObstaculos[i].alto),0);
			
			if (( bDer  > nIzq ) &
					( bIzq  < nDer ) &
					( bUp   > nDown) &
					( bDown < nUp) ) {
				
				estamosMuertos = true;
				
			} else i++;
		}
		while (!estamosMuertos);	
		
		return estamosMuertos;
	}

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    botonIniciar.disabled = false;
    botonPausar.disabled = true;
    botonReiniciar.disabled = true;

    document.addEventListener("keydown", activarMovimiento, false);
    document.addEventListener("keyup", desactivarMovimiento, false);

    imagen = new Image();
    imagen.src = "imagenes/frogger.png";
    Rana.prototype.imagen = imagen;
    rana = new Rana();

    botonIniciar.addEventListener('click',() => {
        idRana = setInterval(pintarPersonaje, 1000 / 50);
        idMovimiento = setInterval(saltoRana,1000/1);

        botonIniciar.disabled = true;
        botonPausar.disabled = false;
    });

    botonPausar.addEventListener('click',() => {
        pausa = !pausa;
        if(pausa){
            clearInterval(idRana);
            ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.font = "30px Arial";
            ctx.fillText('PAUSA', canvas.width / 2 - 50, canvas.height / 2);
            botonPausa.textContent = 'Reanudar';
        }else{
            botonPausa.textContent = 'Pausa';
            idRana = setInterval(pintarPersonaje, 1000 / 50);
        }
    });

    botonReiniciar.addEventListener('click',() => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    });
}
