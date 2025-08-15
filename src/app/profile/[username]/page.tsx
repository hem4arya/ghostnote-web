/**
 * Dynamic User Profile Page
 * Route: /profile/[username]
 */

import { UserProfilePage } from '@/components/user-profile';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  return <UserProfilePage username={username} />;
}