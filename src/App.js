import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [coinlist, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    fetch('https://api.coincap.io/v2/assets?limit=50&offset=0')
    .then((res) => res.json())
    .then((data) => {
      setCoinList(data.data);
      const bitcoin_coin = data.data.filter(cell => cell.id == 'bitcoin-bep2').at(0);
      setSelectedCoin(bitcoin_coin);
    })
    .catch((err)=>console.log(err))
  }, []);

  const handleChangeCoin = (event) => {
    getInformation(event.target.value);
  }

  const getInformation = id => {
    const selected_coin = coinlist.filter(cell => cell.id == id).at(0);
    setSelectedCoin(selected_coin);
  }

  return (
    <div className="App">
      <div>
        <span>Select the Coin Type: </span>
        <select className="coin-select" onChange={handleChangeCoin} value={coinlist.length == 0 ? '' : 'bitcoin-bep2'}> 
          {
            coinlist.map(cell => {
              return(<option key={cell.id} value={cell.id}>{cell.name} - {cell.symbol}</option>)
            })
          }
        </select>
      </div>   
      <div>
        <span>Supply: </span>
        <span>{selectedCoin? selectedCoin.supply : ''}</span>
      </div> 
      <div>
        <span>MarketCap: </span>
        <span>{selectedCoin? selectedCoin.marketCapUsd : ''}</span>
      </div>
    </div>
  );
}

export default App;
