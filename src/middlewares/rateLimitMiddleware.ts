import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../config/rateLimitConfig";

export const apiRateLimit = rateLimit(rateLimitConfig);
