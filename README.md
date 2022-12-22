# GA-minesweeper

## Technologies Used
This game is built purely using HTML, CSS and Javascript. 

## Game Logic
### Game Setup
1. createGameArray - 
    a new game array containing bombs at randomized position is created when a new game starts. Array length is the same as the board size.
2. createBoard - 
    board size is dependent on the player’s selection of game difficulty level. Each difficulty level comes with a predefined board size. Tiles contained     in the board has the following default attributes:
    Data-status: hidden
    Data-x: x-coordinate of the tile
    Data-y: y-coordinate of the tile
    Class: normal / bomb (the createBoard function takes in the game array created in step 1 and assigned array element to each tile accordingly)
3. updateTimer - 
    timer is updated when the minesweeper game starts. If the timer is switched on, it will start counting down from the pre-allocated time for each game       level. Else, the timer will start counting up until the game ends instead.
    Bomb count is displayed at the start of the game and is decremented with every tile flagged.

### Playing The Game
1. Player can right click on any tile to reveal the tile. Game ends immediately if a tile containing a bomb is being clicked. Else, the number of bombs in the adjacent tiles is being displayed. Data-status of tile being clicked upon will be updated to “revealed” and all listening event to the tile will be disabled to prevent player from clicking on the same tile twice.
2. If the tile being clicked upon does not contain any bomb in its surrounding tiles, a recursion function will be called upon that loops through and reveals every single surrounding tile until a tile containing surrounding bombs is met.
3. Player can right-click to flag a tile and do another right-click again to unflag the flagged tile. Data-status of the flagged tile will be updated to “flagged” after. The number of flagged cells that contain the bomb class is used to check the winning of the game (i.e. if number of flagged cells containing bomb equals to the number of bomb for the board, player wins.

### Winning / Losing The Game
1. When player clicks on a tile containing a bomb, the game ends. All tiles containing the bombs will reveal themselves when the game ends.
2. When player fails to complete the game within the pre-allocated time, the game ends.
3. Player has to flag all tiles containing the bombs in order to win the game.

### Major Challenges
1. Creating an appealing front end for the game and make it interactive.
2. Understanding how to perform the recursive function on the surrounding cells.

### To Be Improved
To record each player’s best score.





