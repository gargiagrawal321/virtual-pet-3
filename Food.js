class Food {
    constructor(){
        this.image = loadImage("images/milk.png");
        this.lastFed;
        this.foodStock = 20;
    }
    getFoodStock(){
        return this.foodStock;
    }

    updateFoodStock(){
        database.ref('/').update({
            Food: this.foodStock,
            feedTime: hour()
        });
    }

    deductFood(){
        if(this.foodStock >= 1){
            this.foodStock = this.foodStock - 1;
        }
    }

    addFood(){
        if(this.foodStock <= 19){
            this.foodStock++;
        }
    }

    display(){
        background(0);

        var x=100,y=250;
        
        imageMode(CENTER);
       
        if(this.foodStock != 0){
            for(var i = 0;i < this.foodStock;i++){
                if(i%10===0){
                    x=80;
                    y=y+50;
                }
                image(this.image,x,y,50,50);
                x += 30;
            }
        }

    }

    bedroom(){
        background(bedroomIMG,width,height);
        dog.changeAnimation("sleeping",sleepIMG);
    }

    garden(){
        background(gardenIMG,width,height);
        dog.changeAnimation("run",runIMG);
    }

    washroom(){
        background(washroomIMG,width,height);
    }}