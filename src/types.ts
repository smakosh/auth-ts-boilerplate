import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import passport from 'passport';
import { RedisClient } from 'redis';
import { User } from './entity/User';

export type ContextType = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: string };
    refreshToken: string;
    user: User;
  };
  res: Response;
  redisClient: RedisClient;
  passport: typeof passport;
};
