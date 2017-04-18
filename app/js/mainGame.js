(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals console */
/* jshint esversion: 6 */

// A node container object which wraps the current tile with information
// about whether it has already been stored in the color tree
var ColorNodeContainer = exports.ColorNodeContainer = function ColorNodeContainer(colorTile) {
   _classCallCheck(this, ColorNodeContainer);

   this.tile = colorTile;
   this.matched = false;
};

/*
 * Node
 *
 * The node object has a data element and an array which
 * contains an array with all of the connected child nodes
 *
 */


var ColorNode = exports.ColorNode = function ColorNode(data) {
   _classCallCheck(this, ColorNode);

   this.data = data;
   this.children = [];
};

/*
 * ColorTree
 *
 * The main tree objects which contains a number of helpful
 * methods for adding, removing, and manipulating nodes.
 *
 */


var ColorTree = exports.ColorTree = function () {
   function ColorTree() {
      _classCallCheck(this, ColorTree);

      this.nodeCount = 0;
      this.root = null;
   }

   /*
    * add
    *
    * This function adds nodes to the tree
    *
    */


   _createClass(ColorTree, [{
      key: 'add',
      value: function add(data, toNodeData) {

         // Creates a node with the data stored and uses the
         // breadth first search
         var node = new ColorNode(data);
         var parent = toNodeData ? this.findBFS(toNodeData) : null;

         // As a reminder null will return false, and any object
         // will return true, even with no data assigned.
         if (parent) {
            parent.children.push(node);
         } else {

            // If this is the top level and a root hasn't been assigned
            // the node will be assigned to it
            if (!this.root) {
               this.root = node;
            } else {
               return 'Root node is already assigned';
            }
         }
      }

      /*
       * remove
       *
       * searches the tree for the node with the particular data
       * and removes it.
       *
       */

   }, {
      key: 'remove',
      value: function remove(data) {

         // Checks if the data in the root is the requested
         // data to delete, not that it does not remove references
         if (this.root.data === data) {
            this.root = null;
         }

         // Initializes array named queue with node object which
         // contains a sub array of all child nodes
         var queue = [this.root];

         // While there are entries in the queue then continue
         // At most is O(n) where n is the number of nodes in
         // the tree
         while (queue.length) {

            // Removes the node in the queue at index 0
            var node = queue.shift();

            // Iterate through the child nodes in the current
            // array and check if they contain the data.
            for (var i = 0; i < node.children.length; i++) {

               if (node.children[i].data === data) {

                  // If data found splice it from current child node
                  // array
                  node.children.splice(i, 1);
               } else {

                  // If data not found add the child node to the queue
                  // and the search continues
                  queue.push(node.children[i]);
               }
            }
         }
      }

      /*
       * contains
       *
       * searches the tree for the data using the breadth first
       * search
       *
       */

   }, {
      key: 'contains',
      value: function contains(data) {
         return this.findBFS(data) ? true : false;
      }

      /*
       * findBFS
       *
       * uses a breadth first search to find the node
       * associated with the data
       *
       */

   }, {
      key: 'findBFS',
      value: function findBFS(data) {

         // Grab the root node to start the search
         var queue = [this.root];

         // Initiate same search as in the remove method
         while (queue.length) {

            var node = queue.shift();

            if (node.data === data) {
               return node;
            }
            for (var i = 0; i < node.children.length; i++) {
               queue.push(node.children[i]);
            }
         }

         // If no node found then it will return null by default
         return null;
      }

      /*
       * _preOrder
       *
       * Uses a recursive approach to search the tree depth first
       * Will execute the function of the highest node first
       *
       */

   }, {
      key: '_preOrder',
      value: function _preOrder(node, fn) {
         if (node) {
            if (fn) {
               fn(node);
            }

            // For each element in the child array it will
            // continue to dive deeper until null is returned
            for (var i = 0; i < node.children.length; i++) {
               this._preOrder(node.children[i], fn);
            }
         }
      }

      /*
       * _postOrder
       *
       *  Uses a recursive approach to search the tree depth first
       *  Will execute the function of the lowest node first
       *
       */

   }, {
      key: '_postOrder',
      value: function _postOrder(node, fn) {
         if (node) {
            for (var i = 0; i < node.children.length; i++) {
               this._postOrder(node.children[i], fn);
            }
            if (fn) {
               fn(node);
            }
         }
      }

      /*
       * traverseDFS
       *
       * Traverses the tree in a depth first search implementing a custom
       * function for each of the nodes visited
       *
       */

   }, {
      key: 'traverseDFS',
      value: function traverseDFS(fn, method) {
         var current = this.root;

         if (method) {
            this['_' + method](current, fn);
         } else {
            this._preOrder(current, fn);
         }
      }

      /*
       * traverseBFS
       *
       * Traverses the tree in a breadth first search implementing a custom
       * function for each of the nodes visited. Uses same queue searching method
       *
       */

   }, {
      key: 'traverseBFS',
      value: function traverseBFS(fn) {
         var queue = [this.root];
         while (queue.length) {
            var node = queue.shift();
            if (fn) {
               fn(node);
            }
            for (var i = 0; i < node.children.length; i++) {
               queue.push(node.children[i]);
            }
         }
      }
   }]);

   return ColorTree;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._ggPlayerName = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gridGrindState = require('./grid-grind-state.js');

var _gridGrindState2 = _interopRequireDefault(_gridGrindState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esversion: 6 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *              
 *    [][][]  [][][] [][][] [][][]    [][][]  [][][] [][][] []    [] [][][]
 *    []      []  []   []   []   []   []      []  []   []   [][]  [] []   []
 *    [] [][] [][]     []   []   []   [] [][] [][]     []   [] [] [] []   []
 *    []  []  [] []    []   []   []   []  []  [] []    []   []  [][] []   []
 *    [][][]  []  [] [][][] [][][]    [][][]  []  [] [][][] []    [] [][][]
 * 
 *                              Author : Alex Dodge
 *                       Last Modified : April 17, 2017
 *                             License : MIT     
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Global variables for initial navigation and to hold the players name
var _ggPlayerName = exports._ggPlayerName = undefined;
var _ggNavigation;

var Game = function (_Phaser$Game) {
  _inherits(Game, _Phaser$Game);

  /**
   * The game object initializes each piece.
   *
   * Game(width, height, renderer, phaser state objects)
   *
   * The Phaser.AUTO will auto detect which browser rendering to use and the null
   * parameter sets the default phaser states (preload, create, update).
   *
   */
  function Game() {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, 400, 400, Phaser.AUTO, 'gg-game-container', null));

    _this.state.add('GridGrind', _gridGrindState2.default, false);
    _this.state.start('GridGrind');

    _this.WebFontConfig = {
      active: function active() {
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
      },
      google: {
        families: ['Fjalla One']
      }
    };
    return _this;
  }

  return Game;
}(Phaser.Game);

var Navigation = function () {
  function Navigation(playerName) {
    _classCallCheck(this, Navigation);

    this.playerName = playerName;
    this.currentStep = 0;
  }

  /**
   * Navigates to the next tutorial slide. Checks if first time in
   * tutorial and adjusts screen accordingly.
   */


  _createClass(Navigation, [{
    key: 'nextSlide',
    value: function nextSlide() {
      if (this.currentStep === 0) {
        $('.gg-tutorial').fadeIn('fast');

        this.currentStep++;
        $('.gg-tutorial-slide' + this.currentStep).delay(800).fadeIn('fast');
      } else {
        this.currentStep++;
        $('.gg-tutorial-slide' + (this.currentStep - 1)).fadeOut('fast');
        $('.gg-tutorial-slide' + this.currentStep).delay(250).fadeIn('fast');
      }
    }

    /**
     * Navigates to the previous tutorial slide. Allows you to go back to
     * the main introduction screen so you can change your name before 
     * starting the game.
     */

  }, {
    key: 'prevSlide',
    value: function prevSlide() {
      if (this.currentStep - 1 === 0) {
        $('.gg-tutorial-slide' + this.currentStep).fadeOut('fast');
        $('.gg-tutorial').delay(500).fadeOut('fast');
        this.currentStep--;
      } else {
        this.currentStep--;
        $('.gg-tutorial-slide' + (this.currentStep + 1)).fadeOut('fast');
        $('.gg-tutorial-slide' + this.currentStep).delay(250).fadeIn('fast');
      }
    }

    /**
     * Navigates to the final slide. Is triggered when the player chooses
     * to skip the tutorial.
     */

  }, {
    key: 'finalSlide',
    value: function finalSlide() {
      var _this2 = this;

      $('.gg-tutorial-slide' + this.currentStep).fadeOut('fast', function () {
        _this2.currentStep = 4;
      });
      $('.gg-tutorial-slide4').delay(250).fadeIn('fast');
    }
  }, {
    key: 'startGame',
    value: function startGame() {
      $('.gg-tutorial-slide' + this.currentStep).fadeOut('fast');
      $('.gg-tutorial').delay(250).fadeOut('fast');
      $('.gg-intro').delay(500).fadeOut('fast', function () {
        var ggGame = new Game();
        $('.gg-user-interface').removeClass('gg-hide-game');
        $('#gg-game-container').removeClass('gg-hide-game');
        exports._ggPlayerName = _ggPlayerName = $('.gg-field-input').val();
      });
    }
  }]);

  return Navigation;
}();

/**
 * Program is driven from this function. Begins once player
 * navigates through the tutorial, or skips it.
 */


$(document).ready(function () {
  $('#gg-game-container').addClass('gg-hide-game');

  $('.gg-intro-button').click(function () {
    _ggNavigation = new Navigation($('.gg-field-input').val());
    _ggNavigation.nextSlide();
  });

  $('.gg-button-next').click(function () {
    _ggNavigation.nextSlide();
  });

  $('.gg-button-back').click(function () {
    _ggNavigation.prevSlide();
  });

  $('.gg-skip-tutorial').click(function () {
    _ggNavigation.finalSlide();
  });

  $('.gg-button-start').click(function () {
    _ggNavigation.startGame();
  });
});

},{"./grid-grind-state.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.GridGrind = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _levels = require('./levels.js');

var _game = require('./game.js');

var _colorTree = require('./colorTree.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esversion: 6 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 *    [][][]  [][][] [][][] [][][]    [][][]  [][][] [][][] []    [] [][][]
 *    []      []  []   []   []   []   []      []  []   []   [][]  [] []   []
 *    [] [][] [][]     []   []   []   [] [][] [][]     []   [] [] [] []   []
 *    []  []  [] []    []   []   []   []  []  [] []    []   []  [][] []   []
 *    [][][]  []  [] [][][] [][][]    [][][]  []  [] [][][] []    [] [][][]
 *
 *                              Author : Alex Dodge
 *                       Last Modified : April 14, 2017
 *                             License : MIT
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var GridGrind = exports.GridGrind = function (_Phaser$State) {
   _inherits(GridGrind, _Phaser$State);

   function GridGrind() {
      _classCallCheck(this, GridGrind);

      var _this = _possibleConstructorReturn(this, (GridGrind.__proto__ || Object.getPrototypeOf(GridGrind)).call(this));

      _this.blocks = null;
      _this.level = null;
      _this.currentLevel = 1;
      _this.PADDING = 5;
      _this.movesLeft = 4;
      _this.pointsLeft = 5;
      _this.playerName = "Alex";
      _this.score = 0;
      _this.gameStarted = false;
      _this.loadingScreen = null;

      // Text variables
      _this.levelText;
      _this.levelTextStyle;
      _this.endText;
      _this.endTextStyle;
      return _this;
   }

   /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *
     *                               preload()
     *
     * Used to load assets and also setup the features of the game. In this case
     * the background color is set, the page is scaled, and the sprites are loaded
     * into the game.
     *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


   _createClass(GridGrind, [{
      key: 'preload',
      value: function preload() {
         this.game.stage.backgroundColor = '#eee';
         this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
         this.game.load.spritesheet('blocks', '../img/hr-blocks.png', 100, 100);
      }

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       *
       *                                 create()
       *
       * This is called once the preload is finished and is responsible for the setup
       * logic where you use the sprites. For this game with blocks are generated
       * and the text fields are setup.
       *
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

   }, {
      key: 'create',
      value: function create() {
         var _this2 = this;

         // Cleans out all previous objects
         this.game.world.removeAll(true);

         // Create a reference sprite to be passed into the current level
         var referenceSprite = this.game.add.sprite(0, 0, 'blocks');
         referenceSprite.visible = false;

         // Generate level object based on difficulty
         this.level = new _levels.Level(this.currentLevel, this.game.width, referenceSprite.width);

         // Setup level text indicator
         this.levelTextStyle = {
            font: 'Fjalla One',
            fontSize: 80,
            fill: '#333',
            align: 'center'
         };
         this.levelText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Level ' + this.currentLevel, this.levelTextStyle);
         this.levelText.anchor.setTo(0.5, 0.5);
         this.levelText.alpha = 0;
         this.game.add.tween(this.levelText).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);

         // Show the level intro text, as well as the start button
         setTimeout(function () {
            _this2.game.add.tween(_this2.levelText).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            // Draws the block objects on the screen for each frame
            // Draws from a randomized array of the original sprite colours
            _this2.initBlocks();
         }, 1000);

         // To add text elements to the game
         this.pointsLeft = this.level.getPoints();
         this.movesLeft = this.level.getMoves();
         $("#update-points").html(this.score);
         $("#update-moves-left").html(this.movesLeft);
         $("#player-name").html(this.playerName);
         $('#update-points-total').html(this.pointsLeft);
         $('#update-points-left').html('0');

         this.gameStarted = true;
      }

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       *
       *                                  update()
       *
       * Called on every frame, this is responsible for the actual interactions with
       * the game. In this case this function listens for players to click on the
       * blocks. When it detects input, it triggers the block update and chain search
       * function. These generate
       *
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

   }, {
      key: 'update',
      value: function update() {}

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       *
       *                                 Support Functions
       *
       * These are responsible for segmenting and organizing the game logic into
       * more manageable chunks.
       *
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

   }, {
      key: 'initBlocks',
      value: function initBlocks() {
         var _this3 = this;

         /* * * * * * * * * * *
          *  Color Reference  *
          * * * * * * * * * * *
            Blue    #5f8ffd
            Orange  #fcca60
            Green   #69fe5e
            Red     #ff5c5c
            Purple  #d560fc
            Yellow  #f7fc60
         */
         var blockSize = this.level.getBlockSize();
         var gridSize = this.level.getGridSize();
         var blockScale = this.level.getBlockScale();

         this.blocks = this.game.add.group();

         for (var row = 0; row < gridSize; row++) {
            var _loop = function _loop(col) {

               var blockX = col * (blockSize + _this3.PADDING);
               var blockY = row * (blockSize + _this3.PADDING);

               var newBlock = _this3.game.add.sprite(blockX, blockY, 'blocks');
               newBlock.alpha = 0;

               // Fades in block randomly when added
               var fadeRandom = 1200 * Math.random() + 400;
               setTimeout(function () {
                  _this3.game.add.tween(newBlock).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                  var newRandPos = Math.floor(Math.random() * 6);
                  newBlock.frame = newRandPos;

                  // Will be level.getBlockSize / newBlock.width
                  newBlock.scale.setTo(blockScale, blockScale);

                  // Allows the block to listen to events
                  newBlock.inputEnabled = true;
                  newBlock.events.onInputDown.add(_this3.blockDown, _this3);
                  _this3.blocks.add(newBlock);
               }, fadeRandom);
            };

            for (var col = 0; col < gridSize; col++) {
               _loop(col);
            }
         }
      }
   }, {
      key: 'checkColorChain',
      value: function checkColorChain(sprite) {
         var _this4 = this;

         // Find all blocks that share the same color and store them as child nodes
         // store the parent node when it has same position
         var allSameColors = [];

         this.blocks.forEach(function (block) {
            if (sprite.frame === block.frame) {
               allSameColors.push(new _colorTree.ColorNodeContainer(block));
            }
         });

         /* 
          * Create the color tree, and add the source sprite from the click
          * as the root node. Then add it to the search queue to begin populating
          * the color chain tree.
          */
         var colorChainTree = new _colorTree.ColorTree();
         colorChainTree.root = new _colorTree.ColorNode(sprite);
         var searchQueue = [colorChainTree.root];

         /*
          * Represents the difference a block needs to be in order to have
          * a valid place in the chain. This could be delta left, right, up
          * or down.
          */
         var delta = this.level.getBlockSize() + this.PADDING;

         // Executes until there are no longer nodes to check and add
         while (searchQueue.length) {

            var node = searchQueue.shift();
            var toAdd = false;

            for (var i = 0; i < allSameColors.length; i++) {

               /*
                * This statement first checks if the node has already been matched
                * to ensure no duplicate nodes are added.
                *
                * This statement checks each node by first checking for horizontal
                * positioning. If adding the delta and keeping the y value the same
                * evaluates true, then the node is not diagonal and in the proper
                * position.
                *
                * It repeats this logic for all of the color tiles around the current
                * source tile.
                */

               if (!allSameColors[i].matched) {

                  // Right Tile Check
                  if (node.data.x + delta == allSameColors[i].tile.x && node.data.y == allSameColors[i].tile.y) {
                     toAdd = true;
                  }

                  // Left Tile Check
                  else if (node.data.x - delta == allSameColors[i].tile.x && node.data.y == allSameColors[i].tile.y) {
                        toAdd = true;
                     }

                     // Up Tile Check
                     else if (node.data.y - delta == allSameColors[i].tile.y && node.data.x == allSameColors[i].tile.x) {
                           toAdd = true;
                        }

                        // Down Tile Check
                        else if (node.data.y + delta == allSameColors[i].tile.y && node.data.x == allSameColors[i].tile.x) {
                              toAdd = true;
                           }

                  // Final check ensures the tile is to be added and that it already hasn't been scored
                  // (faded when scored so alpha will be 0)

                  if (toAdd && allSameColors[i].tile.alpha !== 0) {
                     allSameColors[i].matched = true;

                     var newConnect = new _colorTree.ColorNode(allSameColors[i].tile);
                     node.children.push(newConnect);
                     searchQueue.push(newConnect);
                     colorChainTree.nodeCount++;

                     toAdd = false;
                  }
               }
            } // End of for loop
         } // End of color tree population

         if (colorChainTree.nodeCount > 2) {
            // Traverses the tree, fades out linked elements, and sets the input so they can
            // no longer be accessed
            colorChainTree.traverseBFS(function (node) {
               // For flashing blocks
               _this4.game.add.tween(node.data).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
               node.data.inputEnabled = false;
            });

            /*
             * Chain modifier multiplies the points as the chains gets larger. This encourages
             * larger chains to be found in order to complete the levels
             */
            var chainModifier = Math.ceil(colorChainTree.nodeCount / 3);
            var modifiedScore = chainModifier * colorChainTree.nodeCount;
            console.log("Chain modifier is " + chainModifier);

            this.score += modifiedScore;
            this.pointsLeft -= modifiedScore;

            if (this.pointsLeft < 1) {
               // trigger next level by increasing
               this.currentLevel++;
               $('#progress-bar-done').animate({ width: '100%' });
               $('#progress-bar-done').animate({ width: '0%' });
               $('#update-level').html(this.currentLevel);

               // Fade out each block individually
               this.blocks.forEach(function (block) {
                  var fadeRandom = 1200 * Math.random() + 400;
                  setTimeout(function () {
                     _this4.game.add.tween(block).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                  }, fadeRandom);
               });

               // The longest block fadeout is 1600ms
               setTimeout(function () {
                  _this4.levelText.destroy();
                  _this4.create();
               }, 2000);
            } else {
               $("#update-points").html(this.score);
               $("#update-points-left").html(modifiedScore);
               this.gainExp();
            }
         }
      }
   }, {
      key: 'gainExp',
      value: function gainExp() {
         var progressWidth = Math.floor(100 * ((this.level.getPoints() - this.pointsLeft) / this.level.getPoints())) + '%';
         $('#progress-bar-done').animate({
            width: progressWidth
         });
      }
   }, {
      key: 'blockDown',
      value: function blockDown(sprite) {
         var _this5 = this;

         if (this.movesLeft > 1) {

            // Rotate the sprite frame
            sprite.frame = (sprite.frame + 1) % 6;
            this.movesLeft--;
            $("#update-moves-left").html(this.movesLeft);

            // Take the current sprite which holds information
            // about position and color and use to check proximity
            this.checkColorChain(sprite);
         } else {
            // Restart Game
            this.score = 0;
            this.currentLevel = 1;
            this.pointsLeft = this.level.getPoints();
            this.movesLeft = this.level.getMoves();
            $('#progress-bar-done').animate({ width: '0%' });

            // Fade out each block individually
            this.blocks.forEach(function (block) {
               var fadeRandom = 1200 * Math.random() + 400;
               setTimeout(function () {
                  _this5.game.add.tween(block).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
               }, fadeRandom);
            });

            this.endTextStyle = {
               font: 'Fjalla One',
               fontSize: 80,
               fill: '#333',
               align: 'center'
            };

            this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', this.endTextStyle);
            this.endText.anchor.setTo(0.5, 0.5);
            this.endText.alpha = 0;
            this.game.add.tween(this.endText).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);

            // Show the level intro text, as well as the start button
            setTimeout(function () {
               _this5.game.add.tween(_this5.endText).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            }, 2000);

            // The longest block fadeout is 1600ms
            setTimeout(function () {
               _this5.endText.destroy();
               _this5.create();
            }, 2500);
         }
      }
   }]);

   return GridGrind;
}(Phaser.State);

exports.default = GridGrind;

},{"./colorTree.js":1,"./game.js":2,"./levels.js":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *                              []     [][][] []  [] [][][] []     [][][]
 *  Author: Alex Dodge          []     []     []  [] []     []     []
 *  Date: April 17, 2017        []     [][]   []  [] [][]   []     [][][]
 *  License: MIT                []     []      [][]  []     []         []
 *                              [][][] [][][]   []   [][][] [][][] [][][]
 *
 *  The levels object accepts the current level and game size. It then generates 
 *  all of the properties pertaining to that level. They can be retrieved through 
 *  the following get methods. By dynamically generating levels, each individual
 *  does not have to be constructed, and instead levels will have properties
 *  and attributes extending the levels infinitely if required.
 *
 *  ** NOTE **
 *  This level generation does assume a static block padding size of 5 which is
 *  specified as a constant in the initial game file.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Level = exports.Level = function () {

  /* Constructor */
  function Level(currentLevel, gameSize, spriteSize) {
    _classCallCheck(this, Level);

    this.currentLevel = currentLevel;
    this.gameSize = gameSize;
    this.spriteSize = spriteSize;
  }

  /*
   * getGridSize
   *
   * Retrieves the grid size for the level. The first level is a 3x3 and it increases
   * by perfect squares each level, with some levels increasing only point value. The
   * pattern for generation will change depending on how quickly the levels can be played.
   */


  _createClass(Level, [{
    key: "getGridSize",
    value: function getGridSize() {
      if (this.currentLevel < 1) {
        return -1; // Indicates level error
      } else {
        return this.currentLevel + 2; // If level 1, 3 blocks per row, 3 columns
      }
    }

    /*
     * getMoves
     *
     * Returns the number of moves available to the player
     */

  }, {
    key: "getMoves",
    value: function getMoves() {
      if (this.currentLevel < 1) {
        return -1; // Indicates level error
      } else {
        return this.currentLevel * 2 + 5; // Increase by 2, start at 6
      }
    }

    /*
     * getMoves
     *
     * Returns the number of points to complete the leve
     */

  }, {
    key: "getPoints",
    value: function getPoints() {
      if (this.currentLevel < 1) {
        return -1; // Indicates level error
      } else {
        // Increase by square, start at 4
        return this.currentLevel * this.currentLevel + 3 * this.currentLevel;
      }
    }

    /*
     * getBlockSize
     *
     * Returns the side length of the block for the current level size.
     * First divides the game size into chunks according to the grid size
     * then the padding is subtracted from each to account for it in the drawing
     * function.
     */

  }, {
    key: "getBlockSize",
    value: function getBlockSize() {
      var size = Math.floor(this.gameSize / this.getGridSize() - 5);

      if (size < 0) {
        return -1; // indicates error
      } else {
        return size;
      }
    }

    /*
     * getBlockScale
     *
     * The source image for the spritesheet determines the physical pizel size
     * of the blocks. This function determines what scale factor is needed for
     * the size of the game. Will change dynamically depending of game size, even
     * when scaled.
     */

  }, {
    key: "getBlockScale",
    value: function getBlockScale() {
      var scale = this.getBlockSize() / this.spriteSize;
      return scale;
    }
  }]);

  return Level;
}();

},{}]},{},[2])
//# sourceMappingURL=mainGame.js.map
