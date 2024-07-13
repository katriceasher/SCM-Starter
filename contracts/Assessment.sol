// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CharityDonation {
    // State variables
    address payable public contractOwner;  
     // Address of the contract owner (who deployed the contract)
    uint256 public totalContribution;      
     // Total amount of contributions received
    uint256 public contributionGoal;       
     // Goal amount that contributors are aiming to reach

    // Events
    event ContributionReceived(address indexed contributor, uint256 amount); 
    // Event emitted when a contribution is received
    event FundsExtracted(uint256 amount);   
    // Event emitted when funds are withdrawn by the contract owner
    event GoalDefined(uint256 goalAmount);  
    // Event emitted when the contribution goal is defined

    // Constructor - executed once upon contract deployment
    constructor() {
        contractOwner = payable(msg.sender); 
        // Set the contract owner to the address deploying the contract
    }

    // Function to define the contribution goal
    function defineGoal(uint256 _goalAmount) external {
        require(msg.sender == contractOwner, "Only the owner can set the goal."); 
        // Only the owner can define the goal
        require(_goalAmount > 0, "Goal amount must be greater than zero."); 
        // Goal amount must be positive

        contributionGoal = _goalAmount; 
        // Set the contribution goal

        emit GoalDefined(_goalAmount); 
        // Emit an event indicating the goal has been defined
    }



    // Function for contributors to send ETH and contribute
    function contribute() external payable {
        require(msg.value > 0, "Contribution must be greater than zero."); 
        // Contribution must be positive

        totalContribution += msg.value;
        // Increase the total contribution amount

        emit ContributionReceived(msg.sender, msg.value); 
        // Emit an event indicating a contribution has been received
    }

    // Function for the contract owner to withdraw funds
    function extractFunds() external {
        require(msg.sender == contractOwner, "Only the owner can withdraw funds.");
         // Only the owner can withdraw funds
        require(totalContribution > 0, "No funds available for withdrawal.");
         // Ensure there are funds to withdraw

        uint256 amount = totalContribution; 
        // Store the total contribution amount
        totalContribution = 0; 
        // Reset the total contribution amount to zero

        (bool success, ) = contractOwner.call{value: amount}(""); 
        // Transfer the funds to the contract owner
        require(success, "Withdrawal failed."); 
        // Ensure the transfer was successful

        emit FundsExtracted(amount); 
        // Emit an event indicating funds have been withdrawn
    }
}
