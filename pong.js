
// constants
var WIDTH=800, HEIGHT=600, pi=Math.PI,

	playerWidth = 20, playerHeight = 100,

	leftPlayerColour = "#C80A90", rightPlayerColour = "#00CAF0", ballColour = "#FF8822",

	playerSpeed = 8, ballSpeed = 5, ballRadius = 10,

	rightPlayerUp = 38, rightPlayerDown = 40, // customized keys to control players
	leftPlayerUp = 87, leftPlayerDown = 83,

// gameplay variables
canvas, context, keystates, gameover=false;

leftPlayer = new Player(playerWidth, (HEIGHT-playerHeight)/2, leftPlayerUp, leftPlayerDown, leftPlayerColour),
rightPlayer = new Player(WIDTH-2*playerWidth, (HEIGHT-playerHeight)/2, rightPlayerUp, rightPlayerDown, rightPlayerColour),
ball = new Ball(WIDTH/2, HEIGHT/2, ballColour);

function main(){
	canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	context = canvas.getContext('2d');
	document.body.appendChild(canvas);

	// listen to keys pressed
	keystates = {};
	document.addEventListener('keydown', function(e) {
		keystates[e.keyCode] = true;
	});
	document.addEventListener('keyup', function(e) {
		delete keystates[e.keyCode];
	});
	leftPlayer.score=0;
	rightPlayer.score=0;

	// keep updating the frame
	var updateframe = function() {
		update();
		draw();
		window.requestAnimationFrame(updateframe, canvas);
	};
	window.requestAnimationFrame(updateframe, canvas);
}


function draw(){
	context.fillStyle = "#222222";
	context.fillRect(0, 0, WIDTH, HEIGHT);

	context.save();


	leftPlayer.draw();
	rightPlayer.draw();
	ball.draw();

	context.restore();
}

function update(){

	$("#leftscore").html("<b>Left Player: "+leftPlayer.score+"</b>");
	$("#rightscore").html("<b>Right Player: "+rightPlayer.score+"</b>");

	if(leftPlayer.height>HEIGHT||rightPlayer.height>HEIGHT){
		gameover = true;
		$("#gameover").html("<b>GAME OVER!</b>");
	}else{
		leftPlayer.move();
		rightPlayer.move();
		ball.move();
	}
}

function Ball(x,y,colour){
	this.x = x;
	this.y = y;
	var velocity_y = 3;
	var velocity_x = ballSpeed;

	this.move = function(){

				
		if(this.y<ballRadius || this.y>HEIGHT-ballRadius){ //the ball hits top or bottom wall
			velocity_y = -velocity_y;
		}
		if(leftPlayer.collide()==true||rightPlayer.collide()==true){ //the ball hits player's paddle			
			if (velocity_x>0)velocity_x = -velocity_x-0.5;
			else velocity_x = -velocity_x+0.5;
		}
		if(this.x+ballRadius>WIDTH){ //left player score 
			this.x = 2*playerWidth+ballRadius+1; //left player serve
			this.y = leftPlayer.y+playerHeight/2;
			velocity_x = ballSpeed;
			leftPlayer.addScore();
		}
		if(this.x<ballRadius){ //right player score 
			this.x = WIDTH-2*playerWidth-ballRadius-1; //right player serve
			this.y = rightPlayer.y+playerHeight/2;
			velocity_x = -ballSpeed;
			rightPlayer.addScore();
		}
		this.x+=velocity_x;
		this.y+=velocity_y;
		
	};
	this.draw = function(){
		context.beginPath();
  		context.arc(this.x, this.y, ballRadius, 2*pi, false);
  		context.shadowBlur=10;
		context.shadowColor="white";
		context.fillStyle = colour;
		context.fill();
	};
}




function Player(x, y, up, down, colour){
	this.x = x;
	this.y = y;
	var score;
	var upkey = up;
	var downkey = down;
	var colour = colour;
	this.width = playerWidth;
	this.height = playerHeight;

	this.collide = function(){
		return(ball.x<ballRadius+this.x+this.width&&ball.x>this.x-ballRadius&&ball.y<this.y+this.height+ballRadius&&ball.y>this.y-ballRadius);
	};

	this.draw = function() {
		context.shadowBlur=10;
		context.shadowColor="yellow";
  		context.fillStyle = colour;
		context.fillRect(this.x, this.y, this.width, this.height);
	};

	this.move = function () {
    	if(keystates[upkey])

    		this.y -= playerSpeed;
    	if(keystates[downkey])
    		this.y += playerSpeed;

    	this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	};

	this.addScore = function(){
		this.height += 60;
		this.score++;
	}
}

main();