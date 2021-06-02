var dog, happyDog, hungryDog, database, foodS,foodStockRef,database;
var frameCountNow = 0;
var fedTime, lastFed, foodObj, currentTime;
var milk, input, name;
var gameState = "hungry";
var gameStateRef;
var bedroomIMG, gardenIMG, washroomIMG,sleepIMG,runIMG;
var feed, addFood;
var input, button;

function preload(){
 
  hungryDog = loadImage("images/Hungry.png");
  happyDog = loadImage("images/Dog.png");
  bedroomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");
  sleepIMG = loadImage("images/Lazy.png");
  runIMG = loadImage("images/running.png");
}

function setup() {
  createCanvas(1356,621);
  database = firebase.database();
  
  foodObj = new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy",happyDog);
  dog.addAnimation("sleeping",sleepIMG);
  dog.addAnimation("run",runIMG);
  dog.scale = 0.3;
  
  getGameState();

  feed = createButton("Feed the dog");
  feed.position(600,65);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(700,65);
  addFood.mousePressed(addFoods);

  input = createInput("Pet name");
  input.position(600,90);

  button = createButton("Confirm");
  button.position(650,115);
  button.mousePressed(createName);

}

function draw() { 
  currentTime = hour();
  if(currentTime === lastFed + 1){
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime === lastFed + 2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else {
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }
  foodObj.getFoodStock();
 
  getGameState();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry",hungryDog);
  }
  else {
    feed.hide();
    addFood.hide();
    dog.remove();
  }



  drawSprites();

  textSize(25);
  fill(255)
  text("Last feed : "+lastFed+":00",150,70);
  text("Time since last feed : "+(currentTime - lastFed),150,105);
}

function feedDog(){
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy", happyDog);
  gameState = "happy";
  updateGameState();
}

function addFoods(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState = data.val();
    
  });
};

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
})} 