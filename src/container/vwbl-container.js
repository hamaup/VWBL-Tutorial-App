import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { ethers } from 'ethers';
import { ManageKeyType, UploadContentType, UploadMetadataType, VWBLEthers } from 'vwbl-sdk';

const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState();
  const [vwbl, setVwbl] = useState();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      } else {
        console.log('MetaMask is installed!', ethereum);
      }

      // ウォレットに接続
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // web3インスタンスの生成
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //await provider.send("eth_requestAccounts", []);

      // ユーザーアドレスを取得
      const signer = provider.getSigner();
      const currentAccount = await signer.getAddress();


      // 各変数のstateを保存
      setWeb3(provider);
      setUserAddress(currentAccount);

      // ネットワークを確認
      const connectedChainId = await provider.getNetwork().chainId;
      const properChainId = parseInt(process.env.REACT_APP_CHAIN_ID); // 今回の場合、Mumbaiの80001
      if (connectedChainId !== properChainId) {
        // ネットワークがMumbaiでない場合はネットワークを変更
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(properChainId) }],
          });
        } catch (error) {
          // wallet_switchEthereumChainがサポートされていない場合
          console.error('wallet_switchEthereumChain is not supported');
        }
      }


      // initVwblを実行してvwblインスタンスを作成する
      initVwbl(provider, signer);

    } catch (error) {

      if (error.code === 4001) {
        alert('Please connect Your Wallet.');
      } else {
        alert(error.message);
      }
      console.error(error);
    }
  };
  const disconnectWallet = () => {
    setUserAddress('');
    setWeb3(undefined);
    setVwbl(undefined);
  };

  // Lesson-3
  const initVwbl = (ethProvider, ethSigner) => {
    // vwblインスタンスの作成
    const vwblInstance = new VWBLEthers({
      ethersProvider: ethProvider, // ethers.js provider instance
      ethersSigner: ethSigner, // ethers.js signer instance
      contractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      vwblNetworkUrl: process.env.REACT_APP_VWBL_NETWORK_URL,
      manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
      uploadContentType: UploadContentType.IPFS,
      uploadMetadataType: UploadMetadataType.IPFS,
      ipfsNftStorageKey: process.env.REACT_APP_NFT_STORAGE_KEY,
    });
    // vwblインスタンスをstateを保存
    setVwbl(vwblInstance);
  };

  return {
    userAddress,
    web3,
    vwbl,
    connectWallet,
    disconnectWallet,
    initVwbl,
  };
};

export const VwblContainer = createContainer(useVWBL);
