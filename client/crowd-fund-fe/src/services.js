//import { ethers } from "./libs/ethers-5.6.esm.min.js";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./constants/constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
let connectionAddress = undefined;

connectButton.onclick = connect;
fundButton.onclick = fund;

const withdrawButton = document.getElementById("withdrawButton");
const balanceButton = document.getElementById("balanceButton");

withdrawButton.onclick = withdraw;
balanceButton.onclick = getBalance;

export const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      connectionAddress = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(`connected: ${connectionAddress}`);
    } catch (error) {
      connectionAddress = undefined;
      console.log(error);
    }
    //connectButton.innerHTML = "Connected!";
  } else {
    //connectButton.innerHTML = "Please install metamask";
  }
};

export const fund = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  //provider, connection
  if (
    connectionAddress !== undefined &&
    typeof window.ethereum !== "undefined"
  ) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    let transactionResponse;
    try {
      transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }

    //console.log(transactionResponse);
    //await transactionResponse.wait(1);
  } else {
    console.log("connection not established");
  }
  //signer
  //abi, address
};

export const withdraw = async () => {
  console.log(`Withdrawing...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
};

export const getBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
};

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
