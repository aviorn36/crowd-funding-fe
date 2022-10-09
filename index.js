import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, contractAbi } from "./constants.js";

var dialog = document.querySelector("dialog");
dialog.querySelector(".close").addEventListener("click", function () {
  dialog.close();
});

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
let connectionAddress = undefined;

connectButton.onclick = connect;
fundButton.onclick = fund;

const withdrawButton = document.getElementById("withdrawButton");
const balanceButton = document.getElementById("balanceButton");

withdrawButton.onclick = withdraw;
balanceButton.onclick = getBalance;

async function getFunder() {
  const fundersList = document.getElementById("fundersList");
  fundersList.replaceChildren();
  // const funderData = [
  //   { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "0.1" },
  //   { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "0.1" },
  //   { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "0.1" },
  //   { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "0.1" },
  // ];
  console.log("funding list...");
  let fundingData;
  console.log(fundingData);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      fundingData = await contract.getAllFundingData();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("connection not established");
  }
  console.log(fundingData);
  let formattedFundingData = [];
  for (let index = 0; index < fundingData[0].length; index++) {
    let element = {
      address: fundingData[0][index],
      amount: parseInt(fundingData[1][index]) / 1000000000000000000,
    };
    formattedFundingData.push(element);
  }
  //console.log(formattedFundingData);
  formattedFundingData.forEach((funder) => {
    const tr = document.createElement("tr");
    Object.keys(funder).forEach((item) => {
      const td = document.createElement("td");
      if (item === "address") {
        td.setAttribute("class", "mdl-data-table__cell--non-numeric");
      }

      td.append(document.createTextNode(funder[item]));
      tr.appendChild(td);
    });

    fundersList.appendChild(tr);
  });
}

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
  const ethAmount = document.getElementById("ethAmount").value;
  //provider, connection
  if (typeof window.ethereum !== "undefined") {
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
}

async function withdraw() {
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
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      //console.log(ethers.utils.formatEther(balance));
      balanceButton.innerHTML =
        "Fund Balance: " + ethers.utils.formatEther(balance);
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        dialog.showModal();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

document.querySelectorAll("a.mdl-navigation__link").forEach((link) => {
  link.onclick = (event) => {
    showSection(event.target.id);
  };
});
function showSection(id) {
  const allSections = ["home", "funder", "receiver"];
  const title = {
    home: "Home",
    funder: "Funder",
    receiver: "Receiver",
  }[id];
  allSections.forEach((sectionId) => {
    const section = document.getElementById(`${sectionId}-section`);
    document.getElementById(`title`).innerHTML = title;
    if (sectionId === id) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
  if (id === "receiver") {
    getFunder();
  }
}
