import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { updateUserProfile, signOutUser } from '@/lib/authApi'
import type { UserProfile } from '@/types/user'
import AccountInfoCard from '@/components/profile/AccountInfoCard'
import ProfileEditForm from '@/components/profile/ProfileEditForm'

type ProfileFormData = Pick<UserProfile, 'displayName' | 'department' | 'phone'>

export default function Profile() {
  const { user, userProfile, setUserProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsLoading(true)
    try {
      await updateUserProfile(user.uid, data)

      // Update local store
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...data,
          updatedAt: new Date(),
        })
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <AccountInfoCard userProfile={userProfile} />

        {/* Edit Profile Form */}
        <ProfileEditForm userProfile={userProfile} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
