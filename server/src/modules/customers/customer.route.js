// src/modules/customers/customer.route.js
import express from 'express';
import { getCustomers } from './customer.controller.js';

const router = express.Router();

// Define your routes
router.route('/').get(getCustomers);


export default router;