import { render, screen } from '@testing-library/react'
import ProductCard from '../ProductCard'

const mockProduct = {
  id: 'prod_1',
  title: 'Test Product',
  slug: 'test-product',
  shortDescription: 'A test product description',
  longDescription: 'A longer test product description',
  price: 1000,
  currency: 'INR',
  images: ['/images/test.jpg'],
  artisanId: 'artisan_1',
  category: 'Test Category',
  createdAt: '2025-01-01',
  stock: 5
}

describe('ProductCard', () => {
  it('renders product title and price', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('₹1,000')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('shows low stock warning when stock is less than 5', () => {
    const lowStockProduct = { ...mockProduct, stock: 3 }
    render(<ProductCard product={lowStockProduct} />)
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument()
  })
})