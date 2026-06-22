// SERVER/src/modules/auth/auth.route.js
import express from 'express';
const router = express.Router();

import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser // <-- 1. Import the new logout controller
} from './auth.controller.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

// 2. Add the logout POST route
router.post('/logout', logoutUser); 

export default router;