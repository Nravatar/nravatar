// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// NEAR
import { Nravatar } from './near-interface';
import { Wallet } from './near-wallet';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const contractName = 'app.nravatar.testnet' || process.env.CONTRACT_NAME
const wallet = new Wallet({ createAccessKeyFor: contractName })

// Abstract the logic of interacting with the contract to simplify your flow
const nravatar = new Nravatar({ contractId: contractName, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()
 
  ReactDOM.render(
    <App isSignedIn={isSignedIn} nravatar={nravatar} wallet={wallet} />,
    document.getElementById('root')
  );
}