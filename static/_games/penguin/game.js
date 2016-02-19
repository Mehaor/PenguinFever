
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


        this.load.json('gameText', assetsDir + '/json/game_text.json'),
        this.load.image('bgTitle', assetsDir + '/sprites/title_screen.png'),
        this.load.image('bgMain', assetsDir + '/sprites/background.png'),
        this.load.spritesheet('character', assetsDir + '/sprites/character.png', 285, 380)

    },

    create: function() {
        this.state.start('title');
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

        //this.bulldozer = this.add.sprite(0, this.drivePoint - 75, 'roadkill_bulldozer');



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

        this.character = this.add.sprite(0, 0, 'character');

        this.character.x = this.game.width / 2;
        this.character.y = this.game.height - this.character.height;
        this.character.anchor.x = 0.5;
        this.character.handPosition = -1;

        this.character.animations.add('idle', [3], 0, true);
        this.character.animations.add('angry', [0], 0, true);

        this.character.animations.add('low', [2], 0, true);
        this.character.animations.add('high', [4], 0, true);
        this.character.animations.add('catch', [1], 0, true);

        this.character.animations.play('idle');

        this.input.onDown.add(this.onDown, this);

        this.penguins = this.add.group();
        this.penguins.enableBody = true;
    },

    update: function() {
        if (this.character.handPosition == 0 || this.character.handPosition == 1) {
            this.character.scale.x = -1;
        }
        else this.character.scale.x = 1;

    },

    onDown: function(pointer) {
        if (pointer.worldX > this.game.width / 2 && pointer.worldY < this.game.height / 2) {
            this.character.handPosition = 0;
            this.character.animations.play('high');
        }
        else if (pointer.worldX > this.game.width / 2 && pointer.worldY >= this.game.height / 2) {
            this.character.handPosition = 1;
            this.character.animations.play('low');
        }
        if (pointer.worldX < this.game.width / 2 && pointer.worldY > this.game.height / 2) {
            this.character.handPosition = 2;
            this.character.animations.play('low');
        }
        else if (pointer.worldX < this.game.width / 2 && pointer.worldY < this.game.height / 2) {
            this.character.handPosition = 3;
            this.character.animations.play('high');
        }
        console.log(this.character.handPosition);
    },


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

    t.global = {},
        t.state.add('boot', MyGame.bootState),
        t.state.add('preload', MyGame.preloadState),
        t.state.add('title', MyGame.titleScreenState),
        t.state.add('main', MyGame.mainState),
        t.state.add('finish', MyGame.finishState),
        t.state.start('boot');
};

})();
