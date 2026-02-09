// Responsibilities: protect routes (stub)

export const requireAuth = (req, res, next) => {
  // TODO: implement auth check (JWT/session)
  next();
};
