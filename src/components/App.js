import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Main from "./Main";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
//If you don't put any arguments it will default to these

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "This isn't an ethereum browser. Make sure you have Metamask installed"
    );
  }
};

const App = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [decentragram, setDecentragram] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const web3 = await window.web3;
    const accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];

    setAccount(accounts[0]);

    //Check if the contract is on the ganache network
    if (networkData) {
      const decentragram = new web3.eth.Contract(
        Decentragram.abi,
        networkData.address
      );

      setDecentragram(decentragram);
      setLoading(false);
      populateImages(decentragram);
    } else {
      window.alert("Decentragram has not been deployed to this network");
    }
  }

  async function populateImages(decentragram) {
    const imageCount = await decentragram.methods.imageCount().call();

    const allImages = [];
    for (let i = 0; i < imageCount; i++) {
      const image = await decentragram.methods.images(i).call();

      allImages.push(image);
    }

    setImages(allImages);
  }

  const captureFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log("buffer", buffer);
    };
  };

  const uploadImage = (description) => {
    console.log("Submitting file to ipfs...");
    if (!buffer) {
      console.log("Nothing in the bugger");
      return;
    }

    //Adding file to ipfs
    ipfs.add(buffer, (err, res) => {
      console.log("Ipfs result", res);

      if (err) {
        console.error(err);
        return;
      }

      setLoading(true);
      decentragram.methods
        .uploadImage(res[0].hash, description)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          setLoading(false);
        });
    });
  };

  const tipImageOwner = async (id, tipAmount) => {
    setLoading(true);

    decentragram.methods
      .tipImageOwner(id)
      .send({ from: account, value: tipAmount })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  console.log("images", images);
  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main
          captureFile={captureFile}
          uploadImage={uploadImage}
          images={images}
          tipImageOwner={tipImageOwner}
        />
      )}
    </div>
  );
};

export default App;
