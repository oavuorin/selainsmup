var playState = {
	init: function(stage) {
		this.gameStage = stage;
	},

	create: function() {
		this.cursors = game.input.keyboard.createCursorKeys();
		this.zkey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

		this.ship = game.add.sprite(game.world.centerX, game.world.centerY + 100, 'ship');
		this.ship.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.ship, Phaser.Physics.ARCADE);
		this.ship.body.collideWorldBounds = true;

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.passiveEnemies = game.add.group();

		this.gameTimer = game.time.create(false);
		this.prepareStage();

		this.playerSpeed = 200;
		this.weaponWait = 0;
		this.weaponWaitMax = 5;
		this.bulletSpeed = 500;


		this.gameTimer.start();
	},

	update: function() {
		this.setShipSpeed();
		this.checkShooting();
		this.moveEnemies();
        game.physics.arcade.overlap(this.bullets, this.enemies, this.enemyHit, null, this);
        this.removeTrashBullets();
	},

	render: function() {
		game.debug.text('Elapsed seconds ' + this.gameTimer.seconds, 32, 32);
		game.debug.text('passiveEnemies: ' + this.passiveEnemies.length, 32, 64);
		game.debug.text(this.gameStage[0] + this.gameStage[1], 32, 100);
	},

	setShipSpeed: function() {
		this.ship.body.velocity.x = 0;
		this.ship.body.velocity.y = 0;
		if (this.cursors.left.isDown) {
			this.ship.body.velocity.x -= 1;
		}
		if (this.cursors.right.isDown) {
			this.ship.body.velocity.x += 1;
		}
		if (this.cursors.up.isDown) {
			this.ship.body.velocity.y -= 1;
		}
		if (this.cursors.down.isDown) {
			this.ship.body.velocity.y += 1;
		}

		var vectorLength = Math.sqrt(this.ship.body.velocity.x * this.ship.body.velocity.x + this.ship.body.velocity.y * this.ship.body.velocity.y);
		this.ship.body.velocity.x /= vectorLength;
		this.ship.body.velocity.y /= vectorLength;

		this.ship.body.velocity.x *= this.playerSpeed;
		this.ship.body.velocity.y *= this.playerSpeed;
	},

	checkShooting: function() {
        // shoot
        if (this.zkey.isDown && this.weaponWait == 0) {
            var bullet = this.bullets.create(this.ship.body.x + this.ship.body.width/2 - 3, this.ship.body.y, 'bullet');
            bullet.body.velocity.y = -this.bulletSpeed;
            this.weaponWait = this.weaponWaitMax;
        }
        // lower reload time
        this.weaponWait--;
        if (this.weaponWait < 0) {
            this.weaponWait = 0;
        }
	},

    enemyHit: function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
    },

    removeTrashBullets: function () {
        this.bullets.forEach(function (item) {
            if (item.body.y < 50) {
                item.kill();
            }
        });
    },

	spawnEnemy: function (path) {
        var enemy = this.enemies.create(path[0][0], path[1][0], 'enemy');
        enemy.path = this.createEnemyPath(path[0], path[1]);
        enemy.pi = 0;
    },

    spawnPassiveEnemy: function (path, activationTime) {
        var enemy = this.passiveEnemies.create(path[0][0], path[1][0], 'enemy');
        enemy.path = this.createEnemyPath(path[0], path[1]);
        enemy.pi = 0;
        this.gameTimer.add(Phaser.Timer.SECOND * activationTime, this.activateEnemy, this, enemy);
    },

    createEnemyPath: function(xPoints, yPoints) {
        var path = [];
        var stops = 1 / game.width;

        for (var i = 0; i <= 1; i += stops) {
            var px = Phaser.Math.catmullRomInterpolation(xPoints, i);
            var py = Phaser.Math.catmullRomInterpolation(yPoints, i);
            
            path.push({ x: px, y: py});
        }

        return path;
    },

    moveEnemies: function() {
        this.enemies.forEach(function(item) {
            item.body.x = item.path[item.pi].x;
            item.body.y = item.path[item.pi].y;

            item.pi++;

            if (item.pi >= item.path.length) {
                item.pi = 0;
            }
        });
    },

    activateEnemy: function(enemy) {
    	this.enemies.add(enemy);
    },

	prepareStage: function() {
		var basicEnemy = new Enemy();
		this.spawnPassiveEnemy([[50, 50, 50, 50, 200], [50, 50, 50, 50, 200]], 1);
		for (var i = 0; i < 30; i++) {
			this.spawnPassiveEnemy([[200, 300, 100, 200], [0, 100, 200, 400]], i);
		}
	}
}