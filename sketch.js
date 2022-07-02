// sketch.js
// 2021-11-11
//I Ching, the Book of Change, is a Chinese classic that describes the underlying rule of the universe and how it interacts with human behaviour, explaining the principles of endless changes. The 64 hexagrams could be applied to various aspects, such as astronomy, medicine, and warfare, etc. Here, a fortune telling simulator is designed based on the theory and scripture of I Ching, giving guidance to any confused souls.  

//The design took inspiration from the theory of Yin and Yang, the ancient interpretation of binary that matches the language of computers. Our power to rationalize randomness and make our own choices is what free our souls and make us human. This simulator is no superstitious but attempts to provide new and unexpected perspectives for the visitors to examine the question that bothers them.

let font;
let textPosY,pctText,sphPosY,hexPosY;
let index,lastMillis;
let pg;
let angle,ballSize,nScale;
let bouncingBallSize;
let n,m;
let r64;
let myBgColor,primaryColor;

function preload() {
  font = loadFont("SpaceMono-Regular.ttf");
}


function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
    textAlign(CENTER,CENTER);
    fill(0);
    textFont(font,16);
	initialize();
	n=2;
	m=0;
}

function initialize(){
	index = 0;
	lastMillis = 0;
	textPosY = 0;
	pctText = 0.01;
	sphPosY = 10;
    myBgColor = color(0);
    primaryColor = color(227,189,88);
	pg = createGraphics(400,400); 
	pg.translate(pg.width/2,pg.height/2);
	origin = { x:0,y:0 };
	ballSet1 = [new Ball(1,origin,100),new Ball(2,origin,100)];
	ballSet2 = [new Ball(3,origin,100),new Ball(4,origin,100)];
	ballSize=0;
    bouncingBallSize=30;
	angle=0;
	nScale=1;	
    hexPosY = -50;
}

function draw() {
  if (n == 2){ // Sliding Text Introduction
    //I modified the code of cfoss https://editor.p5js.org/cfoss/sketches/SJggPXhcQ
	background(myBgColor);
    fill(primaryColor);
    textSize(24);
	text(introText[0].substring(0, index),0,0);	
    console.log(index);
	if (millis() > lastMillis + 10) {
		index = index + 1;
		lastMillis = millis();
        if (index > introText[0].length + 15){ n++; index = 0; lastMillis = 0; }
	}
  } 
  else if(n==3){ // Scrolling Text
	background(myBgColor);
    textSize(24);
    text(introText[0],0, textPosY);
    if(textPosY > -150){textPosY += (-100+textPosY)*pctText;}
    else{ n++; }
  } 
  else if(n==4){ // Bouncing ball waiting for timeout or click to proceed
	background(myBgColor);
    	text(introText[0],0,-150);
	drawBouncingBall(0,0,bouncingBallSize);
    push();
        // textSize(12);
	text(folioText[0],0,300);
    pop();
    	if(m<500){ m++; }
    	else{ n++; m=0; }
  }
  else if(n==5){ // Starting ball ONE at center
    background(myBgColor);
    strokeWeight(1);
    fill(0);
    stroke(primaryColor);
    circle(0,0,10); 
    pg.background(myBgColor);
    pg.strokeWeight(1);
    pg.fill(0);
    pg.stroke(primaryColor);
    pg.circle(0,0,10);
    n++;
  }
  else if(n==6){ // Splitting into 2 stream going up and down 
    for(let k=0; k<ballSet1.length; k++){
      if(ballSet1[k].isIncomplete()){ ballSet1[k].draw(); }
    }
    bComplete = true;
    k=0; while(bComplete && k<ballSet1.length){
      if(ballSet1[k++].isIncomplete()) bComplete=false;
    }
    if(bComplete){         
      ballSet2[0].origin = ballSet1[0].pos; 
      ballSet2[1].origin = ballSet1[1].pos;
      n++;
    }
  }
  else if(n==7){ // Merging into circle
    for(let k=0; k<ballSet2.length; k++){
      if(ballSet2[k].isIncomplete()){ ballSet2[k].draw(); }
    }
    bComplete = true;
    k=0; while(bComplete && k<ballSet2.length){
      if(ballSet2[k++].isIncomplete()) bComplete=false;
    }
    if(bComplete){ n++; m=0; }
  }
  else if(n==8){ // Adding circle pairs to form a TaiJi
    push();
    stroke(primaryColor);
    strokeWeight(1);
    fill(0);
    circle(-60,60,ballSize);
    fill(0);
    circle(60,-60,40-ballSize);
    pg.stroke(primaryColor);
    pg.strokeWeight(1);
    pg.fill(0);
	pg.circle(-60,60,ballSize);
    pg.fill(primaryColor);
    pg.circle(60,-60,40-ballSize);
    if(m%5){ ballSize++; m++; }
    else if(ballSize<40){ m++;}
    else{ n++; m=0; }
    pop();
  }
  else if(n==9){ // Circulating 8 color ball around TaiJi
    background(myBgColor);
    image(pg,-pg.width/2,-pg.width/2);
    for(let n=0; n<8; n++){
      drawBall(origin,angle,n);
    }
    if(angle<4*PI){ angle+=0.1; }
    else{ angle=0; n++; m=0; }
  }  
  else if(n==10){ // Stop circulating
    background(myBgColor);
    image(pg,-pg.width/2,-pg.width/2);
    for(let n=0; n<8; n++){
      drawBall(origin,angle,n);
    }
    if(m<50){ m++; }
    else{ n++; m=0; }
  }  
  else if(n==11){ // Becoming 8 color Trigram
    background(myBgColor);
    image(pg,-pg.width/2,-pg.width/2);
    for(let n=0; n<8; n++){
      drawTrigram(origin,angle,n);
    }
    if(m<100){ m++; }
    else{ n++; m=0; }
  }  
  else if(n==12){ // Flipping TaiJi-Trigram to correct orientation
    background(myBgColor);
    rotateY((angle>PI)?PI:angle);
    image(pg,-pg.width/2,-pg.width/2);
    if(angle<PI){ angle+=0.1; }
    else{ n++; }
  }
  else if(n==13){ // Shrinking TaiJi-Trigram
    background(myBgColor);
    rotateY((angle>PI)?PI:angle);
    push();
    scale(nScale);
    image(pg,-pg.width/2,-pg.width/2);
    if(nScale>0.1){ nScale-=0.01; }
    else{ n++; m=0; nScale=1; }
    pop();
  }
  else if(n==14){ // Cycloning all 64 hexagram till timeout or mouse click
    background(myBgColor);
    for(let k=0; k<8; k++){
	  hexagram(-100,-100,k);
	  hexagram(-100,100,k+8);
	  hexagram(100,-100,k+16);
	  hexagram(100,100,k+24);
	  hexagram(0,100,k+32);
	  hexagram(100,0,k+40);
	  hexagram(0,-100,k+48);
	  hexagram(-100,0,k+56);
    }
    if(m<100){ m++; }
    else{ n++; m=0; }
  }
  else if(n==15){ // Randomly pick one hexagram for fortune
  	r64 = int(random(64));
	print("fate value = "+r64);
	n++;
  }
  else if(n==16){ // Waving 8 fortune hexagrams at center till timeout or mouse click
    background(myBgColor);
    for(let k=0; k<8; k++){
	  hexagram(mouseX-width/2,mouseY-width/2,r64);
    }
    if(m<500){ m++; }
    else{ n++; m=0; }
  }
  else if(n==17){ // Showing enlarged fortune hexagram at center and scroll up
    background(myBgColor);
    translate(-50,hexPosY);
    if(hexPosY > -250){hexPosY += (-100+hexPosY)*pctText;}
    else {hexPosY = -250}
    push();
    //color define by r64
    // colorMode(HSB);
    // let myColor = r64/63*255;
    // stroke(myColor,mouseX,mouseY);
    scale(nScale);
    drawHexagram(r64,3*nScale);
    if(nScale<3){ nScale+=0.1; }
    else if(m<200){ m++; }
    else{ n++; m=0; }
    pop();
  } 
  else if(n==18){ // Display the fortune hexagram and scrolling fortune text message
	background(myBgColor);
    push();
    translate(-50,-250);
    scale(3);
    drawHexagram(r64,9);
    pop();
    fill(primaryColor);
    textSize(16);
	text(fortuneText[r64].substring(0,m),0,0);	
	if (m <fortuneText[r64].length){ m++; }
	else{ n++; m=0; }
  } 
  else if(n==19){ // Display the fortune hexagram, fortune message and bouncing ball till mouse click
	background(myBgColor);
	push();
    translate(-50,-250);
    scale(3);
    drawHexagram(r64,9);
    pop();
    fill(primaryColor);
    textSize(16);
	text(fortuneText[r64],0,0);	
	drawBouncingBall(0,200,bouncingBallSize);
    text(folioText[2],0,300);
	text(folioText[1],0,328);
  }
  //else if(n==1) noLoop();
}

function drawBouncingBall(x,y,size){ //Bouncing ball code taught in IDEA9103 Design Programming Week 4
    push();
    //move mouse to change light position
    let locX = (mouseX - width/2)*1/10;
    let locY = ((mouseY+y) - height/2)*1/10;
    // ambientLight(60, 60, 60);
    if(mouseX<width/2+x+size*2 && mouseX>width/2+x-size*2 && mouseY<height/2+y+size*2 && mouseY>height/2+y-size*2){ambientMaterial(255);specularColor(255);pointLight(255,255,255, locX, locY, 300);}
    else{ambientMaterial(primaryColor);specularColor(primaryColor);pointLight(255,255,255, locX, locY, 300);}
    noStroke();
    let bounceValue = sin(frameCount / 10) * 5;
    translate(x+mouseX/100,y+bounceValue+(mouseY+y)/100);
    
    sphere(size);
    pop();	
}

function drawBall(origin,angle,nBall) {
  const myColor = [
    color(219,56,56),color(254,204,47),
    color(65,164,216),color(246,98,31),
    color(178,194,37), color(163,99,217), 
    color(250,162,40),color(52,190,184)
  ];
  let dx = 195 * sin(angle + nBall*3*PI/4);
  let dy = 195 * cos(angle + nBall*3*PI/4);
  noStroke();
  fill(myColor[nBall]);
  circle(origin.x+dx,origin.y+dy,40);
}

function drawTrigram(origin,angle,nTrigram)
{
  const myColor = [
    color(219,56,56),color(254,204,47),
    color(65,164,216),color(246,98,31),
    color(178,194,37), color(163,99,217), 
    color(250,162,40),color(52,190,184)
  ];
  let nTgm = (nTrigram + 3) % 8;
  let space = 8;
  let shortBar = space * 2.5;
  let longBar = shortBar * 2 + space;
  // let time = millis();
  let dx = 205 * sin(angle + nTrigram*3*PI/4) - longBar/2;
  let dy = 205 * cos(angle + nTrigram*3*PI/4) - space;
  push(); 
  pg.push();
  stroke(myColor[nTrigram]); pg.stroke(myColor[nTrigram]);
  strokeWeight(space/2); pg.strokeWeight(space/2);
  // translate(width/2+dx,height/2+dy);
  translate(dx,dy); pg.translate(dx,dy);
  for(let n=0,x=1; n<3; n++,x*=2){
    let y = n * space;
    if(nTgm & x){ line(0,y,longBar,y); pg.line(0,y,longBar,y); }
    else{ 
      line(0,y,shortBar,y); pg.line(0,y,shortBar,y); 
      line(shortBar+space,y,longBar,y); 
      pg.line(shortBar+space,y,longBar,y);
    }    
  }
  pg.pop();
  pop();
}

function hexagram(x,y,k)
{//I modified the code from https://p5js.org/reference/#/p5/text
  let time = millis();
  translate(x,y);
  rotateX(time / 1000);
  rotateZ(time / 1234);
  stroke(0);
  drawHexagram(k,3);
}

function drawHexagram(k,barWeight)
{
  let space = 6;
  let shortBar = space * 2.5;
  let longBar = shortBar * 2 + space;
  let time = millis();
  push();
  stroke(primaryColor);
  strokeWeight(barWeight);
  for(let n=0,x=1; n<6; n++,x<<=1){
    let y = n * space;
    if(k&x){ line(0,y,longBar,y); }
    else{ 
      line(0,y,shortBar,y); 
      line(shortBar+space,y,longBar,y);
    }    
  }
  pop();
}

function mousePressed(){
  if(n==4 && mouseX<width/2+bouncingBallSize*2 && mouseX>width/2-bouncingBallSize*2 && mouseY<height/2+bouncingBallSize*2 && mouseY>height/2-bouncingBallSize*2){n++;}
  if(n==14 || n==16){ n++; }
  if(n>18 && mouseX<width/2+bouncingBallSize*2 && mouseX>width/2-bouncingBallSize*2 && mouseY<height/2+200+bouncingBallSize*2 && mouseY>height/2+200-bouncingBallSize*2){ initialize(); n=3; m=0; } //buggggggs
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ball { // object to draw Taiji
  constructor(nType,origin,maxStep){
    this.origin = origin;
    this.maxStep = maxStep; 
    this.nStep = 0;
    this.nType = nType;
    // Percentage traveled 
    this.PCT = [0,1,-1,-PI/2,PI/2];
	this.nType=nType;
    this.pct = this.PCT[nType];
    circle(origin.x,origin.y,10);
    pg.circle(origin.x,origin.y,10);    
  }
  draw(){
    let dx,dy;
    if(this.nType==1){ 
      //simple Easing
      this.pct -= (this.pct - (-1)) * 0.05;
      dx = 100 * (cos(1) - cos(this.pct));
      dy = 100 * (sin(this.pct) - sin(1));
    }
    else if(this.nType==2){ 
      this.pct += (1 - this.pct) * 0.05; 
      dx = 100 * (cos(this.pct) - cos(1));
      dy = 100 * (sin(this.pct) + sin(1));
    }
    else if(this.nType==3){ 
      this.pct += (PI/1.7 - this.pct) * 0.025; 
      dx = 168 * (cos(this.pct) - cos(PI/2));
      dy = 168 * (sin(this.pct) + sin(PI/2));
    }
    else if(this.nType==4){ 
      this.pct -= (this.pct - (-PI/1.7)) * 0.025;
      dx = 168 * (cos(PI/2) - cos(this.pct));
      dy = 168 * (sin(this.pct) - sin(PI/2));
    }
    this.pos = {x:this.origin.x + dx, y:this.origin.y + dy};
    strokeWeight(1);
    stroke(primaryColor);
    fill(0);
    circle(this.pos.x,this.pos.y,10);
    pg.strokeWeight(1);
    pg.stroke(primaryColor);
    pg.fill(0);
    pg.circle(this.pos.x,this.pos.y,10);
    if(this.nStep<this.maxStep) this.nStep++;
  }
  isIncomplete(){ return(this.nStep<this.maxStep); }
}

const introText = [
	'Welcome.\nDo you believe in fate?\nThink of a question that bothers you.\nTell your fortune here.'
];

const folioText = [
	'↓↓↓ Scroll down for other projects','↓↓↓ Scroll down for other projects.','↑↑↑ Replay'
];

//Text copied from http://www.circlelo.com/mwm/CHINESE/FORECAST/I-Ching/b6.html
const fortuneText = [ 
'No.1 The Receptive\nThe Receptive brings about sublime success,\nFurthering through the perseverance of a mare.\nIf the superior man undertakes something and tries to lead,\nHe goes astray; But if he follows, he finds guidance.\nIt is favorable to find friends in the west and south,\nTo forego friends in the east and north.\nQuiet perseverance brings good fortune.\nThe earth condition is receptive devotion.\nThus the superior man who has breadth of character\nCarries the outer world.',//No.1
  
'No.2 Splitting Apart\nSplitting Apart. It does not further one\nTo go anywhere.\nThe mountain rests on the earth:\nThe image of Splitting Apart.\nThus those above can ensure their position\nOnly by giving generously to those below.',//No.2
  
'No.3 Holding Together [Union]\nHolding Together brings good fortune.\nInquire of the oracle once again\nWhether you possess sublimity, constancy, and perseverance;\nThen there is no blame.\nThose who are uncertain gradually join.\nWhoever comes too late\nMeets with misfortune.\nOn the earth is water:\nThe image of Holding Together.\nThus the kings of antiquity\nBestowed the different states as fiefs\nAnd cultivated friendly relations\nWith the feudal lords.', //No.3
  
'No.4 Contemplation\nContemplation. The ablution has been made,\nBut not yet the offering.\nFull of trust they look up to him.\nThe wind blows over the earth:\nThe image of Contemplation.\nThus the kings of old visited the regions of the world,\nContemplated the people,\nAnd gave them instruction.', //No.4
  
'No.5 Enthusiasm\nEnthusiasm. It furthers one to install helpers\nAnd to set armies marching.\nThunder comes resounding out of the earth:\nThe image of Enthusiasm.\nThus the ancient kings made music\nIn order to honor merit,\nAnd offered it with splendor\nTo the Supreme Deity,\nInviting their ancestors to be present.', //No.5
  
'No.6 Progress\nProgress. The powerful prince\nIs honored with horses in large numbers.\nIn a single day he is granted audience three times.\nThe sun rises over the earth:\nThe image of Progress.\nThus the superior man himself\nBrightens his bright virtue.',//No.6
  
'No.7 Gathering Together [Massing]\nGathering Together. Success.\nThe king approaches his temple.\nIt furthers one to see the great man.\nThis brings success. Perseverance furthers.\nTo bring great offerings creates good fortune.\nIt furthers one to undertake something.\nOver the earth, the lake:\nThe image of Gathering Together.\nThus the superior man renews his weapons\nIn order to meet the unforseen.',//No.7
  
'No.8 Standstill [Stagnation]\nStandstill. Evil people do not further\nThe perseverance of the superior man.\nThe great departs; the small approaches.\nHeaven and earth do not unite:\nThe image of Standstill.\nThus the superior man falls back upon his inner worth\nIn order to escape the difficulties.\nHe does not permit himself to be honored with revenue.',//No.8
  
'No.9 Modesty\nModesty creates success.\nThe superior man carries things through.\nWithin the earth, a mountain:\nThe image of Modesty.\nThus the superior man reduces that which is too much,\nAnd augments that which is too little.\nHe weighs things and makes them equal.',//No.9
  
'No.10 Keeping Still, Mountain\nKeeping Still. Keeping his back still\nSo that he no longer feels his body.\nHe goes into his courtyard\nAnd does not see his people.\nNo blame.\nMountains standing close together:\nThe image of Keeping Still.\nThus the superior man\nDoes not permit his thoughts\nTo go beyond his situation.',//No.10
  
'No.11 Obstruction\nObstruction. The southwest furthers.\nThe northeast does not further.\nIt furthers one to see the great man.\nPerseverance brings good fortune.\nWater on the mountain:\nThe image of Obstruction.\nThus the superior man turns his attention to himself\nAnd molds his character.',//No.11
  
'No.12 Development (Gradual Progress)\nDevelopment. The maiden\nIs given in marriage.\nGood fortune.\nPerseverance furthers.\nOn the mountain, a tree:\nThe image of Development.\nThus the superior man abides in dignity and virtue,\nIn order to improve the mores.',//No.12
  
'No.13 Preponderance of the Small\nPreponderance of the Small. Success.\nPerseverance furthers.\nSmall things may be done; great things should not be done.\nThe flying bird brings the message:\nIt is not well to strive upward,\nIt is well to remain below.\nGreat good fortune.\nThunder on the mountain:\nThe image of Preponderance of the Small.\nThus in his conduct \nthe superior man gives preponderance to reverence.\nIn bereavement he gives preponderance to grief.\nIn his expenditures he gives preponderance to thrift.',//No.13
  
'No.14 The Wanderer\nThe Wanderer. Success through smallness.\nPerseverance brings good fortune\nTo the wanderer.\nFire on the mountain:\nThe image of the Wanderer.\nThus the superior man\nIs clear-minded and cautious\nIn imposing penalties,\nAnd protracts no lawsuits.',//No.14
  
'No.15 Influence (Wooing)\nInfluence. Success.\nPerseverance furthers.\nTo take a maiden to wife brings good fortune.\nA lake on the mountain:\nThe image of Influence.\nThus the superior man encourages people to approach him\nBy his readiness to receive them.',//No.15
  
'No.16 Retreat\nRetreat. Success.\nIn what is small, perseverance furthers.\nMountain under heaven: the image of Retreat.\nThus the superior man keeps the inferior man at a distance,\nNot angrily but with reserve.',//No.16
  
'No.17 The Army\nThe Army. The army needs perseverance\nAnd a strong man.\nGood fortune without blame.\nIn the middle of the earth is water:\nThe image of the Army.\nThus the superior man increases his masses\nBy generosity toward the people.',//No.17
  
'No.18 Youthful Folly\nYouthful Folly has success.\nIt is not I who seek the young fool;\nThe young fool seeks me.\nAt the first oracle I inform him.\nIf he asks two or three times, it is importunity.\nIf he importunes, I give him no information.\nPerseverance furthers.\nA spring wells up at the foot of the mountain:\nThe image of Youth.\nThus the superior man fosters his character\nBy thoroughness in all that he does.',//No.18
  
'No.19 The Abysmal [Water]\nThe Abysmal repeated.\nIf you are sincere, you have success in your heart,\nAnd whatever you do succeeds.\nWater flows on uninterruptedly and reaches its goal:\nThe image of the Abysmal repeated.\nThus the superior man walks in lasting virtue\nAnd carries on the business of teaching.',//No.19
  
'No.20 Dispersion [Dissolution]\nDispersion. Success.\nThe king approaches his temple.\nIt furthers one to cross the great water.\nPerseverance furthers.\nThe wind drives over the water:\nThe image of Dispersion.\nThus the kings of old sacrificed to the Lord\nAnd built temples.',//No.20
  
'No.21 Deliverance\nDeliverance. The southwest furthers.\nIf there is no longer anything where one has to go,\nReturn brings good fortune.\nIf there is still something where one has to go,\nHastening brings good fortune.\nThunder and rain set in:\nThe image of Deliverance.\nThus the superior man pardons mistakes\nAnd forgives misdeeds.', //No.21
  
'No.22 Before Completion\nBefore Completion. Success.\nBut if the little fox, after nearly completing the crossing,\nGets his tail in the water,\nThere is nothing that would further.\nFire over water:\nThe image of the condition before transition.\nThus the superior man is careful\nIn the differentiation of things,\nSo that each finds its place.',//No.22
  
'No.23 Oppression (Exhaustion)\nOppression. Success. Perseverance.\nThe great man brings about good fortune.\nNo blame.\nWhen one has something to say,\nIt is not believed.\nThere is no water in the lake:\nThe image of Exhaustion.\nThus the superior man stakes his life\nOn following his will.',//No.23
  
'No.24 Conflict\nConflict. You are sincere\nAnd are being obstructed.\nA cautious halt halfway brings good fortune.\nGoing through to the end brings misfortune.\nIt furthers one to see the great man.\nIt does not further one to cross the great water.\nHeaven and water go their opposite ways:\nThe image of Conflict.\nThus in all his transactions the superior man\nCarefully considers the beginning.',//No.24

'No.25 Pushing Upward\nPushing Upward has supreme success.\nOne must see the great man.\nFear not.\nDeparture toward the south\nBrings good fortune.\nWithin the earth, wood grows:\nThe image of Pushing Upward.\nThus the superior man of devoted character\nHeaps up small things\nIn order to achieve something high and great.',//No.25
  
'No.26 Work on What Has Been Spoiled [Decay]\nWork on What Has Been Spoiled\nHas supreme success.\nIt furthers one to cross the great water.\nBefore the starting point, three days.\nAfter the starting point, three days.\nThe wind blows low on the mountain:\nThe image of Decay.\nThus the superior man stirs up the people\nAnd strengthens their spirit.',//No.26
  
'No.27 The Well\nThe Well. The town may be changed,\nBut the well cannot be changed.\nIt neither decreases nor increases.\nThey come and go and draw from the well.\nIf one gets down almost to the water\nAnd the rope does not go all the way,\nOr the jug breaks, it brings misfortune.\nWater over wood: the image of the Well.\nThus the superior man encourages the people at their work,\nAnd exhorts them to help one another.',//No.27
  
'No.28 The Gentle (The Penetrating, Wind)\nThe Gentle. Success through what is small.\nIt furthers one to have somewhere to go.\nIt furthers one to see the great man.\nWinds following one upon the other:\nThe image of the Gently Penetrating.\nThus the superior man\nSpreads his commands abroad\nAnd carries out his undertakings.',//No.28
  
'No.29 Duration\nDuration. Success. No blame.\nPerseverance furthers.\nIt furthers one to have somewhere to go.\nThunder and wind: the image of Duration.\nThus the superior man stands firm\nAnd does not change his direction.',//No.29
  
'No.30 The Caldron\nThe Caldron. Supreme good fortune.\nSuccess.\nFire over wood:\nThe image of the Caldron.\nThus the superior man consolidates his fate\nBy making his position correct.',//No.30
  
'No.31 reponderance of the Great\nPreponderance of the Great.\nThe ridgepole sags to the breaking point.\nIt furthers one to have somewhere to go.\nSuccess.\nThe lake rises above the trees:\nThe image of Preponderance of the Great.\nThus the superior man, when he stands alone,\nIs unconcerned,\nAnd if he has to renounce the world,\nHe is undaunted.',//No.31
  
'No.32 Coming to Meet\nComing to Meet. The maiden is powerful.\nOne should not marry such a maiden.\nUnder heaven, wind:\nThe image of Coming to Meet.\nThus does the prince act when disseminating his commands\nAnd proclaiming them to the four quarters of heaven.',//No.32
  
'No.33 Return (The Turning Point)\nReturn. Success.\nGoing out and coming in without error.\nFriends come without blame.\nTo and fro goes the way.\nOn the seventh day comes return.\nIt furthers one to have somewhere to go.\nThunder within the earth:\nThe image of the Turning Point.\nThus the kings of antiquity closed the passes\nAt the time of solstice.\nMerchants and strangers did not go about,\nAnd the ruler\nDid not travel through the provinces.',//No.33
  
'No.34 The Corners of the Mouth (Providing Nourishment)\nThe Corners of the Mouth.\nPerseverance brings good fortune.\nPay heed to the providing of nourishment\nAnd to what a man seeks\nTo fill his own mouth with.\nAt the foot of the mountain, thunder:\nThe image of Providing Nourishment.\nThus the superior man is careful of his words\nAnd temperate in eating and drinking.',//No.34
  
'No.35 Difficulty at the Beginning\nDifficulty at the Beginning works supreme success,\nFurthering through perseverance.\nNothing should be undertaken.\nIt furthers one to appoint helpers.\nClouds and thunder: The image of Difficulty at the Beginning.\nThus the superior man brings order out of confusion.',//No.35
  
'No.36 Increase\nIncrease. It furthers one\nTo undertake something.\nIt furthers one to cross the great water.\nWind and thunder: the image of Increase.\nThus the superior man:\nIf he sees good, he imitates it;\nIf he has faults, he rids himself of them.',//No.36
  
'No.37 The Arousing (Shock, Thunder)\nShock brings success.\nShock comes-oh, oh!\nLaughing words-ha, ha!\nThe shock terrifies for a hundred miles,\nAnd he does not let fall the sacrificial spoon and chalice.\nThunder repeated: the image of Shock.\nThus in fear and trembling\nThe superior man sets his life in order\nAnd examines himself.',//No.37
  
'No.38 Biting Through\nBiting Through has success.\nIt is favorable to let justice be administered.\nThunder and lightning:\nThe image of Biting Through.\nThus the kings of former times made firm the laws\nThrough clearly defined penalties.',//No.38
  
'No.39 Following\nFollowing has supreme success.\nPerseverance furthers. No blame.\nThunder in the middle of the lake:\nThe image of Following.\nThus the superior man at nightfall\nGoes indoors for rest and recuperation.',//No.39
  
'No.40 Innocence (The Unexpected)\nInnocence. Supreme success.\nPerseverance furthers.\nIf someone is not as he should be,\nHe has misfortune,\nAnd it does not further him\nTo undertake anything.\nUnder heaven thunder rolls:\nAll things attain the natural state of innocence.\nThus the kings of old,\nRich in virtue, and in harmony with the time,\nFostered and nourished all beings.',//No.40
  
'No.41 Darkening of the Light\nDarkening of the Light. In adversity\nIt furthers one to be persevering.\nThe light has sunk into the earth:\nThe image of Darkening of the Light.\nThus does the superior man live with the great mass:\nHe veils his light, yet still shines.',//No.41
  
'No.42 Grace\nGrace has success.\nIn small matters\nIt is favorable to undertake something.\nFire at the foot of the mountain:\nThe image of Grace.\nThus does the superior man proceed\nWhen clearing up current affairs.\nBut he dare not decide controversial issues in this way.',//No.42
  
'No.43 After Completion\nAfter Completion. Success in small matters.\nPerseverance furthers.\nAt the beginning good fortune,\nAt the end disorder.\nWater over fire: the image of the condition\nIn After Completion.\nThus the superior man\nTakes thought of misfortune\nAnd arms himself against it in advance.',//No.43
  
'No.44 The Family [The Clan]\nThe Family. The perseverance of the woman furthers.\nWind comes forth from fire:\nThe image of the Family.\nThus the superior man has substance in his words\nAnd duration in his way of life.',//No.44
  
'No.45 Abundance [Fullness]\nAbundance has success.\nThe king attains abundance.\nBe not sad.\nBe like the sun at midday.\nBoth thunder and lightning come:\nThe image of Abundance.\nThus the superior man decides lawsuits\nAnd carries out punishments.',//No.45
  
'No.46 The Clinging, Fire\nThe Clinging. Perseverance furthers.\nIt brings success.\nCare of the cow brings good fortune.\nThat which is bright rises twice:\nThe image of Fire.\nThus the great man, by perpetuating this brightness,\nIllumines the four quarters of the world.',//No.46
  
'No.47 Revolution (Molting)\nRevolution. On your own day\nYou are believed.\nSupreme success,\nFurthering through perseverance.\nRemorse disappears.\nFire in the lake: the image of Revolution.\nThus the superior man\nSets the calendar in order\nAnd makes the seasons clear.',//No.47
  
'No.48 Fellowship with Men\nFellowship with Men in the open.\nSuccess.\nIt furthers one to cross the great water.\nThe perseverance of the superior man furthers.\nHeaven together with fire:\nThe image of Fellowship with Men.\nThus the superior man organizes the clans\nAnd makes distinctions between things.',//No.48
  
'No.49 Approach\nApproach has supreme success.\nPerseverance furthers.\nWhen the eighth month comes,\nThere will be misfortune.\nThe earth above the lake:\nThe image of Approach.\nThus the superior man is inexhaustible\nIn his will to teach,\nAnd without limits\nIn his tolerance and protection of the people.',//No.49
  
'No.50 Decrease\nDecrease combined with sincerity\nBrings about supreme good fortune\nWithout blame.\nOne may be persevering in this.\nIt furthers one to undertake something.\nHow is this to be carried out?\nOne may use two small bowls for the sacrifice.\nAt the foot of the mountain, the lake:\nThe image of Decrease.\nThus the superior man controls his anger\nAnd restrains his instincts.',//No.50
  
'No.51 Limitation\nLimitation. Success.\nGalling limitation must not be persevered in.\nWater over lake: the image of Limitation.\nThus the superior man\nCreates number and measure,\nAnd examines the nature of virtue and correct conduct.',//No.51
  
'No.52 Inner Truth\nInner Truth. Pigs and fishes.\nGood fortune.\nIt furthers one to cross the great water.\nPerseverance furthers.\nWind over lake: the image of Inner Truth.\nThus the superior man discusses criminal cases\nIn order to delay executions.',//No.52
  
'No.53 The Marrying Maiden\nThe Marrying Maiden.\nUndertakings bring misfortune.\nNothing that would further.\nThunder over the lake:\nThe image of the Marrying Maiden.\nThus the superior man\nUnderstands the transitory\nIn the light of the eternity of the end.',//No.53
  
'No.54 Opposition\nOpposition. In small matters, good fortune.\nAbove, fire; below, the lake:\nThe image of Opposition.\nThus amid all fellowship\nThe superior man retains his individuality.',//No.54
  
'No.55 The Joyous, Lake\nThe Joyous. Success.\nPerseverance is favorable.\nLakes resting one on the other:\nThe image of the Joyous.\nThus the superior man joins with his friends\nFor discussion and practice.',//No.55
  
'No.56 Treading [Conduct]\nTreading. Treading upon the tail of the tiger.\nIt does not bite the man. Success.\nHeaven above, the lake below:\nThe image of Treading.\nThus the superior man discriminates between high and low,\nAnd thereby fortifies the thinking of the people.',//No.56
  
'No.57 Peace\nPeace. The small departs,\nThe great approaches.\nGood fortune. Success.\nHeaven and earth unite: the image of Peace.\nThus the ruler\nDivides and completes the course of heaven and earth;\nHe furthers and regulates the gifts of heaven and earth,\nAnd so aids the people.',//No.57
  
'No.58 The Taming Power of the Great\nThe Taming Power of the Great.\nPerseverance furthers.\nNot eating at home brings good fortune.\nIt furthers one to cross the great water.\nHeaven within the mountain:\nThe image of the Taming Power of the Great.\nThus the superior man acquaints himself with many sayings of antiquity\nAnd many deeds of the past,\nIn order to strengthen his character thereby.',//No.58
  
'No.59 Waiting (Nourishment)\nWaiting. If you are sincere,\nYou have light and success.\nPerseverance brings good fortune.\nIt furthers one to cross the great water.\nClouds rise up to heaven:\nThe image of Waiting.\nThus the superior man eats and drinks,\nIs joyous and of good cheer.',//No.59
  
'No.60 The Taming Power of the Small\nThe Taming Power of the Small has success.\nDense clouds, no rain from our western region.\nThe wind drives across heaven:\nThe image of The Taming Power of the Small.\nThus the superior man\nRefines the outward aspect of his nature.',//No.60
  
'No.61 The Power of the Great\nThe Power of the Great. Perseverance furthers.\nThunder in heaven above:\nThe image of the Power of the Great.\nThus the superior man does not tread upon paths\nThat do not accord with established order.',//No.61
  
'No.62 Possession in Great Measure\nPossession in Great Measure.\nSupreme success.\nFire in heaven above:\nThe image of Possession in Great Measure.\nThus the superior man curbs evil and furthers good,\nAnd thereby obeys the benevolent will of heaven.',//No.62
  
'No.63 Break-through (Resoluteness)\nBreak-through. One must resolutely make the matter known\nAt the court of the king.\nIt must be announced truthfully. Danger.\nIt is necessary to notify ones own city.\nIt does not further to resort to arms.\nIt furthers one to undertake something.\nThe lake has risen up to heaven:\nThe image of Break-through.\nThus the superior man\nDispenses riches downward\nAnd refrains from resting on his virtue.',//No.63
  
'No.64 The Creative\nThe Creative works sublime success,\nFurthering through perseverance.\nThe movement of heaven is full of power.\nThus the superior man makes himself strong and untiring.'//No.64
  
];

