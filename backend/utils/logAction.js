const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

module.exports = async (userId, action) => {
  try {
    const log = new Log({ userId, action });
    await log.save();
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
