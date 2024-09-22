  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const axios = require("axios");
  const os = require("os");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  mongoose
    .connect("mongodb://localhost:27017/snakeGame")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

  // Player and score model
  const playerSchema = new mongoose.Schema({
    playerName: String,
    score: Number,
  });

  const ipSchema = new mongoose.Schema({
    ip: String,
    port: String,
  });

  const Player = mongoose.model("Player", playerSchema);
  const Address = mongoose.model("Address", ipSchema);

  // Get IP address of the machine
  const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
      for (let interfaceInfo of interfaces[interfaceName]) {
        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
          return interfaceInfo.address; // Return the IPv4 address
        }
      }
    }
    return '127.0.0.1'; // Fallback if no external IP is found
  };

  // Route to get all high scores
  app.get("/api/getHighScores", async (req, res) => {
    const players = await Player.find().sort({ score: -1 }).limit(5);
    res.json(players);
  });


  // Route to update a player's score
  app.post("/api/updateHighScores", async (req, res) => {
    const { playerName, score } = req.body;
    let player = await Player.findOne({ playerName });

    if (!player) {
      player = new Player({ playerName, score });
    } else if (score > player.score) {
      player.score = score;
    }
    await player.save();

    let addresses = await Address.find();
    for (let address of addresses) {
      let url_1 = `http://${address.ip}:${address.port}/api/getHighScores`;
      try {
        const response = await axios.get(url_1);
        const otherServerHighScores = response.data;

        // Process each score received from the other server
        for (const otherPlayer of otherServerHighScores) {
          let existingPlayer = await Player.findOne({ playerName: otherPlayer.playerName });
          if (!existingPlayer) {
            // Add the player if not found in the local database
            existingPlayer = new Player({
              playerName: otherPlayer.playerName,
              score: otherPlayer.score,
            });
          } else if (otherPlayer.score > existingPlayer.score) {
            // Update the local player's score if the other server has a higher score
            existingPlayer.score = otherPlayer.score;
          }
          await existingPlayer.save();
        }
      } catch (error) {
        console.error(`Could not retrieve high scores from ${address.ip}:${address.port}`, error);
      }
    }

    addresses = addresses.map(addr => ({ ip: addr.ip, port: addr.port }));

    // Include your server's own IP and port in the list of addresses
    const myIp = getIPAddress();
    const myPort = toString(server.address().port);
    addresses.push({ ip: myIp, port: myPort });
    console.log(addresses);
    // Post the addresses to each known server
    for (const address of addresses) {
      console.log(typeof myPort+" "+address.ip+" "+address.port);
      if(address.ip!==myIp){
        const url = `http://${address.ip}:${address.port}/api/addAddress`;
        try {
          await axios.post(url, { addresses });
          console.log(`Successfully sent addresses to ${address.ip}:${address.port}`);
        } catch (error) {
          console.error(`Could not send addresses to ${address.ip}:${address.port}`, error);
        }
      }
      res.sendStatus(200);
      }
  });

  // Route to add new server addresses (IP and port)
  app.post("/api/addAddress", async (req, res) => {
    const addresses = req.body.addresses;
    
    for (let addr of addresses) {
      const { ip, port } = addr;
    
      // Check if the address already exists
      let address = await Address.findOne({ ip, port });
      if (!address) {
      // Add the new address if it doesn't already exist
      address = new Address({ ip, port });
      await address.save();
      }
    }
    
    res.sendStatus(200);
    });
    
  // Listen on the specified port
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    const myIp = getIPAddress();
    const myPort = server.address().port;
    console.log(`Server running at http://${myIp}:${myPort}`);
  });


