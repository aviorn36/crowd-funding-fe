import React from 'react'
import Button from '@mui/material/Button';
import { padding } from '@mui/system';
//import {connect} from '../services';

const MuiButton = ({display, onClick}) => {
  
  return (
  
   <Button onClick={onClick} sx={{color:'black', border: "1px solid black", paddingLeft:10 }}>{display}</Button>
   //<div>hello world</div>
  )
}
// onClick={() => connect()}

export default MuiButton