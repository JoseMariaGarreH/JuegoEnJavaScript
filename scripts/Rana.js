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

// Imagen de la rana
Rana.prototype.imagen = new Image();	
Rana.prototype.imagen.src = "imagenes/frogger.png";	