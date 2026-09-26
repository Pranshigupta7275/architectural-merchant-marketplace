// SERVER/src/modules/auth/auth.route.js
import express from 'express';
const router = express.Router();

import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser
} from './auth.controller.js';
import { validateRequest, registerSchema, loginSchema } from '../../middleware/validation.middleware.js';

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

export default router;