const { GraphQLError } = require('graphql');

// Check if user is authenticated
const isAuthenticated = (context) => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
  return true;
};

// Check if user has required role
const hasRole = (context, allowedRoles) => {
  isAuthenticated(context);
  
  if (!allowedRoles.includes(context.user.role)) {
    throw new GraphQLError('You do not have permission to perform this action', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  return true;
};

// Check if user is admin
const isAdmin = (context) => {
  return hasRole(context, ['admin']);
};

// Check if user is admin or employee
const isAdminOrEmployee = (context) => {
  return hasRole(context, ['admin', 'employee']);
};

module.exports = {
  isAuthenticated,
  hasRole,
  isAdmin,
  isAdminOrEmployee
};

