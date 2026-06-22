import express from 'express';

const router = express.Router();

// A simple test route to prevent crashes
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "User routes are working!"
    });
});

export default router;