//Create variables here
var dog , happyDog ,database ,foodS , foodStock ; 
var dogImg , dogImg1 ; 
var FedTime , lastFed , FoodObj , feedDog;
var button , button1 ;
var changingGameState , readingGameState ;
var bedroom , garden , washroom ;

function preload()
{
  //load images here
dogImg = loadImage("Dog.png")
dogImg1 = loadImage("Happydog.png")
bedroom = loadImage("BedRoom.png")
garden = loadImage("Garden.png")
washroom = loadImage("WashRoom.png")

}

function setup() {
  createCanvas(500,500);
  database = firebase.database();
  dog = createDog();
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  
  feed = createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton(" Add Food ") ;
  addFood.position(800,95); 
  addFood.mousePressed(addsFoods);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87);

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+lastFed%12 +"PM",350,30);
  }else if(lastFed == 0){
    text("Last Feed : 12Am",350,30);
  }else{
    text("Last Feed :"+lastFed + "AM",350,30);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
     lastFed = data.val();
  });

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }  

    currentTime = hour();
    if(currentTime==(lastFed+1)){
        update("PLaying");
        foodObj.garden();
    }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
      update("bathing");
      foodObj.washroom();
    }else{
      update("Hungry")
      foodObj.display();
    }

  drawSprites();
  //add styles here

}

function readStock(data){
  foodS = data.val();
  
}

function wireStock(x){
  if(x<=0){
    x=0;
  }else{
    x = x-1 ;
  }

  database.ref('/').update({
    Food : x
  })

}
 
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(haopyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/')/update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  }) 
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}








