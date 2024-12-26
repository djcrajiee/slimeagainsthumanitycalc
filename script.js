// Generate Ooze Tokens Button Logic
document.getElementById("generateTokens").addEventListener("click", () => {
  // Get user inputs
  const slimeCards = parseInt(document.getElementById("slimeCards").value) || 0; // Number of Slime cards in graveyard/exile
  const tokenDoublers = parseInt(document.getElementById("tokenDoublers").value) || 0; // Number of Token Doublers
  const counterDoublers = parseInt(document.getElementById("counterDoublers").value) || 0; // Number of +1/+1 Counter Doublers

  // Base power/toughness of the first Ooze token
  let baseCounters = 2; // Always starts as a 2/2 Ooze
  if (slimeCards > 0) {
    baseCounters += slimeCards; // Add +1/+1 counters for each Slime Against Humanity already in graveyard/exile
  }

  // Apply +1/+1 Counter Doublers
  if (counterDoublers > 0) {
    baseCounters *= Math.pow(2, counterDoublers);
  }

  // Calculate the number of tokens generated
  let totalTokens = 1; // Always starts with 1 token
  if (tokenDoublers > 0) {
    totalTokens *= Math.pow(2, tokenDoublers); // Apply token doublers
  }

  // Update the slimeCards field to account for the card being cast
  document.getElementById("slimeCards").value = slimeCards + 1; // Increment Slime cards by 1

  // Clear previous tokens
  const tokenContainer = document.getElementById("tokens");
  tokenContainer.innerHTML = "";

  // Generate tokens and display them
  for (let i = 0; i < totalTokens; i++) {
    const tokenDiv = document.createElement("div");
    tokenDiv.className = "token-wrapper";
    tokenDiv.innerHTML = `
      <div class="token">
        <img src="ooze_token.jpg" alt="Ooze Token" class="token-image">
        <div class="power-toughness">${baseCounters}/${baseCounters}</div>
      </div>
      <button class="remove-btn" onclick="removeToken(this)">Remove</button>
    `;
    tokenContainer.appendChild(tokenDiv);
  }
});

// Move Tokens to Playing Field
document.getElementById("moveToField").addEventListener("click", () => {
  const tokens = document.querySelectorAll("#tokens .token-wrapper");
  const playingField = document.getElementById("playingField");

  // Remove "No tokens on the playing field" text
  if (document.querySelector("#playingField p")) {
    document.querySelector("#playingField p").remove();
  }

  tokens.forEach((tokenWrapper) => {
    const powerToughness = tokenWrapper.querySelector(".power-toughness").textContent;
    const quantity = 1; // Each generated token is treated as a single instance

    addToPlayingField("Ooze", quantity, powerToughness);
    tokenWrapper.remove();
  });

  updatePlayingFieldIndicator();
});

// Add Tokens to the Playing Field
function addToPlayingField(type, quantity, powerToughness) {
  const playingField = document.getElementById("playingField");

  const existingStack = Array.from(playingField.children).find(
    (child) => child.dataset.type === type && child.dataset.powerToughness === powerToughness
  );

  if (existingStack) {
    let existingQuantity = parseInt(existingStack.dataset.quantity);
    existingQuantity += quantity;
    existingStack.dataset.quantity = existingQuantity;
    existingStack.querySelector(".quantity-indicator").textContent = `x${existingQuantity}`;
  } else {
    const tokenDiv = document.createElement("div");
    tokenDiv.className = "token-wrapper";
    tokenDiv.dataset.type = type;
    tokenDiv.dataset.quantity = quantity;
    tokenDiv.dataset.powerToughness = powerToughness;
    tokenDiv.innerHTML = `
      <div class="token">
        <img src="ooze_token.jpg" alt="Ooze Token" class="token-image">
        <span class="quantity-indicator">x${quantity}</span>
        <div class="power-toughness">${powerToughness}</div>
      </div>
      <button class="remove-btn" onclick="removeFromPlayingField(this)">Remove</button>
    `;
    playingField.appendChild(tokenDiv);
  }

  // Update the playing field indicator
  updatePlayingFieldIndicator();
}

// Remove Token Stack from Playing Field
function removeFromPlayingField(button) {
  const tokenWrapper = button.parentElement;
  const quantity = parseInt(tokenWrapper.dataset.quantity);

  if (quantity > 1) {
    // Decrease the quantity
    const newQuantity = quantity - 1;
    tokenWrapper.dataset.quantity = newQuantity;
    tokenWrapper.querySelector(".quantity-indicator").textContent = `x${newQuantity}`;
  } else {
    // Remove the entire stack if the quantity is 1
    tokenWrapper.remove();
  }

  // Update the playing field indicator
  updatePlayingFieldIndicator();
}

// Remove Token Logic for Generated Tokens
function removeToken(button) {
  const tokenWrapper = button.parentElement;
  tokenWrapper.remove();
}

// Update Playing Field Indicator
function updatePlayingFieldIndicator() {
  const oozeTokens = document.querySelectorAll("#playingField .token-wrapper");

  let totalOozeCount = Array.from(oozeTokens).reduce(
    (sum, token) => sum + parseInt(token.dataset.quantity),
    0
  );

  const indicator = document.getElementById("playingFieldIndicator");
  if (totalOozeCount > 0) {
    indicator.textContent = `Total Ooze Tokens: ${totalOozeCount}`;
  } else {
    indicator.textContent = `No tokens on the playing field.`;
  }
}
