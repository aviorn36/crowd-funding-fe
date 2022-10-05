import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, contractAbi } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
let connectionAddress = undefined;

connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
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
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function fund() {
  //provider, connection
  if (
    connectionAddress !== undefined &&
    typeof window.ethereum !== "undefined"
  ) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    console.log("wei");
    console.log(ethers.utils.parseEther("1"));
    let transactionResponse;
    try {
      transactionResponse = await contract.fund({
        value: ethers.utils.parseEther("0.1"),
      });
    } catch (error) {
      console.log(error);
    }

    console.log(transactionResponse);
    //await transactionResponse.wait(1);
  } else {
    console.log("connection not established");
  }
  //signer
  //abi, address
}
