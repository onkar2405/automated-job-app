// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session?.user?.id) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  next();
};

module.exports = { requireAuth };
