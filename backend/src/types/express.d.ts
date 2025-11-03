import { DecodedToken } from "../middleware/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export {};
