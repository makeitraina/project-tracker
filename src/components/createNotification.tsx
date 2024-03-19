"use client"
import { createNotification } from '@/actions/createNotification';
import { useSearchParams } from 'next/navigation';

export function CreateNotificationButton() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const handleCreateNotification = async () => {
    if (token) {
      await createNotification(token);
    }
  };
  return (
    <div>
      <button onClick={handleCreateNotification}>Create Notification</button>
    </div>
  );
}