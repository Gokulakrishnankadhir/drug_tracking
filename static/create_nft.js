async function generateQRCode(destination, units, drugType, from) {
    // Generate detailed transaction data for the QR code
    const transaction_data = {
        from: from,
        destination: destination,
        units: units,
        drugType: drugType,
        timestamp: new Date().toISOString()
    };

    // Convert the transaction data to a JSON string
    const qrCodeData = JSON.stringify(transaction_data, null, 2); // Indent for readability

    // Generate QR code with the transaction data
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
    return qrCodeDataURL; // Return QR code data URL
}

async function createNFT() {
    const destination = document.getElementById('destination').value;
    const units = document.getElementById('units').value;
    const drugType = document.getElementById('drugType').value;

    if (!destination || !units || !drugType) {
        alert("Please fill in all fields.");
        return;
    }

    // Connect to MetaMask
    if (typeof window.ethereum !== 'undefined') {
        // Initialize Web3
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        // Generate QR code before initiating the NFT creation
        const qrCodeURL = await generateQRCode(destination, units, drugType, address);
        const qrCodeImg = document.createElement('img');
        qrCodeImg.src = qrCodeURL;
        qrCodeImg.alt = 'QR Code for Delivery Transaction';

        // Append the QR code to the DOM
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        qrCodeContainer.innerHTML = ""; // Clear previous QR codes
        qrCodeContainer.appendChild(qrCodeImg);
        qrCodeContainer.style.display = 'block'; // Make it visible

        // Wait for 30 seconds before minting the NFT
        setTimeout(async () => {
            await mintNFT(address, units, destination, drugType);
        }, 30000); // 30000 ms = 30 seconds

    } else {
        alert("Please install MetaMask!");
    }
}

// Attach event listener to the delivery form
document.getElementById('deliveryForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way
    createNFT();  // Call the createNFT function
});

// Function to mint the NFT
async function mintNFT(address, units, destination, drugType) {
    // Define the contract ABI and address
    const contractABI = [
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_add",
               "type": "address"
            },
            {
               "internalType": "string",
               "name": "_info",
               "type": "string"
            }
         ],
         "name": "add_Exporter",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "bytes32",
               "name": "hash",
               "type": "bytes32"
            },
            {
               "internalType": "string",
               "name": "_ipfs",
               "type": "string"
            }
         ],
         "name": "addDocHash",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_add",
               "type": "address"
            },
            {
               "internalType": "string",
               "name": "_newInfo",
               "type": "string"
            }
         ],
         "name": "alter_Exporter",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [],
         "stateMutability": "nonpayable",
         "type": "constructor"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "_exporter",
               "type": "address"
            },
            {
               "indexed": false,
               "internalType": "string",
               "name": "_ipfsHash",
               "type": "string"
            }
         ],
         "name": "addHash",
         "type": "event"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_newOwner",
               "type": "address"
            }
         ],
         "name": "changeOwner",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_add",
               "type": "address"
            }
         ],
         "name": "delete_Exporter",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "bytes32",
               "name": "_hash",
               "type": "bytes32"
            }
         ],
         "name": "deleteHash",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [],
         "name": "count_Exporters",
         "outputs": [
            {
               "internalType": "uint16",
               "name": "",
               "type": "uint16"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [],
         "name": "count_hashes",
         "outputs": [
            {
               "internalType": "uint16",
               "name": "",
               "type": "uint16"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "bytes32",
               "name": "_hash",
               "type": "bytes32"
            }
         ],
         "name": "findDocHash",
         "outputs": [
            {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
            },
            {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
            },
            {
               "internalType": "string",
               "name": "",
               "type": "string"
            },
            {
               "internalType": "string",
               "name": "",
               "type": "string"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_add",
               "type": "address"
            }
         ],
         "name": "getExporterInfo",
         "outputs": [
            {
               "internalType": "string",
               "name": "",
               "type": "string"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [],
         "name": "owner",
         "outputs": [
            {
               "internalType": "address",
               "name": "",
               "type": "address"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      }
   ];
    const contractAddress = '0xB861aDAB1Ea750563F92B8CcD601DB9dE9fe046b'; // Replace with your contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        // Send transaction to mintNFT
        const tx = await contract.methods.mintNFT(
            address, // The recipient address
            units.toString(), // Units as string
            destination, // Destination as string
            drugType // Drug Type as string
        ).send({ from: address });

        alert('NFT created successfully! Transaction Hash: ' + tx.transactionHash);
    } catch (error) {
        console.error('Error creating NFT:', error);
        alert('Error creating NFT: ' + error.message);
    }
}
