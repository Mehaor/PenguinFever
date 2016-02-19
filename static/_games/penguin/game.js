
(function main() {
var assetsDir = 'static/_games/penguin/assets';
var MyGame = {};


MyGame.bootState = function(t) {},
MyGame.bootState.prototype = {
    preload: function() {},
    create: function() {

        this.game.scale.maxWidth = window.innerHeight * 1.5;
        this.game.scale.maxHeight = window.innerHeight;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('preload');
    }
},

MyGame.preloadState = function(t) {},
MyGame.preloadState.prototype = {
    init: function() {

    },
    preload: function() {
        this.text = this.add.text(this.game.width/2, this.game.height/2, 'загрузка', {fill: '#ffffff'});
        this.text.anchor.set(0.5, 0.5);
        this.load.onFileComplete.add(this.fileComplete, this);


        this.load.json('gameText', assetsDir + '/json/game_text.json')
        this.load.image('bgTitle', assetsDir + '/sprites/title_screen.png'),
        this.load.image('bgMain', assetsDir + '/sprites/background.png'),
        this.load.image('bgMain', assetsDir + '/sprites/background.png')
//        this.load.image('bg_title', assetsDir + '/img/bg_title.png'),
 //       this.load.image('roadkill_road', assetsDir + '/img/roadkill/road.png'),
  //      this.load.spritesheet('roadkill_bulldozer', assetsDir + '/img/roadkill/bulldozer.png', 150, 150),
  //      this.load.spritesheet('roadkill_food', assetsDir + '/img/roadkill/food.png', 70, 95),


    },

    create: function() {
        //console.log(text.text);
        this.game.startNewGame(); /*this.state.start('title')*/
    },

    fileComplete: function(progress) {
        this.text.text = 'загрузка ' + progress + '%';
    }
},

MyGame.titleScreenState = function(t) {},
MyGame.titleScreenState.prototype = {
    init: function(){
        this.game.globalScore = 0;
        this.game.currentLevel = -1;
    },
    create: function() {
        this.background = this.add.sprite(0, 0, 'bgTitle');
        this.input.onDown.add(this.onDown, this);

    },
    onDown: function(pointer) {
        this.state.start('main');

    }
},

MyGame.mainState = function(t) {},
MyGame.mainState.prototype = {
    init: function() {
        this.score = 0;
        this.gameTimer = 0;
    },

    create: function() {
        this.add.sprite(0, 0, "bgMain");
    }
},


MyGame.infoState = function(t) {},
MyGame.infoState.prototype = {
    init: function(score, isDescription, infoText) {
        this.localScore = score;
        this.currentStateName = this.game.getCurrentStateName();
        this.infoText = infoText;
        this.isDescription = isDescription;
        this.currentScore = 0;
        this.scorePart = this.localScore / 10;
        this.world.setBounds(0, 0, this.game.width, this.game.height);

    },

    create: function() {
        this.showBg();
        this.infoWindow = this.add.sprite( this.game.width / 2, -this.game.height/2, 'infoWindow');
        this.infoWindow.inputEnabled = true;
        if (this.isDescription) {
            this.infoWindow.events.onInputDown.add(function() {
                this.state.start(this.currentStateName);
            }, this);
        }
        this.physics.arcade.enable(this.infoWindow);
        this.infoWindow.anchor.set(0.5, 0.5);
        this.infoWindow.body.velocity.y = 1800;

        this.scoreText = this.add.text(this.game.width / 2, this.game.height / 2, '423', {font: '40px Arial', fill: '#ffffff'})
        this.scoreText.visible = false;
        this.scoreText.anchor.set(0.5, 0.5);

        this.buttonReplay = this.add.sprite(95, this.game.height - 290, 'buttons');
        this.buttonReplay.inputEnabled = true;
        this.buttonReplay.events.onInputDown.add(function() {
            this.game.startNextLevel(true);
        }, this);
        this.buttonReplay.scale.set(0.7, 0.7);

        this.buttonNext = this.add.sprite(this.game.width - 305, this.game.height - 290, 'buttons');
        this.buttonNext.animations.add('next', [1]); this.buttonNext.animations.play('next');
        this.buttonNext.inputEnabled = true;
        this.buttonNext.events.onInputDown.add(function() {
            this.game.globalScore += this.localScore;
            this.game.startNextLevel(false);
        }, this);
        this.buttonNext.scale.set(0.7, 0.7);

        this.buttonNext.visible = false;
        this.buttonReplay.visible = false;

        this.timer = this.time.create(false);

        this.timer.loop(100, this.showInfo, this);

    },

    update: function() {
        if (this.infoWindow.body.velocity.y != 0 && this.infoWindow.y > this.game.height/2) {
            this.infoWindow.body.velocity.y = 0;
            this.infoWindow.y = this.game.height * 0.5;
            if (!this.isDescription) this.scoreText.visible = true;
            this.timer.start();
        }
        if (!this.isDescription) this.scoreText.text = 'Ваш счет: ' + (this.currentScore <= this.localScore ?   Math.floor(this.currentScore) : this.localScore);
    },
    showInfo: function() {
        if (!this.isDescription) {
            this.currentScore += this.scorePart;

            if (this.currentScore >= this.localScore) {
                this.currentScore = this.localScore;
                this.timer.stop();
                this.buttonNext.visible = true;
                this.buttonReplay.visible = true;
            }
        }
        else {
            this.showDescription();
            this.timer.stop();
        }
    },
    showDescription: function() {
        //console.log('Описание');
    },

    showBg: function() {
        if (this.currentStateName == 'gameShootingGallery') {
            this.add.sprite(0, 0, 'shootingGallery_bg');
            this.panelUp = this.add.sprite(0, 200, 'shootingGallery_panels');
            this.panelUp.animations.add('up', [0]);
            this.panelUp.animations.play('up');
            this.panelMiddle = this.add.sprite(0, 350, 'shootingGallery_panels');
            this.panelMiddle.animations.add('middle', [1]);
            this.panelMiddle.animations.play('middle');
            this.panelDown = this.add.sprite(0, 500, 'shootingGallery_panels');
            this.panelDown.animations.add('down', [2]);
            this.panelDown.animations.play('down');
        }
        if (this.currentStateName == 'gameKissing') this.add.sprite(0, 0, 'kissing_bg');

        if (this.currentStateName == 'gamePancakes') this.add.sprite(0, 0, 'pancakes_bg');
        if (this.currentStateName == 'gameRoadkill') {
            for (var i = 0; i < this.game.width / 60 + 1; i++ ) {
                this.add.image(i * 60, 0, 'roadkill_road');
            }
        }

        if (this.currentStateName == 'gameFirefight') this.add.image(0, 0, 'firefight_bg');
        if (this.currentStateName == 'gameSeagull') this.add.image(0, 0, 'seagull_bg');
        if (this.currentStateName == 'gamePrison') this.add.sprite(0, 0, 'prison_bg');
        if (this.currentStateName == 'gameDetective') this.add.sprite(0, 0, 'detective_bg');
        if (this.currentStateName == 'gameTrucks') this.add.sprite(0, 0, 'trucks_road');
        if (this.currentStateName == 'gameStrike') this.add.sprite(0, 0, 'strike_bg');
        if (this.currentStateName == 'gameShooter') this.add.sprite(0, 0, 'shooter_bg');

    }
},


MyGame.finishState = function(t) {},
MyGame.finishState.prototype = {
    create: function() {
        this.finishText = this.add.text(100, 100, 'Gameover ' + this.game.globalScore, {fontsize: '32px', fill: '#fff'});
        this.input.onDown.add(this.onDown, this);

    },
    onDown: function(pointer) {
        this.game.startNewGame();
    }
};


window.onload = function() {
    var t = new Phaser.Game(900, 600, Phaser.AUTO, 'game_container');
    t.startNewGame = function() {
        this.globalScore = 0;
        this.currentLevel = -1;
        this.state.start('title');
    },

    /*t.startNextLevel = function(isRestart) {
        if (!isRestart) this.currentLevel++;
        if (this.currentLevel < 0) this.currentLevel = 0;
        if (this.currentLevel >= gamesOrder.length || gamesOrder.lenght == 0) {
            this.state.start('finish');
            //this.startNewGame();
        }
        else this.state.start('info', true, false, 0, true);

            //this.state.start(gamesOrder[this.currentLevel]);
    },*/
    /*t.startNewState = function() {

    },
    t.getCurrentStateName = function() {
        return gamesOrder[this.currentLevel];
    },*/

    t.global = {},
        t.state.add('boot', MyGame.bootState),
        t.state.add('preload', MyGame.preloadState),
        t.state.add('title', MyGame.titleScreenState),
        t.state.add('main', MyGame.mainState),
        t.state.add('finish', MyGame.finishState),
        t.state.start('boot');
};

})();
