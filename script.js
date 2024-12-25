document.getElementById("generateTokens").addEventListener("click", () => {
    // Parse user inputs
    let slimeCards = parseInt(document.getElementById("slimeCards").value) || 0;
    const tokenDoublers = parseInt(document.getElementById("tokenDoublers").value) || 0;
    const counterDoublers = parseInt(document.getElementById("counterDoublers").value) || 0;
  
    // Increment the slimeCards value since one more Slime Against Humanity is going to the graveyard
    slimeCards += 1;
    document.getElementById("slimeCards").value = slimeCards; // Update the input field value
  
    // Calculate the number of tokens and their power/toughness
    let baseTokens = 1; // Always start with 1 token
    if (tokenDoublers > 0) {
      baseTokens *= Math.pow(2, tokenDoublers); // Apply token doublers
    }
    let baseCounters = 2 + slimeCards; // Start at 2 +1/+1 counters and add counters from exile
    if (counterDoublers > 0) {
      baseCounters *= Math.pow(2, counterDoublers); // Apply counter doublers
    }
  
    // Clear previous tokens
    const tokenContainer = document.getElementById("tokens");
    tokenContainer.innerHTML = "";
  
    // Generate tokens and display them
    for (let i = 0; i < baseTokens; i++) {
      const tokenDiv = document.createElement("div");
      tokenDiv.className = "token-wrapper";
      tokenDiv.innerHTML = `
        <div class="token">
          <div>${baseCounters}/${baseCounters}</div> <!-- Power/Toughness -->
        </div>
        <button class="remove-btn" onclick="removeToken(this)">Remove</button>
      `;
      tokenContainer.appendChild(tokenDiv);
    }
  });
  
  // Function to remove a token from the board
  function removeToken(button) {
    const tokenWrapper = button.parentElement;
    tokenWrapper.remove();
  }
  
  // Move All Tokens to Playing Field
  document.getElementById("moveToField").addEventListener("click", () => {
    const tokens = document.querySelectorAll("#tokens .token-wrapper"); // Select all token-wrapper elements
    const playingField = document.getElementById("playingField");
  
    // If no tokens exist, show an alert
    if (tokens.length === 0) {
      alert("No tokens to move to the playing field!");
      return;
    }
  
    // Clear the "No tokens" message if present
    if (playingField.querySelector("p")) {
      playingField.innerHTML = "";
    }
  
    // Move each token to the Playing Field
    tokens.forEach((tokenWrapper) => {
      const newTokenWrapper = tokenWrapper.cloneNode(true); // Clone the entire token-wrapper
      newTokenWrapper.querySelector(".remove-btn").onclick = function () {
        removeToken(this); // Ensure the remove functionality works in the Playing Field
      };
      playingField.appendChild(newTokenWrapper); // Add the token to the Playing Field
      tokenWrapper.remove(); // Remove the token from the Generated Tokens section
    });
  });
  