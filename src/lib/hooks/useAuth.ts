import { useMutation, useQuery } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        if (!response.ok) return null
        return await response.json()
      } catch {
        return null
      }
    },
    retry: false,
  })
}

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
  })
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: ({ 
      email, 
      password, 
      name 
    }: { 
      email: string; 
      password: string; 
      name?: string 
    }) => authAPI.register(email, password, name),
  })
}

// Logout mutation
export function useLogout() {
  return useMutation({
    mutationFn: async () => authAPI.logout(),
  })
}