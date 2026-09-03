const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_super_secret_key';
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); 

app.get('/api/health', (req, res) => {
  res.json({ message: "Server is working!" });
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword 
      }
    });
    
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Database error", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post('/api/artworks', async (req, res) => {
  try {
    const { title, imageUrl, userId } = req.body;
    
    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        imageUrl,
        userId: Number(userId), 
        filter: "normal"
      },
    });

    res.status(201).json({ success: true, artwork: newArtwork });
  } catch (error) {
    console.error("Error while adding picture:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get('/api/artworks', async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      include: { user: true }, 
    });
    res.json({ success: true, artworks });
  } catch (error) {
    console.error("Error while fetching pictures:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Wrong email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Wrong email or password' });
    }

    res.json({ 
      success: true, 
      message: 'Successfully logged in!', 
      userId: user.id, 
      email: user.email 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Սխալ էլ. փոստ կամ գաղտնաբառ' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Սխալ էլ. փոստ կամ գաղտնաբառ' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ 
      success: true, 
      message: 'You logged in successfully!', 
      token, 
      userId: user.id 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Ներքին սերվերային սխալ' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is active at http://localhost:${PORT}`);
});