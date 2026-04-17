const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

exports.placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    let totalAmount = 0;
    const orderMedicines = [];

    // Verify stock and calculate total
    for (const item of cartItems) {
      const medicine = await Medicine.findById(item.medicineId);
      
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found` });
      }
      
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }

      orderMedicines.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.price
      });

      totalAmount += (medicine.price * item.quantity);

      // Reduce stock
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    const order = await Order.create({
      user: req.user._id,
      medicines: orderMedicines,
      totalAmount,
      paymentMethod: paymentMethod || 'Card'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('medicines.medicine', 'name batchNo')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('medicines.medicine', 'name batchNo');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order (either the owner or an admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
