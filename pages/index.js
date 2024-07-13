import { useState, useEffect } from "react";  // Importing necessary hooks from React
import { ethers } from "ethers";  // Importing ethers library for Ethereum interactions
import CharityDonationABI from "../artifacts/contracts/Assessment.sol/CharityDonation.json";  // Importing ABI of the smart contract

export default function HomePage() {
  const [account, setAccount] = useState(null);  // State variable to store current Ethereum account
  const [contract, setContract] = useState(null);  // State variable to store instance of the smart contract
  const [balance, setBalance] = useState("0");  // State variable to store balance of contributions

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";  // Address of the deployed smart contract
  const CharityDonation_ABI = CharityDonationABI.abi;  // ABI (Application Binary Interface) of the smart contract

  useEffect(() => {
    // Function to initialize contract and account information
    const initialize = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);  // Create Web3 provider using MetaMask
          const signer = provider.getSigner();  // Get the signer (account) from the provider
          const contractInstance = new ethers.Contract(contractAddress, CharityDonation_ABI, signer);  // Create contract instance
          setContract(contractInstance);  // Set the contract instance in state
  
          const accounts = await provider.listAccounts();  // Retrieve list of accounts connected to MetaMask
          if (accounts.length > 0) {
            setAccount(accounts[0]);  // Set the first account as the current account
          }
  
          const balance = await contractInstance.totalContribution();  // Retrieve total contribution balance from the contract
          setBalance(ethers.utils.formatEther(balance));  // Format the balance to Ether and update state
        }
      } catch (error) {
        console.error("Error initializing:", error);  // Log any errors that occur during initialization
      }
    };
  
    initialize();  // Call the initialization function when component mounts
  }, []);  // Empty dependency array ensures useEffect runs only once on component mount

  // Function to connect to MetaMask wallet
  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });  // Request access to user's MetaMask accounts
      const provider = new ethers.providers.Web3Provider(window.ethereum);  // Create Web3 provider
      const accounts = await provider.listAccounts();  // Retrieve updated list of accounts
      if (accounts.length > 0) {
        setAccount(accounts[0]);  // Set the first account as the current account
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);  // Log any errors that occur during connection
    }
  };
  
  // Function to contribute ETH to the smart contract
  const contribute = async (amount) => {
    if (contract) {
      try {
        const tx = await contract.contribute({
          value: ethers.utils.parseEther(amount.toString())  // Convert amount to wei and send with the transaction
        });
        await tx.wait();  // Wait for transaction to be mined
        const newBalance = await contract.totalContribution();  // Retrieve updated total contribution balance
        setBalance(ethers.utils.formatEther(newBalance));  // Format the new balance to Ether and update state
      } catch (error) {
        console.error("Error contributing:", error);  // Log any errors that occur during contribution
      }
    }
  };

  // Function to extract funds from the smart contract (only accessible to contract owner)
  const extractFunds = async () => {
    if (contract) {
      try {
        const tx = await contract.extractFunds();  // Call the smart contract function to withdraw funds
        await tx.wait();  // Wait for transaction to be mined
        const newBalance = await contract.totalContribution();  // Retrieve updated total contribution balance
        setBalance(ethers.utils.formatEther(newBalance));  // Format the new balance to Ether and update state
      } catch (error) {
        console.error("Error extracting funds:", error);  // Log any errors that occur during fund extraction
      }
    }
  };

  // JSX rendering for the UI
  return (
    <main className="container">
      <header>
        <h1>Charity Donation</h1>
      </header>
      {!account && (
        <button className="connect-button" onClick={connectWallet}>Connect to MetaMask</button>
      )}
      {account && (
        <div className="account-info">
          <p>Your Account: {account}</p>
          <p>Total Contribution: {balance} ETH</p>
          <div className="buttons">
            <button className="contribute-button" onClick={() => contribute(1)}>Contribute 1 ETH</button>
            <button className="extract-button" onClick={extractFunds}>Extract Funds</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Times New Roman', sans-serif;
        }
        header {
          margin-bottom: 2rem;
          text-align: center;
        }
        h1 {
          font-size: 3rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .connect-button,
        .contribute-button,
        .extract-button {
          padding: 1rem 2rem;
          margin: 0.5rem;
          font-size: 1.2rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .connect-button {
          background-color: #6c63ff;
          color: #fff;
        }
        .connect-button:hover {
          background-color: #5a54d8;
        }
        .account-info {
          text-align: center;
        }
        .buttons {
          margin-top: 1rem;
        }
        .contribute-button {
          background-color: #28a745;
          color: #fff;
        }
        .contribute-button:hover {
          background-color: #218838;
        }
        .extract-button {
          background-color: #dc3545;
          color: #fff;
        }
        .extract-button:hover {
          background-color: #c82333;
        }
        p {
          font-size: 1.2rem;
          color: #555;
          margin: 0.5rem 0;
        }
      `}</style>
    </main>
  );
}