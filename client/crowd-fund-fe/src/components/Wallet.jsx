import React, { Component, useState } from 'react';

import { ethers } from "ethers";
import MuiButton from '../commons/MuiButton';
import { Typography } from '@mui/material';

const Wallet = () => {

  const[state, setState] = useState({selectedAddress:null})  

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    setState({ selectedAddress: accounts[0] })
  }

  const renderMetamask = () => {
    if (!state.selectedAddress) {
      return (
        <MuiButton onClick={connectToMetamask} display="Connect To MetaMask"/>
      )
    } else {
      return (
        // <Typography>Connected Address : {state.selectedAddress}</Typography>
        <Typography>Connected</Typography>
      );
    }
  }

    return(
      <div>
        {renderMetamask()}
      </div>
    )
  }

export default Wallet;