import { GraphQLError } from 'graphql';
import { IContext } from '../types';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (context: IContext): boolean => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return true;
};

/**
 * Check if user is an admin
 */
export const isAdmin = (context: IContext): boolean => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  
  if (context.user.role !== 'admin') {
    throw new GraphQLError('You do not have permission to perform this action', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  
  return true;
};

/**
 * Check if user is admin or employee (any authenticated user)
 */
export const isAdminOrEmployee = (context: IContext): boolean => {
  return isAuthenticated(context);
};

