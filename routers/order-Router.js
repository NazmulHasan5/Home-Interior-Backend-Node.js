const express = require('express');
const orderController = require('../controllers/order-Controller');


const router = express.Router();

router.put('/add-order', orderController.orderPost);
router.put('/order-list', orderController.putOrderList);

module.exports = router 