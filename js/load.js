var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

		game.load.image('player', 'assets/player.png');
		game.load.image('win', 'assets/win.png');
		game.load.image('ship', 'assets/ship.png');
		game.load.image('enemy', 'assets/enemy.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.text('stage1', 'stages/stage1.xml');
	},

	loadStage: function() {
		var stagez = game.cache.getText('stage1');
		var stagez = stagez.split("\n");
		return stagez;
	},

	parseStage: function(stage) {
		//
	},

	create: function() {
		this.stage = this.loadStage();
		game.state.start('play', true, false, this.stage);
	}
};