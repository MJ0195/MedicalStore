const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medical_store_inventory');
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const createdUsers = await User.insertMany([
      {
        firstName: 'Admin',
        lastName: 'User',
        dob: new Date('1985-05-15'),
        email: 'admin@medstore.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        firstName: 'Regular',
        lastName: 'Staff',
        dob: new Date('1990-10-20'),
        email: 'staff@medstore.com',
        password: userPassword,
        role: 'user'
      }
    ]);

    const adminId = createdUsers[0]._id;
    const staffId = createdUsers[1]._id;

    // 2. Create Medicines (15-20)
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const nearExpiry = new Date(today);
    nearExpiry.setDate(today.getDate() + 15); // 15 days from now

    const expired = new Date(today);
    expired.setMonth(today.getMonth() - 1);

    const farExpiry = new Date(today);
    farExpiry.setFullYear(today.getFullYear() + 2);

    const medicines = [
      { name: 'Paracetamol 500mg', batchNo: 'B-1001', category: 'Analgesics', manufacturer: 'GSK', price: 2.5, stock: 500, expiryDate: farExpiry },
      { name: 'Amoxicillin 250mg', batchNo: 'B-1002', category: 'Antibiotics', manufacturer: 'Pfizer', price: 15.0, stock: 50, expiryDate: nearExpiry },
      { name: 'Ibuprofen 400mg', batchNo: 'B-1003', category: 'Analgesics', manufacturer: 'Abbott', price: 5.0, stock: 10, expiryDate: farExpiry }, // Low stock
      { name: 'Cetirizine 10mg', batchNo: 'B-1004', category: 'Antihistamines', manufacturer: 'Cipla', price: 3.5, stock: 200, expiryDate: nextMonth }, // Near expiry
      { name: 'Omeprazole 20mg', batchNo: 'B-1005', category: 'Antacids', manufacturer: 'Sun Pharma', price: 8.0, stock: 5, expiryDate: farExpiry }, // Low stock
      { name: 'Azithromycin 500mg', batchNo: 'B-1006', category: 'Antibiotics', manufacturer: 'Lupin', price: 25.0, stock: 120, expiryDate: farExpiry },
      { name: 'Metformin 500mg', batchNo: 'B-1007', category: 'Anti-Diabetic', manufacturer: 'Dr. Reddys', price: 12.0, stock: 300, expiryDate: farExpiry },
      { name: 'Atorvastatin 20mg', batchNo: 'B-1008', category: 'Statins', manufacturer: 'Torrent', price: 18.0, stock: 80, expiryDate: farExpiry },
      { name: 'Aspirin 75mg', batchNo: 'B-1009', category: 'Analgesics', manufacturer: 'Bayer', price: 4.0, stock: 450, expiryDate: expired }, // Expired
      { name: 'Vitamin C 500mg', batchNo: 'B-1010', category: 'Supplements', manufacturer: 'Nature Made', price: 10.0, stock: 15, expiryDate: farExpiry }, // Low stock
      { name: 'Doxycycline 100mg', batchNo: 'B-1011', category: 'Antibiotics', manufacturer: 'Zydus', price: 22.0, stock: 90, expiryDate: farExpiry },
      { name: 'Pantoprazole 40mg', batchNo: 'B-1012', category: 'Antacids', manufacturer: 'Alkem', price: 9.5, stock: 150, expiryDate: farExpiry },
      { name: 'Losartan 50mg', batchNo: 'B-1013', category: 'Anti-Hypertensive', manufacturer: 'Mankind', price: 14.0, stock: 250, expiryDate: farExpiry },
      { name: 'Amlodipine 5mg', batchNo: 'B-1014', category: 'Anti-Hypertensive', manufacturer: 'Intas', price: 8.5, stock: 350, expiryDate: farExpiry },
      { name: 'Levocetirizine 5mg', batchNo: 'B-1015', category: 'Antihistamines', manufacturer: 'Micro Labs', price: 6.0, stock: 180, expiryDate: nearExpiry },
      { name: 'Ciprofloxacin 500mg', batchNo: 'B-1016', category: 'Antibiotics', manufacturer: 'Torrent', price: 20.0, stock: 8, expiryDate: farExpiry }, // Low stock
      { name: 'Diclofenac 50mg', batchNo: 'B-1017', category: 'Analgesics', manufacturer: 'Novartis', price: 5.5, stock: 220, expiryDate: farExpiry },
      { name: 'Ondansetron 4mg', batchNo: 'B-1018', category: 'Anti-Emetics', manufacturer: 'GSK', price: 11.0, stock: 75, expiryDate: farExpiry },
      { name: 'Fluconazole 150mg', batchNo: 'B-1019', category: 'Anti-Fungal', manufacturer: 'Pfizer', price: 30.0, stock: 40, expiryDate: farExpiry },
      { name: 'Multivitamin', batchNo: 'B-1020', category: 'Supplements', manufacturer: 'Centrum', price: 25.0, stock: 110, expiryDate: farExpiry }
    ];

    const createdMedicines = await Medicine.insertMany(medicines);

    // 3. Create Orders to simulate sales for the dashboard
    // Distribute orders over the last 30 days
    const orders = [];
    for (let i = 0; i < 50; i++) {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random day in last 30 days
      
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderMedicines = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const medIndex = Math.floor(Math.random() * createdMedicines.length);
        const med = createdMedicines[medIndex];
        const qty = Math.floor(Math.random() * 5) + 1;
        
        orderMedicines.push({
          medicine: med._id,
          quantity: qty,
          price: med.price
        });
        totalAmount += (med.price * qty);
      }

      orders.push({
        user: staffId,
        medicines: orderMedicines,
        totalAmount: totalAmount,
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    await Order.insertMany(orders);

    console.log('Data Imported successfully!');
    console.log('Admin Email: admin@medstore.com');
    console.log('Admin Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();
