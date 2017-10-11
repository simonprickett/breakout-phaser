import Phaser from 'phaser-ce'
import game from './main'

const mainState = {
  preload () {
  	game.stage.backgroundColor = '#3598db'
  	game.physics.startSystem(Phaser.Physics.ARCADE)

  	game.world.enableBody = true

  	game.load.image('brick1', 'assets/box1.png')
  	game.load.image('brick2', 'assets/box2.png')
  	game.load.image('brick3', 'assets/box3.png')
  	game.load.image('paddle', 'assets/paddle.png')
  	game.load.image('ball', 'assets/ball.png')
  },

  create () {
  	this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
  	this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  	this.left2 = game.input.keyboard.addKey(Phaser.Keyboard.A)
  	this.right2 = game.input.keyboard.addKey(Phaser.Keyboard.D)

  	this.paddle = game.add.sprite(200, 400, 'paddle')

  	// immovable = no momentum when collides with ball etc
  	this.paddle.body.immovable = true

  	this.bricks = game.add.group()

  	for (var i = 0; i < 5; i++) {
  		for (var j = 0; j < 5; j++) {
  			const x = (i * 60) + 55  // width and height of brick image
  			const y = (j * 35) + 55
  			const brickNum = (Math.floor(Math.random() * 3) + 1)
  			const brick = game.add.sprite(x, y, 'brick' + brickNum)

  			brick.brickType = brickNum
  			brick.hitsRemaining = brickNum

  			// immovable = no momentum when ball hits the brick
  			brick.body.immovable = true
  			this.bricks.add(brick)
  		}
  	}

  	this.ball = game.add.sprite(200, 300, 'ball')
  	this.ball.body.velocity.x = 200
  	this.ball.body.velocity.y = 200

  	// set ball to bounce equally hard in both planes
  	this.ball.body.bounce.setTo(1) // x, y or both if one param

  	this.ball.body.collideWorldBounds = true
  },

  update () {
  	// this runs every frame

  	if (this.left.isDown || this.left2.isDown) {
  		this.paddle.body.velocity.x = -350
  	} else if (this.right.isDown || this.right2.isDown) {
  		this.paddle.body.velocity.x = 350
  	} else {
  		this.paddle.body.velocity.x = 0
  	}

  	game.physics.arcade.collide(this.paddle, this.ball, this.paddleHit, null, this)
  	game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this)

  	// detect ball missed the paddle and end the game
  	if (this.ball.y > this.paddle.y) {
  		game.state.start('main')
  	}
  },

  paddleHit(paddle, ball) {
  	// do something when ball hits paddle
  	ball.tint = 0xFFFFFF
  },

  hit (ball, brick) {
  	ball.tint = 0XCCCCCC

  	brick.hitsRemaining--

  	if (brick.hitsRemaining === 0) {
  		brick.kill()
  		this.bricks.remove()
  	}

  	switch(brick.brickType) {
  		case 1:
  			this.ball.body.velocity.x = 250
  			this.ball.body.velocity.y = 250
  			break
  		case 2:
  			this.ball.body.velocity.x = 100
  			this.ball.body.velocity.y = 100
  			break
  		case 3:
  			this.ball.body.velocity.x = 200
  			this.ball.body.velocity.y = 200
  			break
  	}

  	// If there are 0 bricks remaining, reset
  	if (this.bricks.length === 0) {
  		game.state.start('main')
  	}
  }
}

export default mainState
