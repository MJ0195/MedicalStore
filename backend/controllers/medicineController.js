const Medicine = require('../models/Medicine');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ stock: { $gt: 0 } }).sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
