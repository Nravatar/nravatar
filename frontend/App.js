import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';


export default function App({ isSignedIn, nravatar, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  console.log('wallet.accountId',wallet.accountId)
  // Get blockchian state once on component load
  React.useEffect(() => {
    nravatar.getAvatar({ account_id: wallet.accountId })
      .then((ret)=>{
        console.log('ret',ret)
      })
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  function setAvatar(e) {
    nravatar.setAvatar({
      contractId: 'paras-token-v2.testnet',
      tokenId: '2291:2'
    })
      .then((ret)=> {
        console.log('ret changed',ret)
      })
      .finally(() => {
        setUiPleaseWait(false);
        console.log('finally')
      });
  }

  function deleteAvatar(e) {
    console.log(e)
    nravatar.deleteAvatar({
      contractId: 'nft.examples.testnet',
      tokenId: 'Keypom-1667010930606'
    })
      .then((ret)=> {
        console.log('ret changed',ret)
      })
      .finally(() => {
        setUiPleaseWait(false);
        console.log('finally')
      });
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          The contract says: <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <button onClick={setAvatar}>
          <span>Save</span>
        </button>

        <button onClick={deleteAvatar}>
          <span>Delete</span>
        </button>
        <EducationalText/>
      </main>
    </>
  );
}
