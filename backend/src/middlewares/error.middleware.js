export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ success: false, message: err.message });
};