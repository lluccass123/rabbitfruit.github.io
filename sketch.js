const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope,rope2,rope3;
var fruitConstraint, fruitConstraint2, fruitConstraint3;
var fruit;
var backgroundimage;
var cutButton, button, button2, button3;
var melon, melonimage;
var rabbit, rabbitimage;
var blink;
var eat;
var sad;
var background_sound;
var foliage;
var eating_sound;
var rope_cut;
var sad_sound;
var air_sound;
var mute_button;
var balloon;
var canwidth,canheight;

function preload(){
  backgroundimage = loadImage("background.png");
  //cutButton = loadImage("cut_button.png");
  melonimage = loadImage("melon.png");
  rabbitimage = loadImage("Rabbit-01.png");
  eatani = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sadani = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  blinkani = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  background_sound = loadSound("sound1.mp3");
  foliage = loadSound("Cutting Through Foliage.mp3");
  eating_sound = loadSound("eating_sound.mp3");
  rope_cut = loadSound("rope_cut.mp3");
  air_sound = loadSound("air.wav");
  sad_sound = loadSound("sad.wav");
  blinkani.playing = true;
  eatani.playing = true;
  eatani.looping = false;
  sadani.playing = true;
  sadani.looping = false;
}
function setup() 
{
  var isMobile = /iphone | ipad | ipod | android/i.test(navigator.userAgent);
  if (isMobile){
    canwidth = displayWidth;
    canheight = displayHeight;
    createCanvas(displayWidth + 80, displayHeight);
  }
  else{
    canwidth = windowWidth;
    canheight = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);
  background_sound.play();
  background_sound.setVolume(0.5);
  engine = Engine.create();
  world = engine.world;

  blinkani.frameDelay = 20;
  eatani.frameDelay = 20;
  button = createImg('cut_button.png');
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut_button.png');
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_button.png');
  button3.position(360,200);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  mute_button = createImg('mute.png');
  mute_button.position(430,30);
  mute_button.size(50,50);
  mute_button.mouseClicked(mute);
 
  ground = new Ground(250,canheight,600,20);
  rope = new Rope(8,{x:40,y:30});
  rope2 = new Rope(7,{x:370,y:40});
  rope3 = new Rope(4,{x:400,y:225});

  fruit = Bodies.circle(250,350,20);
  Matter.Composite.add(rope.body,fruit)
  Matter.Composite.add(rope2.body,fruit);
  fruitConstraint = new Link(rope,fruit);
  fruitConstraint2 = new Link(rope2,fruit);
  fruitConstraint3 = new Link(rope3,fruit);
  
  rabbit = createSprite(400,canheight - 80,100,100);
  rabbit.addImage(rabbitimage);
  rabbit.scale = 0.3;
  rabbit.addAnimation('blinking',blinkani);
  rabbit.addAnimation('sad',sadani);
  rabbit.addAnimation('eating',eatani);
  rabbit.changeAnimation('blinking');

  balloon = createImg('balloon.png');
  balloon.position(100,220);
  balloon.size(100,100);
  balloon.mouseClicked(airBlow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() 
{
  background(51);
  image(backgroundimage,0,0,displayWidth + 80,displayHeight);
  push();
  imageMode(CENTER);
  if (fruit != null){
    image(melonimage,fruit.position.x,fruit.position.y,70,70);
  }
  pop();
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();
  //ellipse(fruit.position.x,fruit.position.y,30,30);
  Engine.update(engine);
  if (collide(fruit,rabbit) == true){
    rabbit.changeAnimation('eating');
    eating_sound.play();
  }
  if (collide(fruit,ground.body) == true){
    rabbit.changeAnimation('sad');
    sad_sound.play();
  }
  drawSprites();
}

function drop(){
  rope_cut.play();
  rope.break();
  fruitConstraint.detach();
  fruitConstraint = null;
}

function drop2(){
  rope_cut.play();
  rope2.break();
  fruitConstraint2.detach();
  fruitConstraint2 = null;
}

function drop3(){
  rope_cut.play();
  rope3.break();
  fruitConstraint3.detach();
  fruitConstraint3 = null;
}

function collide(body,sprite){
  if (body != null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    if (d<=80){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
      
    }
    else {
      return false;
    }
  }
}

function mute(){
  if (background_sound.isPlaying()){
    background_sound.stop();
  }
  else{
    background_sound.play();
  }
}

function airBlow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  air_sound.play();
}