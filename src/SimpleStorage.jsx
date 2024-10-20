// src/SimpleStorage.jsx
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SimpleStorageContract from './SimpleStorage.json'; // Path to your ABI JSON file

const SimpleStorage = () => {
  const [account, setAccount] = useState('');
  const [storedData, setStoredData] = useState(0);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const contract = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork.address);

      const data = await contract.methods.get().call();
      setStoredData(data);
    };

    initWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId];
    const contract = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork.address);

    await contract.methods.set(inputValue).send({ from: account });
    const updatedData = await contract.methods.get().call();
    setStoredData(updatedData);
  };

  return (
    <div>
      <h2>Simple Storage DApp</h2>
      <p>Account: {account}</p>
      <p>Stored Data: {storedData}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
        />
        <button type="submit">Set Data</button>
      </form>
    </div>
  );
};

export default SimpleStorage;
