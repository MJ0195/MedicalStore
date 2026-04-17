const User = require('../models/User');

exports.getUsersWithOrders = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const Order = require('../models/Order');

    // Fetch order count and total spent for each user
    const usersData = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ user: user._id }).populate('medicines.medicine', 'name');
      const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        totalOrders: orders.length,
        totalSpent,
        orders
      };
    }));

    res.json(usersData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
