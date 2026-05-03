const isModerator = (req, res, next) => {
  if (req.user.role !== "moderator") {
    return res.status(403).send({
      success: false,
      message: "Access denied",
    });
  }
  next();
};
export default isModerator;