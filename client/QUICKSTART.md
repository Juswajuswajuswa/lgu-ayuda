# Quick Start Guide - Refactored Architecture

## 🚀 Quick Setup

No additional setup required! Zustand has been installed and all new architecture is ready to use.

## 📖 5-Minute Overview

### 1. Fetching Data (List Page)

```typescript
import { useGoods } from "@/src/hooks/query/goods/useGoods";

export default function GoodsPage() {
  const { data: response, isPending, isError } = useGoods();
  const goods = response?.data || [];

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (goods.length === 0) return <EmptyState />;

  return <DataTable data={goods} />;
}
```

### 2. Creating Data (Create Page)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goodsFormSchema } from "@/src/schema/forms/goods";
import { useCreateGoodsMutation } from "@/src/hooks/query/goods/useCreateGoodsMutation";
import { FormField } from "@/src/components/forms/common/FormField";

export default function CreateGoodsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goodsFormSchema),
    defaultValues: { product: { name: "", details: "" }, quantity: 1 },
  });

  const { mutate: createGoods, isPending } = useCreateGoodsMutation();

  return (
    <form onSubmit={handleSubmit((data) => createGoods(data))}>
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
  );
}
```

### 3. Editing Data (Edit Page)

```typescript
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGood } from "@/src/hooks/query/goods/useGood";
import { useUpdateGoodsMutation } from "@/src/hooks/query/goods/useUpdateGoodsMutation";

export default function EditGoodsPage() {
  const { id } = useParams();
  const { data: response } = useGood(id);
  const goods = response?.goods;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goodsFormSchema),
  });

  const { mutate: updateGoods, isPending } = useUpdateGoodsMutation(id);

  // Load data into form
  useEffect(() => {
    if (goods) reset({ product: goods.product, quantity: goods.quantity });
  }, [goods, reset]);

  return (
    <form onSubmit={handleSubmit((data) => updateGoods(data))}>
      {/* Form fields */}
    </form>
  );
}
```

### 4. Deleting Data (Delete Page)

```typescript
import { useParams } from "next/navigation";
import { useDeleteGoodsMutation } from "@/src/hooks/query/goods/useDeleteGoodsMutation";

export default function DeleteGoodsPage() {
  const { id } = useParams();
  const { mutate: deleteGoods, isPending } = useDeleteGoodsMutation();

  return (
    <Button
      variant="destructive"
      onClick={() => deleteGoods(id)}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
```

## 🎯 Common Patterns

### Using Auth State

```typescript
import { useUser, useIsAuthenticated } from "@/src/stores/selectors/auth";

function MyComponent() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <LoginPrompt />;
  return <div>Welcome, {user.firstName}!</div>;
}
```

### Custom Form Validation

```typescript
// src/schema/forms/mymodule.ts
import { z } from "zod";

export const myFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18+"),
});

export type MyFormData = z.infer<typeof myFormSchema>;
```

### Creating a New API Service

```typescript
// src/services/api/mymodule.service.ts
import { apiClient } from "./client";

export const myModuleService = {
  getAll: async () => apiClient.get("/my-module/all"),
  getById: async (id: string) => apiClient.get(`/my-module/${id}`),
  create: async (data) => apiClient.post("/my-module/create", data),
  update: async (id, data) => apiClient.put(`/my-module/${id}`, data),
  delete: async (id) => apiClient.delete(`/my-module/${id}`),
};
```

## 📂 Where to Find Things

| What                | Where                               |
| ------------------- | ----------------------------------- |
| API calls           | `src/services/api/*.service.ts`     |
| Data fetching hooks | `src/hooks/query/*/*.ts`            |
| Form validation     | `src/schema/forms/*.ts`             |
| API types           | `src/schema/api/*.ts`               |
| Form components     | `src/components/forms/common/*.tsx` |
| Auth state          | `src/stores/slices/auth.ts`         |
| Query keys          | `src/lib/query-client/keys.ts`      |

## 🔍 Examples in Codebase

### Fully Refactored (Use as Reference):

- ✅ `app/(private)/dashboard/goods/` - All CRUD operations
- ✅ `app/(private)/dashboard/barangay/` - All CRUD operations
- ✅ `components/login.tsx` - Form with validation

## 💡 Pro Tips

1. **Always use custom hooks** - Never call services directly in components
2. **Centralize query keys** - Add to `src/lib/query-client/keys.ts`
3. **Type everything** - Use Zod schemas and TypeScript inference
4. **Reuse FormField** - Don't recreate input components
5. **Check examples** - Goods and Barangay modules are complete references

## 🐛 Debugging

### Query not updating?

```typescript
// Make sure you're invalidating the right query key
queryClient.invalidateQueries({ queryKey: queryKeys.goods.all });
```

### Form not validating?

```typescript
// Ensure zodResolver is passed to useForm
const { register } = useForm({
  resolver: zodResolver(myFormSchema), // Don't forget this!
});
```

### TypeScript errors?

```typescript
// Make sure types are inferred from schemas
export type MyFormData = z.infer<typeof myFormSchema>;
```

## 📞 Need Help?

1. Read `ARCHITECTURE.md` for detailed patterns
2. Check `REFACTOR_SUMMARY.md` for what's been done
3. Look at `goods/` or `barangay/` pages as examples
4. Ask in team chat

---

**Happy coding! 🎉**
