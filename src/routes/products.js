const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all available products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isAvailable: true },
            include: { category: true }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product details by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true }
        });
        if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
