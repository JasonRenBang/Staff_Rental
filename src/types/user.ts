export interface User {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface UserProfile {
    uid: string
    email: string
    displayName: string
    role: 'admin' | 'staff'
    department?: string
    phone?: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface LoginInput {
    email: string
    password: string
  }
  
  export interface RegisterInput {
    email: string
    password: string
    displayName: string
    department?: string
    phone?: string
  }


