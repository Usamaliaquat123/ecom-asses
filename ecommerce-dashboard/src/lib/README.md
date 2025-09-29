# Ecommerce Dashboard Component Library

A comprehensive React/Next.js component library built with TypeScript and Tailwind CSS for ecommerce dashboard applications.

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
import { Sidebar, Header } from '@/lib/components/layout'
```

## Components

### UI Components

#### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/lib/components'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading loadingText="Saving...">
  Save Changes
</Button>

// With icons
<Button leftIcon={<PlusIcon className="w-4 h-4" />}>
  Add Item
</Button>
```

#### Input
A flexible input component with validation support.

```tsx
import { Input } from '@/lib/components'

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={emailError}
  hint="We'll never share your email"
  required
/>

// With icons
<Input
  placeholder="Search..."
  leftIcon={<SearchIcon className="w-4 h-4" />}
/>

// With action button
<Input
  type="password"
  rightAction={
    <button onClick={togglePassword}>
      <EyeIcon className="w-4 h-4" />
    </button>
  }
/>
```

#### Card
A container component for grouping related content.

```tsx
import { Card } from '@/lib/components'

<Card
  title="Sales Overview"
  subtitle="Last 30 days performance"
  variant="elevated"
  hover
>
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-2xl font-bold">$12,345</p>
      <p className="text-sm text-gray-600">Revenue</p>
    </div>
  </div>
</Card>

// With custom header and footer
<Card
  header={
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Custom Header</h3>
      <Button size="sm">Action</Button>
    </div>
  }
  footer={
    <div className="flex justify-end">
      <Button variant="ghost">View Details</Button>
    </div>
  }
>
  Card content here...
</Card>
```

#### Modal
A responsive modal component with animations.

```tsx
import { Modal, Button } from '@/lib/components'

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Create Product"
  size="lg"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Product
      </Button>
    </>
  }
>
  <p>Modal content goes here...</p>
</Modal>
```

#### Badge
A small status indicator component.

```tsx
import { Badge } from '@/lib/components'

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="lg">Pending</Badge>
<Badge variant="danger" rounded>Inactive</Badge>

// Dot variant
<Badge dot variant="success">Online</Badge>
```

### Form Components

#### FormField
A wrapper component for form inputs with consistent styling.

```tsx
import { FormField, Input } from '@/lib/components'

<FormField
  label="Product Name"
  error={nameError}
  hint="Enter a descriptive product name"
  required
>
  <Input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter product name"
  />
</FormField>
```

#### Select
A dropdown select component with option support.

```tsx
import { Select } from '@/lib/components'

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' }
]

<Select
  label="Category"
  options={categoryOptions}
  placeholder="Select a category"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  required
/>
```

### Data Components

#### Table
A feature-rich table component with sorting and custom rendering.

```tsx
import { Table, Badge, Button } from '@/lib/components'

const columns = [
  { key: 'name', title: 'Product Name', sortable: true },
  { key: 'price', title: 'Price', align: 'right' as const },
  { 
    key: 'status', 
    title: 'Status',
    render: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'danger'}>
        {value}
      </Badge>
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    render: (_, item) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="ghost" onClick={() => editProduct(item)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => deleteProduct(item)}>
          Delete
        </Button>
      </div>
    )
  }
]

<Table
  columns={columns}
  data={products}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSort={handleSort}
  onRowClick={handleRowClick}
  hoverable
  emptyText="No products found"
/>
```

### Layout Components

#### Sidebar
A responsive sidebar navigation component.

```tsx
import { Sidebar } from '@/lib/components'
import { HomeIcon, ShoppingCartIcon, UsersIcon } from '@heroicons/react/24/outline'

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    label: 'Products',
    href: '/products',
    icon: <ShoppingCartIcon className="w-5 h-5" />,
    badge: '12'
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: <UsersIcon className="w-5 h-5" />
  }
]

<Sidebar
  items={sidebarItems}
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
  logo={
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-purple-600 rounded-lg" />
      <span className="font-bold text-gray-900">Dashboard</span>
    </div>
  }
/>
```

#### Header
A page header component with breadcrumbs and actions.

```tsx
import { Header } from '@/lib/components'
import { ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline'

<Header
  title="Products"
  subtitle="Manage your product inventory"
  icon={<ShoppingCartIcon className="w-6 h-6" />}
  breadcrumbs={[
    { label: 'Dashboard', href: '/' },
    { label: 'Products' }
  ]}
  actions={[
    {
      label: 'Add Product',
      icon: <PlusIcon className="w-4 h-4" />,
      onClick: () => setShowCreateModal(true),
      variant: 'primary'
    },
    {
      label: 'Export',
      onClick: handleExport,
      variant: 'secondary'
    }
  ]}
/>
```

## Utility Functions

The library also provides helpful utility functions:

```typescript
import { 
  formatCurrency, 
  formatDate, 
  formatNumber, 
  formatPercentage,
  truncateText,
  debounce,
  throttle 
} from '@/lib'

// Format currency
formatCurrency(1234.56) // "$1,234.56"

// Format dates
formatDate(new Date()) // "Jan 15, 2024"
formatDate(new Date(), { month: 'long' }) // "January 15, 2024"

// Format numbers
formatNumber(1234567) // "1,234,567"

// Format percentages
formatPercentage(23.456) // "23.5%"

// Truncate text
truncateText("This is a long product name", 20) // "This is a long produ..."

// Debounce function calls
const debouncedSearch = debounce((query: string) => {
  // Search logic
}, 300)

// Throttle function calls
const throttledScroll = throttle(() => {
  // Scroll logic
}, 100)
```

## Styling

All components use Tailwind CSS classes and follow a consistent design system:

- **Colors**: Purple/Blue gradient for primary actions
- **Spacing**: Consistent padding and margins using Tailwind scale
- **Typography**: Clear hierarchy with proper font weights
- **Borders**: Rounded corners (rounded-xl) with subtle shadows
- **Animations**: Smooth transitions and hover effects

## TypeScript Support

All components are fully typed with TypeScript interfaces:

```typescript
import type { 
  ButtonProps, 
  InputProps, 
  ModalProps, 
  TableColumn,
  SidebarItem 
} from '@/lib/components'

// Component props are fully typed
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  loading: false
}
```

## Best Practices

1. **Consistent Styling**: Use the provided components instead of custom HTML elements
2. **Proper Validation**: Combine FormField with form validation libraries
3. **Accessibility**: All components include proper ARIA attributes and keyboard navigation
4. **Performance**: Components are optimized with React best practices
5. **Reusability**: Build complex components by composing library components

## Examples

Check the `/examples` directory for complete implementation examples of:
- Product management dashboard
- Customer data tables
- Order processing forms
- Analytics dashboards
- Responsive layouts

## Integration with Existing Code

To integrate with your existing ecommerce dashboard:

1. **Replace existing components** with library components
2. **Update imports** to use the new library structure
3. **Maintain existing functionality** while gaining consistency
4. **Gradually migrate** components as needed

Example migration:

```tsx
// Before
import { Button } from '../components/ui/Button'

// After
import { Button } from '@/lib/components'
```
