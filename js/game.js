// Create canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var then;
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};

bgImage.src = "images/background.png";

var Hero = function () {
	this.sprite = "images/hero.png";
	this.speed = 256;
	this.x = 0;
	this.y = 0;
}

Hero.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Monster = function() {
	this.sprite = "images/monster.png";
	this.x = 0;
	this.y = 0;
};

Monster.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e){
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster

var reset = function() {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw monster on screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects

var update = function (dt) {
	if (38 in keysDown) { // Player holding up 
		hero.y -= hero.speed * dt;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * dt;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * dt;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * dt;
	}
	// Collision?

if (
		hero.x <= (monster.x + 32) &&
		monster.x <= (hero.x + 32) &&
		hero.y <= (monster.y + 32) &&
		monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
	reset();
	}
};

// Draw all the things

var render = function() {
	if (bgReady){
		ctx.drawImage(bgImage,0,0);
	}

	hero.render();
	monster.render();

	// Score

	ctx.fillStyle = "rgb(250,250,250";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
};

// Main game loop

var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross browser support for looping
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Play!
var hero = new Hero();
var monster = new Monster();

function init() {
  var then = Date.now();
	reset();
	main();
}
Resources.load([
	"images/background.png",
	"images/hero.png",
	"images/monster.png"
]);
Resources.onReady(init);
