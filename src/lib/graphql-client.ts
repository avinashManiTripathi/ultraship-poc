/**
 * GraphQL Client Utility
 * Centralized GraphQL request handler
 */

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, any>;
}

/**
 * Execute a GraphQL request
 */
export async function graphqlRequest<T = any>(
  options: GraphQLRequestOptions
): Promise<T> {
  const { query, variables } = options;

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL');
  }

  return result.data;
}

/**
 * Execute a GraphQL mutation
 */
export async function graphqlMutation<T = any>(
  mutation: string,
  variables?: Record<string, any>
): Promise<T> {
  return graphqlRequest<T>({ query: mutation, variables });
}

/**
 * Execute a GraphQL query
 */
export async function graphqlQuery<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  return graphqlRequest<T>({ query, variables });
}

