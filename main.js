class Snake{

    constructor(){
        this.fps = 30; 
        this.grid = 15;
        this.v = 1;
        this.lt = new Date().getTime();
        this.dt = 0;
        this.physicsSampleRate = 100;
        this.lts = 0;
        this.direction = 0;//<- = 1 then clockwise++
        this.len = 0;
        this.tail = [];
        
        this.geometry = {w:this.grid,h:this.grid,x:0,y:0};
        this.velocity = {x:0,y:0};
        this.canvas = document.querySelector("#can");
        this.ctx = this.canvas.getContext('2d');
        this.opponent = this.spawn();

        addEventListener("keydown",(e)=>{
            
            switch(e.keyCode){
                case 37:
                if (this.direction == 3) break;
                this.velocity.x = -this.v*this.grid;
                this.velocity.y = 0;
                this.direction = 1;
                break;

                case 38:
                if (this.direction == 4) break;

                this.velocity.y = -this.v*this.grid;
                this.velocity.x = 0;
                this.direction = 2;

                break;

                case 39:
                if (this.direction == 1) break;

                this.velocity.x = this.v*this.grid;
                this.velocity.y = 0;
                this.direction = 3;

                break;

                case 40:
                if (this.direction == 2) break;

                this.velocity.y = this.v*this.grid;
                this.velocity.x = 0;
                this.direction = 4;

                break;


            }
        });
    }

    spawn(){
        let a = Math.floor((Math.random()*(this.canvas.width-this.grid))/this.grid)*this.grid;
        let b = Math.floor((Math.random()*(this.canvas.height-this.grid))/this.grid)*this.grid;
        
        //return {x:Math.random()*(500-this.grid),y:Math.random()*(500-this.grid)};
        return {x:a,y:b};
        
    }


    gameloop(){
        let tp = new Date().getTime();

        let t = new Date().getTime()/1000;
        this.dt = t-this.lt;
        let ts = Math.floor(tp/this.physicsSampleRate);

        if (ts != this.lts){
            //physics 
            let lastX = this.geometry.x;
            let lastY = this.geometry.y;

  

            this.geometry.x = this.geometry.x+this.velocity.x;
            this.geometry.y = this.geometry.y+this.velocity.y;
            
            if (this.geometry.x < -this.grid){
                this.geometry.x = this.canvas.width;
            }
            
            if (this.geometry.x > this.canvas.width){
                this.geometry.x = 0;
            }
            if (this.geometry.y < 0){
                this.geometry.y = this.canvas.height;
            }
            
            if (this.geometry.y > this.canvas.height){
                this.geometry.y = 0;
            }

            let colx= Math.abs(this.geometry.x - this.opponent.x);
            let coly= Math.abs(this.geometry.y - this.opponent.y);
            let hit = false;
            this.tail.unshift({x:lastX,y:lastY});

            if (colx<this.grid && coly<this.grid){
                this.opponent = this.spawn();
                //this.v=this.v+10;
                if (this.physicsSampleRate > 5){
                    this.physicsSampleRate--;
                }
                hit = true;
                this.len++;
                //this.tail.push({x:lastX,y:lastY});

            }
            if (this.tail != null && !hit){
                this.tail.pop();
                
            }

                
            
        }

        
        //rendering
        this.ctx.fillStyle="white";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.ctx.fillStyle="black";

        this.ctx.fillRect(this.geometry.x,this.geometry.y,this.geometry.w,this.geometry.h);

        this.ctx.fillStyle="red";

        this.ctx.fillRect(this.opponent.x,this.opponent.y,this.geometry.w,this.geometry.h);

        this.ctx.fillStyle="blue";

        for(let i = 0; i < this.tail.length; i++){

            this.ctx.fillRect(this.tail[i].x,this.tail[i].y,this.geometry.w,this.geometry.h);
        
        }

        this.lt = t;
        this.lts = ts;

        setTimeout(()=>{
            this.gameloop()
        },1000/this.fps);

    }
    
}

let s = new Snake();
s.gameloop();