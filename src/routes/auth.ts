import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

import { findUserByUsername } from '../services/userService';
import { User } from '../types/auth';

router.post("/login", async (req, res) => {

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is required' });
    }

    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    
    const userQueryResult: User | null = await findUserByUsername(username);

    if (!userQueryResult || userQueryResult.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    let data = {
        userId: userQueryResult.id,
        userName: userQueryResult.username
    }

    // TODO: Add token expiration
    const token = jwt.sign(data, JWT_SECRET);

    res.status(200).json({authToken: token});
});

export default router;
