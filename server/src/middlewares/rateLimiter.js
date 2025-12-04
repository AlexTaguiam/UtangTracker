import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
  message: "Too many request. Try again later",
});
