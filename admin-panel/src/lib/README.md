# Admin Panel Component Library

A comprehensive Vue 3 component library built with TypeScript and Tailwind CSS for admin panel applications.

## Installation

```typescript
// Import all components
import * from '@/lib/components'

// Import specific components
import { Button, Input, Modal, Card, Table } from '@/lib/components'

// Import by category
import { Button, Input, Modal } from '@/lib/components/ui'
import { FormField, Select } from '@/lib/components/form'
import { Table } from '@/lib/components/data'
```

## Components

### UI Components

#### Button
A versatile button component with multiple variants and sizes.

```vue
<template>
  <!-- Basic usage -->
  <Button>Click me</Button>
  
  <!-- With variants -->
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="danger">Delete</Button>
  
  <!-- With sizes -->
  <Button size="sm">Small</Button>
  <Button size="lg">Large</Button>
  
  <!-- With loading state -->
  <Button :loading="isLoading" loading-text="Saving...">
    Save Changes
  </Button>
  
  <!-- With icons -->
  <Button>
    <template #icon-left>
      <PlusIcon class="w-4 h-4" />
    </template>
    Add User
  </Button>
</template>
```

#### Input
A flexible input component with validation support.

```vue
<template>
  <Input
    v-model="email"
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    :error="emailError"
    hint="We'll never share your email"
    required
  />
  
  <!-- With custom icon -->
  <Input v-model="search" placeholder="Search...">
    <template #icon>
      <SearchIcon class="w-4 h-4" />
    </template>
  </Input>
  
  <!-- With action button -->
  <Input v-model="password" type="password">
    <template #action>
      <button @click="togglePassword">
        <EyeIcon class="w-4 h-4" />
      </button>
    </template>
  </Input>
</template>
```

#### Modal
A responsive modal component with animations.

```vue
<template>
  <Modal
    :show="showModal"
    title="Create User"
    size="lg"
    @close="showModal = false"
  >
    <p>Modal content goes here...</p>
    
    <template #footer>
      <Button variant="secondary" @click="showModal = false">
        Cancel
      </Button>
      <Button @click="handleSave">
        Save
      </Button>
    </template>
  </Modal>
</template>
```

#### Card
A container component for grouping related content.

```vue
<template>
  <Card
    title="User Statistics"
    subtitle="Overview of user activity"
    variant="elevated"
    hover
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold">1,234</p>
        <p class="text-sm text-gray-600">Total Users</p>
      </div>
    </div>
    
    <template #footer>
      <Button variant="ghost" size="sm">
        View Details
      </Button>
    </template>
  </Card>
</template>
```

#### Badge
A small status indicator component.

```vue
<template>
  <Badge variant="success">Active</Badge>
  <Badge variant="warning" size="lg">Pending</Badge>
  <Badge variant="danger" rounded>
    <template #icon>
      <XIcon class="w-3 h-3" />
    </template>
    Inactive
  </Badge>
</template>
```

### Form Components

#### FormField
A wrapper component for form inputs with consistent styling.

```vue
<template>
  <FormField
    label="Full Name"
    :error="nameError"
    hint="Enter your first and last name"
    required
  >
    <Input
      v-model="name"
      placeholder="John Doe"
    />
  </FormField>
</template>
```

#### Select
A dropdown select component with option support.

```vue
<template>
  <Select
    v-model="selectedRole"
    label="User Role"
    :options="roleOptions"
    placeholder="Select a role"
    required
  />
</template>

<script setup>
const roleOptions = [
  { label: 'Administrator', value: 'ADMIN' },
  { label: 'Moderator', value: 'MODERATOR' },
  { label: 'User', value: 'USER' }
]
</script>
```

### Data Components

#### Table
A feature-rich table component with sorting and custom slots.

```vue
<template>
  <Table
    :columns="columns"
    :data="users"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    hoverable
    @sort="handleSort"
    @row-click="handleRowClick"
  >
    <!-- Custom cell content -->
    <template #cell-status="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'danger'">
        {{ value }}
      </Badge>
    </template>
    
    <template #cell-actions="{ item }">
      <div class="flex space-x-2">
        <Button size="sm" variant="ghost" @click="editUser(item)">
          Edit
        </Button>
        <Button size="sm" variant="danger" @click="deleteUser(item)">
          Delete
        </Button>
      </div>
    </template>
  </Table>
</template>

<script setup>
const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'status', title: 'Status' },
  { key: 'actions', title: 'Actions', align: 'right' }
]
</script>
```

## Utility Functions

The library also provides helpful utility functions:

```typescript
import { formatCurrency, formatDate, formatNumber, truncateText } from '@/lib'

// Format currency
formatCurrency(1234.56) // "$1,234.56"

// Format dates
formatDate(new Date()) // "Jan 15, 2024"
formatDate(new Date(), { month: 'long' }) // "January 15, 2024"

// Format numbers
formatNumber(1234567) // "1,234,567"

// Truncate text
truncateText("This is a long text", 10) // "This is a..."
```

## Styling

All components use Tailwind CSS classes and follow a consistent design system:

- **Colors**: Purple/Blue gradient for primary actions
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with proper font weights
- **Borders**: Rounded corners with subtle shadows
- **Animations**: Smooth transitions and hover effects

## TypeScript Support

All components are fully typed with TypeScript interfaces:

```typescript
import type { ButtonProps, InputProps, ModalProps } from '@/lib/components'

// Component props are fully typed
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  loading: false
}
```

## Best Practices

1. **Consistent Styling**: Use the provided components instead of custom HTML elements
2. **Proper Validation**: Combine FormField with validation libraries like VeeValidate
3. **Accessibility**: All components include proper ARIA attributes
4. **Performance**: Components are optimized with proper Vue 3 patterns
5. **Reusability**: Build complex components by composing library components

## Examples

Check the `/examples` directory for complete implementation examples of:
- User management forms
- Data tables with filtering
- Modal workflows
- Dashboard layouts
