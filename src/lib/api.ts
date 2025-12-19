const API_URL =  ''

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth-token')
}

// Set auth token to localStorage AND cookie
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  
  // Store in localStorage
  localStorage.setItem('auth-token', token)
  
  // Store in cookie for middleware access
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
}

// Remove auth token
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  
  // Remove from localStorage
  localStorage.removeItem('auth-token')
  
  // Remove from cookie
  document.cookie = 'auth-token=; path=/; max-age=0'
}

// Get current user from token
export function getCurrentUser() {
  const token = getAuthToken()
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch {
    return null
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

// Check if user is admin
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'ADMIN'
}

// Generic API request helper
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return data
  },

  register: async (email: string, password: string, name?: string) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    })
    
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return data
  },

  logout: () => {
    removeAuthToken()
  }
}

// Products API calls
export const productsAPI = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    
    const query = queryParams.toString()
    return apiRequest(`/api/products${query ? `?${query}` : ''}`)
  },

  getById: async (id: string) => {
    return apiRequest(`/api/products/${id}`)
  },

  create: async (product: {
    name: string
    description?: string
    price: number
    category: string
    imageUrl?: string
    stock?: number
  }) => {
    return apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    })
  },

  update: async (id: string, product: Partial<{
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    stock: number
    isActive: boolean
  }>) => {
    return apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/api/products/${id}`, {
      method: 'DELETE'
    })
  }
}