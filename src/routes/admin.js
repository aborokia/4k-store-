const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Middleware to check Admin role
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'غير مصرح لك بالوصول هنا' });
    }
    next();
};

// Add Product
router.post('/products', [authMiddleware, adminOnly], async (req, res) => {
    try {
        const { title, description, price, discountPrice, imageUrl, platform, categoryId } = req.body;
        const product = await prisma.product.create({
            data: { title, description, price, discountPrice, imageUrl, platform, categoryId }
        });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Digital Keys / Accounts stock
router.post('/keys', [authMiddleware, adminOnly], async (req, res) => {
    try {
        const { productId, keys } = req.body; // keys is an array of strings
        const keysData = keys.map(codeData => ({ productId, codeData }));

        await prisma.digitalKey.createMany({
            data: keysData
        });

        res.status(201).json({ message: `تمت إضافة ${keys.length} أكواد/حسابات بنجاح` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
