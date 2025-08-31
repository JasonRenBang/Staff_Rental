import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
  } from 'firebase/auth'
  import type { User as FirebaseUser } from 'firebase/auth'
  import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
  } from 'firebase/firestore'
  import { auth, db } from '@/lib/firebase'
  import type { LoginInput, RegisterInput, UserProfile } from '@/types/user'
  
  // Sign in with email and password
  export const signIn = async ({ email, password }: LoginInput): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }
  
  // Register new user
  export const register = async ({ 
    email, 
    password, 
    displayName, 
    department, 
    phone 
  }: RegisterInput): Promise<FirebaseUser> => {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
  
    // Update auth profile
    await updateProfile(user, { displayName })
  
    // Create user profile in Firestore
    const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role: 'staff', // Default role
      department,
      phone,
    }
  
    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  
    return user
  }
  
  // Sign out
  export const signOutUser = async (): Promise<void> => {
    await signOut(auth)
  }
  
  // Get user profile
  export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  }
  
  // Update user profile
  export const updateUserProfile = async (
    uid: string, 
    updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> => {
    const docRef = doc(db, 'users', uid)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  }
  
  // Subscribe to auth state changes
  export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback)
  }