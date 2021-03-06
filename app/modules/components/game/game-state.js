/* eslint no-param-reassign: ["error", { "props": false }] */
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
import Level from './services/levels';
import { ColorNode, ColorTree, ColorNodeContainer } from './services/colorTree';

export default class GridGrind extends Phaser.State {

  constructor() {
    super();
    this.PADDING = 5;
    this.blocks = null;
    this.level = null;
    this.currentLevel = 1;
    this.currentPoints = 0;
    this.movesLeft = 4;
    this.pointsLeft = 5;
    this.pointsRequired = null;
    this.playerName = 'Alex';
    this.score = 0;
    this.gameStarted = false;
    this.loadingScreen = null;

    // Text variables
    this.levelText = null;
    this.levelTextStyle = null;
    this.endText = null;
    this.endTextStyle = null;
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
  preload() {
    this.game.stage.backgroundColor = '#eeeeee';
    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.game.load.spritesheet('blocks', '/assets/images/hr-blocks.png', 100, 100);
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
  create() {
    // Cleans out all previous objects
    this.game.world.removeAll(true);

    // Create a reference sprite to be passed into the current level
    const referenceSprite = this.game.add.sprite(0, 0, 'blocks');
    referenceSprite.visible = false;

    // Generate level object based on difficulty
    this.level = new Level(this.currentLevel, this.game.width, referenceSprite.width);

    // Setup level text indicator
    this.levelTextStyle = {
      font: 'Fjalla One',
      fontSize: 80,
      fill: '#333',
      align: 'center',
    };
    this.levelText = this.game.add.text(
      Math.round(this.game.world.centerX),
      Math.round(this.game.world.centerY),
      `Level ${this.currentLevel}`,
      this.levelTextStyle,
    );
    this.levelText.anchor.setTo(0.5, 0.5);
    this.levelText.alpha = 0;
    this.game.add.tween(this.levelText).to({
      alpha: 1,
    }, 300, Phaser.Easing.Linear.None, true);

    // Show the level intro text, as well as the start button
    setTimeout(() => {
      this.game.add.tween(this.levelText).to({
        alpha: 0,
      }, 300, Phaser.Easing.Linear.None, true);
      // Draws the block objects on the screen for each frame
      // Draws from a randomized array of the original sprite colours
      this.initBlocks();
    }, 1000);

    // To add text elements to the game
    this.currentPoints = 0;
    this.pointsRequired = this.level.getPoints();
    this.pointsLeft = this.pointsRequired;
    this.movesLeft = this.level.getMoves();
    $('#update-points').html(this.score);
    $('#update-moves-left').html(this.movesLeft);
    $('#player-name').html(this.playerName);
    $('#update-points-total').html(this.pointsLeft);
    $('#update-points-left').html('0');
    $('#update-level').html(this.currentLevel);

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
  static update() {}

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   *                                 Support Functions
   *
   * These are responsible for segmenting and organizing the game logic into
   * more manageable chunks.
   *
   * Colours
   * Blue #5f8ffd, Orange #fcca60, Green #69fe5e, Red #ff5c5c, Purple #d560fc
   * Yellow #f7fc60
   *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  initBlocks() {
    const blockSize = this.level.getBlockSize();
    const gridSize = this.level.getGridSize();
    const blockScale = this.level.getBlockScale();

    this.blocks = this.game.add.group();

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const blockX = (col * (blockSize + this.PADDING));
        const blockY = (row * (blockSize + this.PADDING));

        const newBlock = this.game.add.sprite(blockX, blockY, 'blocks');
        newBlock.alpha = 0;

        // Fades in block randomly when added
        const fadeRandom = (1200 * Math.random()) + 400;
        setTimeout(() => {
          this.game.add.tween(newBlock).to({
            alpha: 1,
          }, 400, Phaser.Easing.Linear.None, true);
          const newRandPos = Math.floor(Math.random() * 6);
          newBlock.frame = newRandPos;

          // Will be level.getBlockSize / newBlock.width
          newBlock.scale.setTo(blockScale, blockScale);

          // Allows the block to listen to events
          newBlock.inputEnabled = true;
          newBlock.events.onInputDown.add(this.blockDown, this);
          this.blocks.add(newBlock);
        }, fadeRandom);
      }
    }
  }

  checkColorChain(sprite) {
    // Find all blocks that share the same color and store them as child nodes
    // store the parent node when it has same position
    const allSameColors = [];

    this.blocks.forEach((block) => {
      if (sprite.frame === block.frame) {
        allSameColors.push(new ColorNodeContainer(block));
      }
    });


    /*
     * Create the color tree, and add the source sprite from the click
     * as the root node. Then add it to the search queue to begin populating
     * the color chain tree.
     */
    const colorChainTree = new ColorTree();
    colorChainTree.root = new ColorNode(sprite);
    const searchQueue = [colorChainTree.root];

    /*
     * Represents the difference a block needs to be in order to have
     * a valid place in the chain. This could be delta left, right, up
     * or down.
     */
    const delta = this.level.getBlockSize() + this.PADDING;


    // Executes until there are no longer nodes to check and add
    while (searchQueue.length) {
      const node = searchQueue.shift();
      let toAdd = false;

      for (let i = 0; i < allSameColors.length; i += 1) {
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
          const rightCheck = (node.data.x + delta === allSameColors[i].tile.x);
          const leftCheck = (node.data.x - delta === allSameColors[i].tile.x);
          const upCheck = (node.data.y - delta === allSameColors[i].tile.y);
          const downCheck = (node.data.y + delta === allSameColors[i].tile.y);

          // Check tiles in each direction for matching chain
          if (rightCheck && node.data.y === allSameColors[i].tile.y) {
            toAdd = true;
          } else if (leftCheck && node.data.y === allSameColors[i].tile.y) {
            toAdd = true;
          } else if (upCheck && node.data.x === allSameColors[i].tile.x) {
            toAdd = true;
          } else if (downCheck && node.data.x === allSameColors[i].tile.x) {
            toAdd = true;
          }

          // Final check ensures the tile is to be added and that it already hasn't been scored
          // (faded when scored so alpha will be 0)

          if (toAdd && allSameColors[i].tile.alpha !== 0) {
            allSameColors[i].matched = true;

            const newConnect = new ColorNode(allSameColors[i].tile);
            node.children.push(newConnect);
            searchQueue.push(newConnect);
            colorChainTree.nodeCount += 1;

            toAdd = false;
          }
        }
      } // End of for loop
    } // End of color tree population

    if (colorChainTree.nodeCount > 2) {
      // Traverses the tree, fades out linked elements, and sets the input so they can
      // no longer be accessed
      colorChainTree.traverseBFS((node) => {
        // For flashing blocks
        this.game.add.tween(node.data).to({
          alpha: 0,
        }, 400, Phaser.Easing.Linear.None, true);
        node.data.inputEnabled = false;
      });

      /*
       * Chain modifier multiplies the points as the chains gets larger. This encourages
       * larger chains to be found in order to complete the levels
       */
      const chainModifier = Math.ceil(colorChainTree.nodeCount / 3);
      const modifiedScore = chainModifier * colorChainTree.nodeCount;

      this.score += modifiedScore;
      this.currentPoints += modifiedScore;
      this.pointsLeft -= modifiedScore;
      if (this.currentPoints >= this.pointsRequired) {
        this.currentPoints = this.pointsRequired;
      }

      if (this.pointsLeft < 1) {
        // trigger next level by increasing
        this.currentLevel += 1;
        $('#progress-bar-done').animate({
          width: '100%',
        });
        $('#progress-bar-done').delay(800).animate({
          width: '0%',
        });

        // Fade out each block individually
        this.blocks.forEach((block) => {
          const fadeRandom = (1200 * Math.random()) + 400;
          setTimeout(() => {
            this.game.add.tween(block).to({
              alpha: 0,
            }, 400, Phaser.Easing.Linear.None, true);
          }, fadeRandom);
        });

        // The longest block fadeout is 1600ms
        setTimeout(() => {
          this.levelText.destroy();
          this.create();
        }, 2000);
      } else {
        $('#update-points').html(this.score);
        $('#update-points-left').html(this.currentPoints);
        this.gainExp();
      }
    }
  }

  gainExp() {
    const progressPoints = this.level.getPoints() - this.pointsLeft;
    const progressWidth = Math.floor(100 * ((progressPoints) / this.level.getPoints()));
    $('#progress-bar-done').animate({
      width: `${progressWidth}%`,
    });
  }

  blockDown(sprite) {
    if (this.movesLeft > 1) {
      // Rotate the sprite frame
      sprite.frame = (sprite.frame + 1) % 6;
      this.movesLeft -= 1;
      $('#update-moves-left').html(this.movesLeft);

      // Take the current sprite which holds information
      // about position and color and use to check proximity
      this.checkColorChain(sprite);
    } else {
      // Restart Game
      this.score = 0;
      this.currentLevel = 1;
      this.pointsLeft = this.level.getPoints();
      this.movesLeft = this.level.getMoves();
      $('#progress-bar-done').animate({
        width: '0%',
      });

      // Fade out each block individually
      this.blocks.forEach((block) => {
        const fadeRandom = (1200 * Math.random()) + 400;
        setTimeout(() => {
          this.game.add.tween(block).to({
            alpha: 0,
          }, 400, Phaser.Easing.Linear.None, true);
        }, fadeRandom);
      });

      this.endTextStyle = {
        font: 'Fjalla One',
        fontSize: 80,
        fill: '#333',
        align: 'center',
      };

      this.endText = this.game.add.text(
        this.game.world.centerX,
        this.game.world.centerY,
        'Game Over',
        this.endTextStyle,
      );
      this.endText.anchor.setTo(0.5, 0.5);
      this.endText.alpha = 0;
      this.game.add.tween(this.endText).to({
        alpha: 1,
      }, 300, Phaser.Easing.Linear.None, true);

      // Show the level intro text, as well as the start button
      setTimeout(() => {
        this.game.add.tween(this.endText).to({
          alpha: 0,
        }, 300, Phaser.Easing.Linear.None, true);
      }, 2000);

      // The longest block fadeout is 1600ms
      setTimeout(() => {
        this.endText.destroy();
        this.create();
      }, 2500);
    }
  }

}
