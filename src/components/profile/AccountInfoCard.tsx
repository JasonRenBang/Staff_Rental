import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserProfile } from '@/types/user'

interface AccountInfoCardProps {
  userProfile: UserProfile
}

export default function AccountInfoCard({ userProfile }: AccountInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="font-medium">{userProfile.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div>
              <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                {userProfile.role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
