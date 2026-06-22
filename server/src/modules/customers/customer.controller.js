// src/modules/customers/customer.controller.js
import Customer from './customer.model.js'; // Import your Mongoose model

/**
 * @desc    Get all customers from the live database
 * @route   GET /api/customers
 * @access  Private/Admin
 */
const getCustomers = async (req, res) => {
  try {
    // Fetch all customers and sort by Highest LTV (Lifetime Value) descending
    const customers = await Customer.find({}).sort({ ltv: -1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error(`Error fetching customers: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not fetch customers.' });
  }
};

/**
 * @desc    Seed the database with initial mock data (ONE-TIME USE)
 * @route   POST /api/customers/seed
 * @access  Private/Admin
 */
const seedCustomers = async (req, res) => {
  try {
    // 1. Clear out any existing dummy data to prevent duplicates
    await Customer.deleteMany({});

    // 2. The exact mock data you were using
    const mockCustomers = [
      {
        name: 'Julian Thorne',
        email: 'j.thorne@architectural.design',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=64&h=64',
        segment: 'VIP',
        orders: 42,
        ltv: 84200.00
      },
      {
        name: 'Elena Rodriguez',
        email: 'elena.r@curatedspaces.co',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
        segment: 'New',
        orders: 3,
        ltv: 5400.00
      },
      {
        name: 'Marcus Sterling',
        email: 'm.sterling@privateestate.io',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
        segment: 'VIP',
        orders: 89,
        ltv: 212500.00
      },
      {
        name: 'Sienna Miller',
        email: 'sienna@independentliving.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&h=64',
        segment: 'Inactive',
        orders: 1,
        ltv: 850.00
      },
      {
        name: 'David Chen',
        email: 'david.c@minimalist.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
        segment: 'VIP',
        orders: 28,
        ltv: 45600.00
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah@jenkins-studio.net',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
        segment: 'New',
        orders: 2,
        ltv: 3200.00
      }
    ];

    // 3. Insert the data into MongoDB
    const createdCustomers = await Customer.insertMany(mockCustomers);

    res.status(201).json({
      message: 'Database successfully seeded!',
      count: createdCustomers.length,
      data: createdCustomers
    });

  } catch (error) {
    console.error(`Error seeding customers: ${error.message}`);
    res.status(500).json({ message: 'Server Error: Could not seed customers.' });
  }
};

// Export both functions
export { getCustomers, seedCustomers };