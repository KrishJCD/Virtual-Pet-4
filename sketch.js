//Create variables here
var dog,happyDog,database,foodS=20,foodStock;

var bedImg,garImg,washImg,sadDog,vaccineImg,livingImg;
var feed,addbottle;
var gameState;
var lastTime,lastFeed=0;
var foodObj;
var bathBut,garBut,parkBut,vaccineBut,sleepBut
var store;
function preload()
{
	happyDog=loadImage("images/dogImg1.png");
  bedImg=loadImage("images/Bed Room.png");
  garImg=loadImage("images/Garden.png");
  sadDog=loadImage("images/Lazy.png");
  vaccineImg=loadImage("images/Vaccination.jpg");
  livingImg=loadImage("images/Living Room.png");
  washImg=loadImage("images/Wash Room.png");
}

function setup() {
 database=firebase.database(); 
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  database.ref('/').update({ Food : 20});
	createCanvas(800, 500);
  //store=livingImg;
  foodObj=new Food(20);
  dog=createSprite(500,200,20,20);
  dog.addImage(loadImage("images/dogImg.png"));
  dog.scale=0.18;

  feed=createButton("Feed the Dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addbottle=createButton("Add Milk");
  addbottle.position(710,95);
  addbottle.mousePressed(addMilkBottle);


  bathBut=createButton("I want to Bath");
  bathBut.position(800,95);
  bathBut.mousePressed(()=>{
    store=washImg;
  });

  sleepBut=createButton("I want a Sleep");
  sleepBut.position(400,120);
  sleepBut.mousePressed(()=>{
    store=bedImg;
  });

  garBut=createButton("I want to Play");
  garBut.position(510,95);
  garBut.mousePressed(()=>
  {
    store=garImg;
  })

  vaccineBut=createButton("Vaccinate Me");
  vaccineBut.position(610,95);
  vaccineBut.mousePressed(()=>{
    store=vaccineImg
  })

  state=database.ref('gameState').on("value",(data)=>{
    gameState=data.val();
  });
  
}

function update(state)
{
  database.ref('/').update({
    gameState:state
  });
}

function draw() {  

  if(gameState==0)
  {
    background(sadDog);
    foodObj=null;
  }
  else if(gameState===1)
  {
    background(garImg);
    foodObj=null;
  }
  else if(gameState===2)
  {
    background(bedImg);
    foodObj=null;
  }
  else if(gameState===3){
    background(washImg);
    foodObj=null;
  }
  else{
  background(241);
  }
  if(gameState!=0)
  {
    feed.hide();
    addbottle.hide();
    dog.addImage(happyDog);
  }else{
    feed.show();
    addbottle.show();
    dog.addImage(sadDog);
  }

  currentTime=hour();

  //Playing State
  if(currentTime==(lastFeed+1)){
    update(1);
    dog.remove();
  }

  //Sleeping State
  else if(currentTime==(lastFeed+2)){
    update(2);
    dog.remove();
  }

  //Bathing State
  else if(currentTime>(lastFeed+2) && currentTime<=(lastFeed+4)){
    update(3);
    dog.remove();
  }

  //Hungry State
  else{
    update(0);
    dog.addImage(sadDog);
  }



  
  /*if(keyWentDown("UP_ARROW"))
  {
    writeStock(foodS);
  }*/
  lastTime=database.ref('LastFed/LastFed');
  lastTime.on("value",function(data)
  {
    lastFeed=data.val();
  });
  if(foodObj!=undefined)
  foodObj.display();

  drawSprites();
  fill("red");
  textSize(20);
  text("Food Left :"+ foodS,200,100);

  if(lastFeed>12)
  {
    text("Last Fed: "+(lastFeed-12)+" PM",200,400);
  }
  else if(lastFeed<=12)
  {
    text("Last Fed: "+(lastFeed)+" AM",200,400);
  }
  
}

function readStock(data)
{
  foodS=data.val();
}

/*function writeStock(x)
{
  if(x<=0)
  {
    x=0;
  }
  else
    x=x-1;
  database.ref('/').update({ Food : x});
}*/

function addMilkBottle()
{
  foodS++;
  database.ref('/').update(
    {
      Food:foodS
    }
  );
  time=hour();
  database.ref('LastFed').update(
    {
      LastFed:time
    }
  );
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  foodS--;
  if(foodS<=0)
  {
    foodS=0;
  }
  database.ref('/').update(
    {
      Food:foodS
    }
  );
  dog.addImage(happyDog);
  foodObj.deductFood();
}
