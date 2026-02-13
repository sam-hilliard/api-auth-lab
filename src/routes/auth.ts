import { Router } from 'express';
import { signToken } from '../utils/jwt';
import { login, signup } from '../services/authService';
const router = Router();

router.post("/login", async (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is required' });
    }

    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await login(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const data = {
        userId: user.id,
        userName: user.username
    }

    const token = signToken(data);
    res.status(200).json({authToken: token});
});

router.post("/signup", async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Request body is required' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await signup(username, password);

    if (!user) {
        throw new Error('Failed to register user.');
    }
   
    let data = {
        userId: user.id,
        userName: user.username
    }

    const token = signToken(data)

    res.status(200).json({userId: user.id, userName: user.username, authToken: token});
});

export default router;
