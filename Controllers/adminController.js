const User = require('../Models/User');

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { role } = req.query;

    const filter = { isActive: true };
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter, {
      page,
      limit,
      sortBy: 'createdAt',
      order: 'desc'
    });

    const total = await User.count(filter);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get Platform Statistics (Admin Only)
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count({ isActive: true });

    // Users by role
    const adminCount = await User.count({ role: 'admin', isActive: true });
    const registeredCount = await User.count({ role: 'registered', isActive: true });

    res.status(200).json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          admin: adminCount,
          registered: registeredCount
        }
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
