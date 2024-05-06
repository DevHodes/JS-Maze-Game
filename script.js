document.addEventListener("DOMContentLoaded", function () {
  const rulesContainer = document.getElementById("rules-container");
  const startGameButton = document.getElementById("start-game");
  const gameContainer = document.getElementById("game-container");

  // Add event listener to start game button
  startGameButton.addEventListener("click", function () {
    rulesContainer.style.display = "none";
    gameContainer.style.display = "block";
    startGame();
  });
  // Get references to the HTML elements
  const mazeContainer = document.getElementById("maze-container");
  const retryButton = document.getElementById("retry");
  const scoreDisplay = document.getElementById("score");
  const errorMessage = document.querySelector(".error-message");
  const arrowButtons = document.querySelectorAll(".arrow-button");

  // Define the maze properties
  const gridWidth = 10;
  const gridHeight = 6;
  const totalBlocks = gridWidth * gridHeight;
  const startBlockIndex = 0;
  const endBlockIndex = totalBlocks - 1;
  const unavailableBlockIndices = [
    // Define the indices of unavailable blocks
    4, 6, 7, 12, 18, 24, 26, 32, 34, 35, 36, 37, 38, 44, 46, 52, 54, 56, 64, 66,
    72, 76, 82,
  ];

  // Define variables to track the game state
  let currentBlockIndex = startBlockIndex;
  let moves = 0;
  let visitedBlocks = [];

  // Function to create the initial maze grid
  function createGrid() {
    // Clear the maze container
    mazeContainer.innerHTML = "";

    // Iterate (repeat) over each block in the grid
    for (let i = 0; i < totalBlocks; i++) {
      // Create a block element
      const block = document.createElement("div");
      block.classList.add("block");

      // Check if the block is unavailable
      if (unavailableBlockIndices.includes(i)) {
        block.classList.add("unavailable");
      }
      // Check if the block is the start or end block
      if (i === startBlockIndex) {
        block.classList.add("start");
      } else if (i === endBlockIndex) {
        block.classList.add("end");
      }

      // Append (add) the block to the maze container
      mazeContainer.appendChild(block);
    }
  }

  // Function to update the classes of each block based on the game state
  function updateBlockClasses() {
    const blocks = mazeContainer.getElementsByClassName("block");

    // Iterate (repeat) over each block
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      block.classList.remove("current", "visited", "win");

      // Check if the block is the current block
      if (i === currentBlockIndex) {
        block.classList.add("current");
      }
      // Check if the block has been visited
      else if (visitedBlocks.includes(i)) {
        block.classList.add("visited");
      }
    }

    // Check if the end block has been visited
    const endBlock = blocks[endBlockIndex];
    // Check if game won
    if (visitedBlocks.includes(endBlockIndex)) {
      endBlock.classList.add("win");
      displayMessage("Congratulations! You won!", true);
      retryButton.textContent = "Play Again";
      retryButton.style.display = "block";
      disableButtons();
    }
  }

  // Function to update the score display
  function updateScoreDisplay() {
    const availableMoves = 41; // Update the number of available moves
    scoreDisplay.textContent = `Moves: ${moves}/${availableMoves}`; // Update the score display
  }

  // Function to handle the movement based on the direction
  function handleMovement(direction) {
    // Reset the error message
    resetErrorMessage();

    // Check if the movement is valid
    const isValidMove = checkValidMove(direction);
    if (isValidMove) {
      // Calculate the new block index and update the game state
      const newBlockIndex = calculateNewBlockIndex(direction);
      currentBlockIndex = newBlockIndex;
      visitedBlocks.push(currentBlockIndex);
      moves++;

      // Update the block classes, score display, and check win condition
      updateBlockClasses();
      updateScoreDisplay();
    } else {
      // Display error message for invalid move
      displayMessage("Invalid move. Try again.");
    }

    // Check if the player is stuck
    if (isPlayerStuck()) {
      displayMessage("Looks like you're stuck. Play Again?");
      retryButton.textContent = "Play Again";
      retryButton.style.display = "block";
      disableButtons();
    }
  }

  // Function to check if the movement is valid
  function checkValidMove(direction) {
    // Calculate the target block index
    const targetBlockIndex = calculateNewBlockIndex(direction);

    // Get the target block element
    const targetBlock =
      mazeContainer.getElementsByClassName("block")[targetBlockIndex];

    // Check if the target block exists and is available
    if (targetBlock && !targetBlock.classList.contains("unavailable")) {
      // Check if the target block has been visited
      if (!visitedBlocks.includes(targetBlockIndex)) {
        return true;
      }
    }
    return false;
  }

  // Function to calculate the new block index based on the direction
  function calculateNewBlockIndex(direction) {
    let newBlockIndex = currentBlockIndex;

    // Calculate the new block index based on the direction
    switch (direction) {
      // Up
      case "up":
        if (currentBlockIndex - gridWidth >= 0) {
          newBlockIndex -= gridWidth;
        }
        break;
      // Down
      case "down":
        if (currentBlockIndex + gridWidth < totalBlocks) {
          newBlockIndex += gridWidth;
        }
        break;
      // Left
      case "left":
        if (currentBlockIndex % gridWidth !== 0) {
          newBlockIndex -= 1;
        }
        break;
      // Right
      case "right":
        if ((currentBlockIndex + 1) % gridWidth !== 0) {
          newBlockIndex += 1;
        }
        break;
    }

    return newBlockIndex;
  }

  // Function to display a message
  function displayMessage(message, isSuccess = false) {
    errorMessage.textContent = message;
    errorMessage.classList.toggle("success", isSuccess);
    errorMessage.style.display = "block";
  }

  // Update the displayMessage function to change the color of the error message
  function displayMessage(message, isSuccess = false) {
    errorMessage.textContent = message;

    // Set the color of the error message based on the isSuccess parameter
    errorMessage.style.color = isSuccess ? "green" : "red";
    errorMessage.style.display = "block";
  }

  // Function to reset the error message
  function resetErrorMessage() {
    errorMessage.style.display = "none";
  }

  // Function to reset the game
  function resetGame() {
    // Reset the game state
    currentBlockIndex = startBlockIndex;
    moves = 0;
    visitedBlocks = [];

    // Update the block classes, score display, and hide error/retry messages
    updateBlockClasses();
    updateScoreDisplay();
    errorMessage.style.display = "none";
    retryButton.style.display = "none";

    // Enable arrow buttons
    enableButtons();
  }

  // Function to check if the player is stuck
  function isPlayerStuck() {
    const directions = ["up", "down", "left", "right"];

    // Check each direction for a valid move
    for (const direction of directions) {
      if (checkValidMove(direction)) {
        return false;
      }
    }
    return true;
  }

  // Function to disable arrow buttons
  function disableButtons() {
    arrowButtons.forEach((button) => {
      button.disabled = true;
    });
  }

  // Function to enable arrow buttons
  function enableButtons() {
    arrowButtons.forEach((button) => {
      button.disabled = false;
    });
  }

  // Add event listeners to arrow buttons
  arrowButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      // Reset the error message
      resetErrorMessage();

      const direction = event.target.dataset.direction;
      handleMovement(direction);
    });
  });

  // Add event listener to retry button
  retryButton.addEventListener("click", resetGame);

  // Create the initial maze grid
  createGrid();

  // Update the initial block classes
  updateBlockClasses();

  // Update the initial score display
  updateScoreDisplay();
});
