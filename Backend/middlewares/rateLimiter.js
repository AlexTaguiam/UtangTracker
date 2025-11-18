import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: "Too many request. Try again later",
});
