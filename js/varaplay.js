var playState = {
    var ship;
    var playerSpeed;
    var weaponWait;
    var weaponWaitMax;

    var bullets;
    var bulletSpeed;

    var waveList;

    var enemies;

    var gameTimer;

    var cursors;
    var zKey;

    create: function () {

        // set up player's ship
        ship = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(ship);
        ship.body.collideWorldBounds = true;
        playerSpeed = 200;
        weaponWait = 0;
        weaponWaitMax = 5;
        bulletSpeed = 500;

        // groupings for game elements
        bullets = game.add.group();
        bullets.enableBody = true;
        enemies = game.add.group();
        enemies.enableBody = true;

        // EI TOIMI VIEL
        // var vihu = new enemy("p");

        gameTimer = game.time.create(false);
        gameTimer.start();
        createWaveEvents();

        cursors = game.input.keyboard.createCursorKeys();
        zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    },

    update: function () {
        setShipSpeed();
        checkShooting();

        moveEnemies();

        //spawnEnemies();
        game.physics.arcade.overlap(bullets, enemies, enemyHit, null, this);
        removeTrashBullets();
    },

    render: function () {
        game.debug.text('Elapsed seconds ' + gameTimer.seconds, 32, 32);
        game.debug.text('FPS: '+ game.time.fps, 32, 64);
    },

    setShipSpeed: function () {
        ship.body.velocity.x = 0;
        ship.body.velocity.y = 0;
        if (cursors.left.isDown) {
            ship.body.velocity.x -= 1;
        }
        if (cursors.right.isDown) {
            ship.body.velocity.x += 1;
        }
        if (cursors.up.isDown) {
            ship.body.velocity.y -= 1;
        }
        if (cursors.down.isDown) {
            ship.body.velocity.y += 1;
        }
        
        var vectorLength = Math.sqrt(ship.body.velocity.x*ship.body.velocity.x + ship.body.velocity.y*ship.body.velocity.y);
        ship.body.velocity.x /= vectorLength;
        ship.body.velocity.y /= vectorLength;
        
        ship.body.velocity.x *= playerSpeed;
        ship.body.velocity.y *= playerSpeed;
    },

    checkShooting: function () {
        // shoot
        if (zKey.isDown && weaponWait == 0) {
            var bullet = bullets.create(ship.body.x + ship.body.width/2 - 3, ship.body.y, 'bullet');
            bullet.body.velocity.y = -bulletSpeed;
            weaponWait = weaponWaitMax;
        }
        // lower reload time
        weaponWait--;
        if (weaponWait < 0) {
            weaponWait = 0;
        }

    },

    removeTrashBullets: function () {
        bullets.forEach(function (item) {
            if (item.body.y < 50) {
                item.kill();
            }
        });
    },

    spawnEnemy: function (path) {
        var enemy = enemies.create(path[0][0], path[1][0], 'enemy');
        enemy.path = createEnemyPath(path[0], path[1]);
        enemy.pi = 0;
    },

    enemyHit: function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
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
        enemies.forEach(function(item) {
            item.body.x = item.path[item.pi].x;
            item.body.y = item.path[item.pi].y;

            item.pi++;

            if (item.pi >= item.path.length) {
                item.pi = 0;
            }
        });
    },

    spawnWave: function(wave) {
        for (var enemy = 0; enemy < wave.length; enemy++) {
            //
        }

    },

    createWaveEvents: function() {
        gameTimer.add(Phaser.Timer.SECOND * 0.5, spawnEnemy, this, [[200, 300, 100, 200], [0, 100, 200, 400]]);
        gameTimer.add(Phaser.Timer.SECOND * 1.5, spawnEnemy, this, [[200, 300, 100, 200], [0, 100, 200, 400]]);
        gameTimer.add(Phaser.Timer.SECOND * 2.5, spawnEnemy, this, [[200, 300, 100, 200], [0, 100, 200, 400]]);
    }
};
