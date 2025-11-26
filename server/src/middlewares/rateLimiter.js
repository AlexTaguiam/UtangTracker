import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many request. Try again later",
});
