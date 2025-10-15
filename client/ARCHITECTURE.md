# LGU Ayuda - Refactored Architecture Guide

## Overview

This application has been refactored to follow Howdy Studios best practices for modern React/Next.js applications. The new architecture emphasizes:

- **Type Safety**: End-to-end TypeScript with Zod validation
- **Separation of Concerns**: Clear boundaries between layers
- **Performance**: Optimized data fetching and caching
- **Maintainability**: Consistent patterns and reusable components
- **Developer Experience**: Intuitive file organization and naming

## Directory Structure

```
client/src/
├── services/api/          # API service layer
│   ├── client.ts          # Base axios instance with interceptors
│   ├── types.ts           # Shared API types
│   ├── auth.service.ts    # Authentication API calls
│   ├── goods.service.ts   # Goods CRUD operations
│   ├── barangay.service.ts # Barangay CRUD operations
│   └── users.service.ts   # Users/Staff CRUD operations
├── hooks/
│   ├── query/             # TanStack Query hooks by domain
│   │   ├── auth/          # useCheckAdmin, useLoginMutation, etc.
│   │   ├── goods/         # useGoods, useCreateGoodsMutation, etc.
│   │   ├── barangay/      # useBarangays, useCreateBarangayMutation, etc.
│   │   └── users/         # useUsers, useCreateUserMutation, etc.
│   ├── forms/             # Form-specific hooks (future)
│   └── common/            # Shared utility hooks (future)
├── schema/
│   ├── api/               # API request/response schemas
│   │   ├── auth.ts        # Login, signup schemas
│   │   ├── goods.ts       # Goods entity schemas
│   │   ├── barangay.ts    # Barangay entity schemas
│   │   └── users.ts       # User entity schemas
│   ├── forms/             # Form validation schemas
│   │   ├── auth.ts        # Login, signup form schemas
│   │   ├── goods.ts       # Goods form schema
│   │   ├── barangay.ts    # Barangay form schema
│   │   └── users.ts       # User form schemas
│   └── common/
│       └── base.ts        # Reusable schema primitives
├── stores/
│   ├── slices/            # Zustand store slices
│   │   ├── auth.ts        # Authentication state
│   │   └── ui.ts          # UI state (modals, notifications)
│   └── selectors/
│       └── auth.ts        # Memoized auth selectors
├── lib/
│   └── query-client/
│       ├── config.ts      # Query client configuration
│       └── keys.ts        # Centralized query keys
└── components/forms/
    └── common/            # Reusable form components
        ├── FormField.tsx  # Generic input field
        ├── FormSelect.tsx # Select dropdown
        └── FormTextarea.tsx # Textarea field
```

## Core Patterns

### 1. API Service Layer

All API calls go through service modules in `src/services/api/`:

```typescript
// Example: goods.service.ts
import { apiClient } from "./client";

export const goodsService = {
  getAll: async () => apiClient.get("/goods/get-goods"),
  getById: async (id: string) => apiClient.get(`/goods/get-good/${id}`),
  create: async (data) => apiClient.post("/goods/register-goods", data),
  update: async (id, data) => apiClient.put(`/goods/update-goods/${id}`, data),
  delete: async (id) => apiClient.delete(`/goods/delete-goods/${id}`),
};
```

### 2. TanStack Query Hooks

Data fetching uses custom hooks that wrap TanStack Query:

```typescript
// Example: useGoods.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-client/keys";
import { goodsService } from "@/src/services/api/goods.service";

export const useGoods = () => {
  return useQuery({
    queryKey: queryKeys.goods.all,
    queryFn: goodsService.getAll,
  });
};
```

Mutations handle create/update/delete with automatic cache invalidation:

```typescript
// Example: useCreateGoodsMutation.ts
export const useCreateGoodsMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => goodsService.create(data),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.goods.all });
      router.push("/dashboard/goods");
    },
  });
};
```

### 3. React Hook Form + Zod Validation

Forms use React Hook Form with Zod schema validation:

```typescript
// In component:
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<GoodsFormData>({
  resolver: zodResolver(goodsFormSchema),
  defaultValues: {
    product: { name: "", details: "" },
    quantity: 1,
  },
});

const { mutate: createGoods, isPending } = useCreateGoodsMutation();

const onSubmit = (data: GoodsFormData) => {
  createGoods(data);
};
```

### 4. Zustand State Management

Global state managed with Zustand:

```typescript
// Auth store
const { user, setUser, logout } = useAuthStore();

// Or use selectors
const user = useUser();
const isAuthenticated = useIsAuthenticated();
const isAdmin = useIsAdmin();
```

### 5. Centralized Query Keys

All query keys are centralized for consistency:

```typescript
// src/lib/query-client/keys.ts
export const queryKeys = {
  goods: {
    all: ["goods"] as const,
    detail: (id: string) => ["goods", "detail", id] as const,
  },
  barangay: {
    all: ["barangays"] as const,
    detail: (id: string) => ["barangays", "detail", id] as const,
  },
  // ... more domains
};
```

## Component Patterns

### List Page Pattern

```typescript
export default function GoodsPage() {
  const { data: response, isPending, isError } = useGoods();
  const goods = response?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goods</CardTitle>
        <CardAction>
          <Link href="/dashboard/goods/create">Add Goods</Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorMessage />
        ) : goods.length === 0 ? (
          <EmptyState />
        ) : (
          <DataTable data={goods} />
        )}
      </CardContent>
    </Card>
  );
}
```

### Create Page Pattern

```typescript
export default function CreateGoodsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goodsFormSchema),
  });

  const { mutate: createGoods, isPending } = useCreateGoodsMutation();

  const onSubmit = (data) => createGoods(data);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Product Name"
          error={errors.product?.name}
          required
          {...register("product.name")}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Card>
  );
}
```

### Edit Page Pattern

```typescript
export default function EditGoodsPage() {
  const { id } = useParams();
  const { data: response, isPending: isLoadingGoods } = useGood(id);
  const goods = response?.goods;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(goodsFormSchema),
  });

  const { mutate: updateGoods, isPending } = useUpdateGoodsMutation(id);

  // Load data into form
  useEffect(() => {
    if (goods) {
      reset({
        product: { name: goods.product.name, details: goods.product.details },
        quantity: goods.quantity,
      });
    }
  }, [goods, reset]);

  const onSubmit = (data) => updateGoods(data);

  if (isLoadingGoods) return <LoadingSpinner />;

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Form fields */}</form>;
}
```

### Delete Page Pattern

```typescript
export default function DeleteGoodsPage() {
  const { id } = useParams();
  const { mutate: deleteGoods, isPending } = useDeleteGoodsMutation();

  const handleDelete = () => deleteGoods(id);

  return (
    <Card>
      <CardDescription>
        Are you sure you want to delete this item?
      </CardDescription>
      <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
      <Button variant="outline" onClick={() => router.back()}>
        Cancel
      </Button>
    </Card>
  );
}
```

## Refactored Modules

### ✅ Completed:

- **Goods Module**: Full CRUD with React Hook Form + Zod
- **Barangay Module**: Full CRUD with React Hook Form + Zod
- **Staff Module**: List page refactored
- **Authentication**: Login page refactored

## Benefits of New Architecture

1. **Type Safety**: No more `any` types - full TypeScript coverage
2. **Validation**: Client-side validation with Zod schemas
3. **Caching**: Automatic query caching and invalidation
4. **Error Handling**: Consistent error handling across all API calls
5. **Loading States**: Proper loading, error, and empty states everywhere
6. **Code Reuse**: Reusable form components and hooks
7. **Maintainability**: Clear separation of concerns
8. **Performance**: Optimized re-renders with React Hook Form

## Migration Guide

### Before (Old Pattern):

```typescript
const [formData, setFormData] = useState({ name: "" });

const { mutate, isPending } = useMutation({
  mutationFn: async (data) => {
    const res = await axiosInstance.post("/api/endpoint", data);
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
  },
});
```

### After (New Pattern):

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(itemFormSchema),
});

const { mutate, isPending } = useCreateItemMutation();

const onSubmit = (data) => mutate(data);
```

## Next Steps

### To Add a New Module:

1. **Create API Service** (`src/services/api/module.service.ts`)
2. **Create Schemas** (`src/schema/api/module.ts` and `src/schema/forms/module.ts`)
3. **Create Query Hooks** in `src/hooks/query/module/`
   - `useModules.ts` - list all
   - `useModule.ts` - get single
   - `useCreateModuleMutation.ts`
   - `useUpdateModuleMutation.ts`
   - `useDeleteModuleMutation.ts`
4. **Add Query Keys** to `src/lib/query-client/keys.ts`
5. **Create Pages** following the patterns above

## Common Issues & Solutions

### Issue: Form not validating

**Solution**: Ensure your schema matches the form structure exactly and use `zodResolver`.

### Issue: Cache not updating after mutation

**Solution**: Call `queryClient.invalidateQueries()` in the mutation's `onSuccess` handler.

### Issue: TypeScript errors with API responses

**Solution**: Define proper response schemas in `src/schema/api/` and use type inference.

### Issue: Infinite re-renders

**Solution**: Use React Hook Form's `register` instead of controlled components.

## Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)

---

**Last Updated**: October 2025  
**Refactored By**: Howdy Studios Standards Implementation
