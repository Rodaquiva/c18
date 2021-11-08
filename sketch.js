//crear variables Trex
var trex, trex_running;
//crear variables suelo
var ground, groundImage;

var invisibleGround;

var cloud, cloudImage;

var obstacles, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var rand;

var score;

var obstaclesGroup, cloudsGroup;

var PLAY = 1;
var END = 0;

var gameState = PLAY;

var trex_collided;

var restart;

var gameover;

var restartimage;

var gameoverimage;

var jumpSound, checkPointSound, dieSound;
var mensaje = "este es un mensaje";

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  //subir imagen del suelo
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");

  obstacle2 = loadImage("obstacle2.png");

  obstacle3 = loadImage("obstacle3.png");

  obstacle4 = loadImage("obstacle4.png");

  obstacle5 = loadImage("obstacle5.png");

  obstacle6 = loadImage("obstacle6.png");

  trex_collided = loadAnimation("trex_collided.png");

  restartimage = loadImage("restart.png");

  gameoverimage = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");

  checkPointSound = loadSound("checkPoint.mp3");

  dieSound = loadSound("die.mp3");
 
}

function setup() {
  //espacio del juego
  createCanvas(windowWidth, windowHeight);

 
 

  //Crear el Sprite del Trex
  trex = createSprite(50, height-100, 20, 50);
  trex.scale = 0.5;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);

  //crear el sprite del suelo
  ground = createSprite(width/2, height-30, 600, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //crear un sprite de suelo invisible
  invisibleGround = createSprite(0, height-10, 400, 10);
  invisibleGround.visible = false;

  //var rand =Math.round(random(1,100));
  //console.log(rand);
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;

  // trex.setCollider("rectangle",0,0,200,trex.height); trex.debug = false;
  trex.setCollider("circle",0,0,40); trex.debug = true;
  

  gameover = createSprite(width/2, height/2);
  gameover.addImage(gameoverimage);
  gameover.scale = 0.5;

  restart = createSprite(width/2, height/2+50);
  restart.addImage(restartimage);
  restart.scale = 0.4;

  gameover.visible = false;
  restart.visible = false;
}

function draw() {
  background("white");
console.log(trex.y);
  salto = 0;

  text("score:" + score, width-100, 50);
 

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / (60));
    //agregar el movimiento
    ground.velocityX = -(4+3*score/100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //Salto
    

    if (touches.lenght>0||keyDown("space") && (trex.y >=height-120)) {
      trex.velocityY = -10;
      jumpSound.play();
      touches=[];
    }

    //le damos una velocidad de bajada "gravedad"
    trex.velocityY = trex.velocityY + 0.5;

    spawnClouds();

    spawnObstacles();
    if (score>0 && score%100 ===0){
      checkPointSound.play();
    }

    if (obstaclesGroup.isTouching(trex)) {
      dieSound.play();
      gameState = END;
      //IA para que salte solo el trex
      // trex.velocityY = -12;
      // jumpSound.play();

    }

  } else if (gameState === END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;
    trex.velocityY = 0;

  }


  //evita que el trex se caiga
  trex.collide(invisibleGround);

  if (mousePressedOver(restart)||touches.lenght>0){
    reset();
    touches=[];
  }
  //console.log(frameCount);

  drawSprites();

}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameover.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}

function spawnClouds() {
  //escribir el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, height-100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.y = Math.round(random(10, height-100));
    cloud.velocityX = -(3+score/100);

    //console.log(trex.depth, cloud.depth);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //asignar un tiempo de vida a las nubes
    //lifetime = Distancia / velocidad
    cloud.lifetime = width/3;

    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 80 === 0) {

    obstacle = createSprite(width, height-30, 10, 40);
    obstacle.velocityX = -(3+score/100);


    rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;

      case 2: obstacle.addImage(obstacle2);
        break;

      case 3: obstacle.addImage(obstacle3);
        break;

      case 4: obstacle.addImage(obstacle4);
        break;

      case 5: obstacle.addImage(obstacle5);
        break;

      case 6: obstacle.addImage(obstacle6);
        break;

      default:
        break;



    }

    obstacle.scale = 0.4;
    obstacle.lifetime = width/(obstacle.velocityX);

    obstaclesGroup.add(obstacle);

  }
}

