import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided, authorization denied' });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, secret);

    // Attach user to request
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(500).json({ message: 'Server error during authentication' });
    }
  }
};