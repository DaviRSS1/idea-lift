import { auth } from "../_lib/auth";
import { getUnreadNotifications } from "../_lib/data-service";
import NotificationsClient from "./NotificationsClient";

export default async function Notifications() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const unread = await getUnreadNotifications(Number(session.user.id));

  return (
    <NotificationsClient
      unreadCount={unread.length}
      userId={Number(session.user.id)}
    />
  );
}
