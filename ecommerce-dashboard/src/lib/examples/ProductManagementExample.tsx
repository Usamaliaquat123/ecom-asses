'use client'

import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Modal,
  Card,
  Table,
  Badge,
  FormField,
  Header
} from '@/lib/components'
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  PackageIcon
} from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  createdAt: string
}

const ProductManagementExample: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 99.99,
      stock: 45,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      category: 'Clothing',
      price: 24.99,
      stock: 120,
      status: 'active',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'JavaScript Guide',
      category: 'Books',
      price: 39.99,
      stock: 0,
      status: 'inactive',
      createdAt: '2024-01-13'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  })

  // Form data
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active' as 'active' | 'inactive'
  })

  const [errors, setErrors] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  })

  // Options
  const categoryOptions = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Books', value: 'Books' },
    { label: 'Home & Garden', value: 'Home & Garden' }
  ]

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  // Table columns
  const columns = [
    { 
      key: 'name', 
      title: 'Product Name', 
      sortable: true 
    },
    { 
      key: 'category', 
      title: 'Category', 
      sortable: true 
    },
    { 
      key: 'price', 
      title: 'Price', 
      align: 'right' as const,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'stock', 
      title: 'Stock', 
      align: 'center' as const,
      render: (value: number) => (
        <Badge variant={value > 0 ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: (_: any, item: Product) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditProduct(item)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteProduct(item)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  // Computed
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.category.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesStatus = !filters.status || product.status === filters.status
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Methods
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }))
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }))
  }

  const handleSort = (column: any, order: 'asc' | 'desc') => {
    setSortBy(column.key)
    setSortOrder(order)
  }

  const handleRowClick = (product: Product) => {
    console.log('Product clicked:', product)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: newProduct.name ? '' : 'Product name is required',
      category: newProduct.category ? '' : 'Category is required',
      price: newProduct.price && !isNaN(Number(newProduct.price)) ? '' : 'Valid price is required',
      stock: newProduct.stock && !isNaN(Number(newProduct.stock)) ? '' : 'Valid stock quantity is required'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleCreateProduct = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        status: newProduct.status,
        createdAt: new Date().toISOString()
      }

      setProducts(prev => [...prev, product])
      setNewProduct({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'active'
      })
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!validateForm() || !editingProduct) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        status: newProduct.status
      }

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setShowEditModal(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const ProductForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Product Name"
          error={errors.name}
          required
        >
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
          />
        </FormField>
        
        <FormField
          label="Category"
          error={errors.category}
          required
        >
          <Select
            value={newProduct.category}
            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
            options={categoryOptions}
            placeholder="Select category"
          />
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Price"
          error={errors.price}
          required
        >
          <Input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            leftIcon="$"
          />
        </FormField>
        
        <FormField
          label="Stock Quantity"
          error={errors.stock}
          required
        >
          <Input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="0"
          />
        </FormField>
      </div>
      
      <FormField
        label="Status"
        required
      >
        <Select
          value={newProduct.status}
          onChange={(e) => setNewProduct(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
          options={statusOptions}
        />
      </FormField>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        title="Product Management"
        subtitle="Manage your product inventory"
        icon={<PackageIcon className="w-6 h-6" />}
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
          }
        ]}
      />

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearch}
            leftIcon={<SearchIcon className="w-4 h-4" />}
          />
          
          <Select
            placeholder="Filter by category"
            value={filters.category}
            onChange={handleCategoryFilter}
            options={[{ label: 'All Categories', value: '' }, ...categoryOptions]}
          />
          
          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={handleStatusFilter}
            options={[{ label: 'All Status', value: '' }, ...statusOptions]}
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredProducts}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
          hoverable
          emptyText="No products found"
        />
      </Card>

      {/* Create Product Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Product"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            
            <Button
              loading={isLoading}
              loadingText="Creating..."
              onClick={handleCreateProduct}
            >
              Create Product
            </Button>
          </>
        }
      >
        <ProductForm />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            
            <Button
              loading={isLoading}
              loadingText="Updating..."
              onClick={handleUpdateProduct}
            >
              Update Product
            </Button>
          </>
        }
      >
        <ProductForm />
      </Modal>
    </div>
  )
}

export default ProductManagementExample
