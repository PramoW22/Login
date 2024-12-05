const User = require('../models/User');

// Controller to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
