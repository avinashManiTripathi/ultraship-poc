# GraphQL Refactoring Documentation

## 📁 New Structure

The GraphQL queries and mutations have been refactored into a centralized, maintainable structure:

```
src/
├── graphql/
│   ├── queries.ts        # All GraphQL queries
│   ├── mutations.ts      # All GraphQL mutations
│   └── index.ts          # Central export
├── hooks/
│   ├── useAuth.ts        # Authentication hooks
│   ├── useEmployees.ts   # Employee CRUD hooks
│   ├── useDepartments.ts # Department CRUD hooks
│   └── index.ts          # Central export
└── lib/
    └── graphql-client.ts # GraphQL client utility
```

---

## 🎯 Benefits

### Before Refactoring:
❌ Queries/mutations scattered across multiple files  
❌ Duplicated code  
❌ Hard to maintain  
❌ Inconsistent error handling  
❌ Mixed concerns  

### After Refactoring:
✅ Centralized queries and mutations  
✅ Reusable custom hooks  
✅ Consistent error handling  
✅ Type-safe operations  
✅ Separation of concerns  
✅ Easy to test  

---

## 📖 Usage Guide

### 1. Authentication

#### Request OTP and Login

```typescript
import { useAuthMutations } from '@/hooks/useAuth';

function LoginComponent() {
  const { requestOTP, verifyOTP, loading, error } = useAuthMutations();

  const handleLogin = async () => {
    try {
      // Request OTP
      const result = await requestOTP('user@example.com');
      console.log(result.otp); // For testing

      // Verify OTP
      const authResult = await verifyOTP('user@example.com', '123456');
      console.log(authResult.user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Loading...' : 'Login'}
    </button>
  );
}
```

#### Logout

```typescript
const { logout } = useAuthMutations();

await logout();
```

---

### 2. Employees

#### Fetch Employees

```typescript
import { useEmployees } from '@/hooks/useEmployees';

function EmployeeList() {
  const { fetchEmployees, loading, error } = useEmployees();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const result = await fetchEmployees({
          page: 1,
          pageSize: 10,
          sortBy: 'name',
          sortOrder: 'ASC',
          search: 'John',
          department: 'Engineering'
        });
        
        console.log(result.employees);
        console.log(result.totalCount);
        console.log(result.pageInfo);
      } catch (err) {
        console.error(err);
      }
    };

    loadEmployees();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Employee List</div>;
}
```

#### Add Employee

```typescript
import { useEmployeeMutations } from '@/hooks/useEmployees';

function AddEmployeeForm() {
  const { addEmployee, loading, error } = useEmployeeMutations();

  const handleSubmit = async (formData) => {
    try {
      const employee = await addEmployee({
        name: formData.name,
        age: parseInt(formData.age),
        class: formData.class,
        subjects: formData.subjects.split(','),
        attendance: parseFloat(formData.attendance),
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate,
        salary: parseFloat(formData.salary),
        address: formData.address,
        status: 'Active'
      });
      
      console.log('Employee added:', employee);
    } catch (err) {
      console.error(err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Update Employee

```typescript
const { updateEmployee } = useEmployeeMutations();

await updateEmployee('employee-id', {
  name: 'Updated Name',
  position: 'Senior Developer'
});
```

#### Delete Employee

```typescript
const { deleteEmployee } = useEmployeeMutations();

await deleteEmployee('employee-id');
```

---

### 3. Departments

#### Fetch Departments

```typescript
import { useDepartments } from '@/hooks/useDepartments';

function DepartmentList() {
  const { fetchDepartments, loading, error } = useDepartments();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        console.log(departments);
      } catch (err) {
        console.error(err);
      }
    };

    loadDepartments();
  }, []);

  return <div>Department List</div>;
}
```

#### Add Department

```typescript
import { useDepartmentMutations } from '@/hooks/useDepartments';

const { addDepartment } = useDepartmentMutations();

await addDepartment({
  name: 'Marketing',
  description: 'Marketing department'
});
```

#### Update Department

```typescript
const { updateDepartment } = useDepartmentMutations();

await updateDepartment('dept-id', {
  name: 'Updated Name',
  description: 'Updated description'
});
```

#### Delete Department

```typescript
const { deleteDepartment } = useDepartmentMutations();

await deleteDepartment('dept-id');
```

---

## 🔧 Direct GraphQL Client Usage

For custom operations, you can use the GraphQL client directly:

```typescript
import { graphqlQuery, graphqlMutation } from '@/lib/graphql-client';
import { GET_EMPLOYEES, ADD_EMPLOYEE } from '@/graphql';

// Query
const data = await graphqlQuery(GET_EMPLOYEES, {
  page: 1,
  pageSize: 10
});

// Mutation
const result = await graphqlMutation(ADD_EMPLOYEE, {
  input: { name: 'John Doe', ... }
});
```

---

## 📝 Adding New Operations

### 1. Add Query to `src/graphql/queries.ts`

```typescript
export const GET_CUSTOM_DATA = `
  query GetCustomData($param: String!) {
    customData(param: $param) {
      id
      value
    }
  }
`;
```

### 2. Add Mutation to `src/graphql/mutations.ts`

```typescript
export const CREATE_CUSTOM = `
  mutation CreateCustom($input: CustomInput!) {
    createCustom(input: $input) {
      id
      value
    }
  }
`;
```

### 3. Create Hook in `src/hooks/useCustom.ts`

```typescript
import { useState, useCallback } from 'react';
import { graphqlQuery, graphqlMutation } from '@/lib/graphql-client';
import { GET_CUSTOM_DATA, CREATE_CUSTOM } from '@/graphql';

export function useCustom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomData = useCallback(async (param: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlQuery(GET_CUSTOM_DATA, { param });
      return data.customData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustom = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlMutation(CREATE_CUSTOM, { input });
      return data.createCustom;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchCustomData,
    createCustom,
    loading,
    error,
  };
}
```

### 4. Export from `src/hooks/index.ts`

```typescript
export * from './useCustom';
```

---

## 🧪 Testing

All hooks are designed to be easily testable:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useEmployees } from '@/hooks/useEmployees';

test('fetches employees', async () => {
  const { result } = renderHook(() => useEmployees());

  await act(async () => {
    const employees = await result.current.fetchEmployees({
      page: 1,
      pageSize: 10
    });
    expect(employees).toBeDefined();
  });
});
```

---

## 📊 Migration Guide

### Old Way (Before):

```typescript
const response = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    query: `
      mutation AddEmployee($input: EmployeeInput!) {
        addEmployee(input: $input) {
          id
          name
        }
      }
    `,
    variables: { input: data }
  })
});
const result = await response.json();
```

### New Way (After):

```typescript
const { addEmployee } = useEmployeeMutations();
const employee = await addEmployee(data);
```

---

## ✨ Best Practices

1. **Always use hooks** instead of direct fetch calls
2. **Handle loading and error states** from hooks
3. **Use TypeScript types** for type safety
4. **Keep queries/mutations simple** and focused
5. **Reuse existing operations** when possible
6. **Add proper error handling** in components
7. **Test hooks** independently from components

---

## 🚀 Next Steps

1. Update remaining components to use hooks:
   - [x] `LoginPage.tsx` ✅
   - [ ] `page.tsx` (Dashboard)
   - [ ] `AddEmployeeModal.tsx`
   - [ ] `EditEmployeeModal.tsx`
   - [ ] `ManageDepartments.tsx`
   - [ ] `AddDepartmentModal.tsx`
   - [ ] `AuthContext.tsx`

2. Add more hooks as needed
3. Write tests for hooks
4. Add loading indicators using hook states
5. Implement optimistic updates

---

## 📞 Support

For questions or issues with the new structure, refer to:
- `src/graphql/` - GraphQL operations
- `src/hooks/` - Custom hooks
- `src/lib/graphql-client.ts` - GraphQL client

Happy coding! 🎉

