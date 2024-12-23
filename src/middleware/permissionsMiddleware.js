const { protect } = require('./authMiddleware');

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      await protect(req, res, async () => {
        if (!req.user.hasPermission(permission)) {
          return res.status(403).json({ error: 'Forbidden, insufficient permissions' });
        }
        next();
      });
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized' });
    }
  };
};

module.exports = checkPermission;
