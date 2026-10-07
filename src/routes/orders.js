const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Create Order & Automatic Digital Key Delivery
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, paymentMethod } = req.body;
        const userId = req.user.userId;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

        // Find available key
        const availableKey = await prisma.digitalKey.findFirst({
            where: { productId: productId, isSold: false }
        });

        if (!availableKey) {
            return res.status(400).json({ error: 'عذراً، هذا المنتج غير متوفر حالياً' });
        }

        // Transaction: Create Order & Mark Key as Sold
        const result = await prisma.$transaction(async (tx) => {
            const updatedKey = await tx.digitalKey.update({
                where: { id: availableKey.id },
                data: { isSold: true, soldAt: new Date() }
            });

            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount: product.discountPrice || product.price,
                    paymentStatus: 'COMPLETED', // Automated instant completion
                    paymentMethod,
                    orderItems: {
                        create: {
                            productId: product.id,
                            digitalKeyId: updatedKey.id,
                            price: product.discountPrice || product.price
                        }
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            digitalKey: true,
                            product: true
                        }
                    }
                }
            });

            return order;
        });

        res.json({
            message: 'تم الشراء بنجاح! تم تسليم الكود تلقائياً.',
            order: result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        digitalKey: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
