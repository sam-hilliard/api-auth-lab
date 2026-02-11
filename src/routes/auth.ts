import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

router.post("/login", (req, res) => {

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

    if (username !== 'testuser' || password !== 'testpassword') {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
 
    let data = {
        userId: 12,
    }

    const token = jwt.sign(data, JWT_SECRET);

    res.send(token);
});

export default router;
