import { ContextType } from '../types';
import { AuthChecker } from 'type-graphql';
import { User } from '../entity/User';

export const AuthenticationChecker: AuthChecker<ContextType> = async (
  { context },
  roles,
) => {
  const user = await User.findOneOrFail(context.req.session.userId);

  if (!roles.includes(String(user.userType))) {
    return false;
  }

  return true;
};
