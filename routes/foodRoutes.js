const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Food = require('../models/Food');

// POST: Add Food (Private Route)
router.post('/foods', verifyToken, async (req, res) => {
    try {
        const newFood = new Food({
            ...req.body,
            donator_email: req.user.email, 
            donator_name: req.body.donator_name || req.user.name,
            donator_image: req.body.donator_image || req.user.picture,
            food_status: 'Available'
        });
        await newFood.save();
        res.status(201).send(newFood);
    } catch (error) {
        res.status(500).send({ message: 'Failed to add food.', error: error.message });
    }
});

router.get('/featured-foods', async (req, res) => {
    try {
        const foods = await Food.find({ food_status: 'Available' });

        //  numerical quantity sorting
        const getQuantityNumber = (quantityString) => {
            const match = quantityString.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        };

        // Sort the array in memory (descending quantity)
        foods.sort((a, b) => getQuantityNumber(b.food_quantity) - getQuantityNumber(a.food_quantity));

        // Take the top 6 results
        const featuredFoods = foods.slice(0, 6); 

        res.status(200).send(featuredFoods);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch featured foods.', error: error.message });
    }
});

// GET: Manage My Foods (Private Route)
router.get('/my-foods', verifyToken, async (req, res) => {
    try {
        const foods = await Food.find({ donator_email: req.user.email });
        res.status(200).send(foods);
    } catch (error) {
        res.status(500).send({ message: 'Failed to retrieve your foods.' });
    }
});

module.exports = router;