import React, { useEffect, useState } from 'react';
import './App.css';
import { Chart } from "react-google-charts";

function App() {
  const [coinlist, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [history, setHistory] = useState([["DateTime", "Price of coin"], ['Jan 2000', 0]]);

  useEffect(() => {
    fetch('https://api.coincap.io/v2/assets?limit=50&offset=0')
    .then((res) => res.json())
    .then((data) => {
      setCoinList(data.data);
      const bitcoin_coin = data.data.filter(cell => cell.id == 'bitcoin-bep2').at(0);
      setSelectedCoin(bitcoin_coin);
    })
    .catch((err)=>console.log(err))
    getValueHistory('bitcoin-bep2');
  }, []);

  const handleChangeCoin = (event) => {
    getInformation(event.target.value);
  }

  const getInformation = id => {
    const selected_coin = coinlist.filter(cell => cell.id == id).at(0);
    setSelectedCoin(selected_coin);
    getValueHistory(id);
  }

  const getValueHistory = id => {
    fetch(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data);
      let history_list = [["DateTime", "Price of coin"]];
      data.data.map((cell, index) => {
        let time = new Date(cell.time);
        console.log(time)
        if(time) {
          history_list.push([time, parseFloat(cell.priceUsd)])
        }
      })
      console.log(history_list);
      setHistory(history_list);
    })
    .catch((err)=>console.log(err))
  }

  const options = {
    isStacked: true,
    legend: { position: "top", maxLines: 3 },
    vAxis: { minValue: 0, format:"$#.############",},
  };

  return (
    <div className="App">
      <div>
        <div><h1>Dashboard of coin</h1></div>
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
      <div
        style={{
          width: '100%',
          height: '500px'
        }}
      >
        <Chart
          chartType="AreaChart"
          width="100%"
          height="100%"
          data={history}
          options={options}
        />
      </div>
    </div>
  );
}

export default App;
