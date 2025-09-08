import { IoNotifications } from "react-icons/io5";
import { Notification, Point } from "../styles";
import { Spinner } from "reactstrap";
import { useAdmin } from "../../../context/admin";
import { COLORS } from "../../../styles/colors";

function NotificationButton({ isNotiLoading }) {
  const { notifications } = useAdmin();

  const nonReadNotifications = notifications.filter((noti) => !noti.isRead)?.length;

  return (
    <Notification>
      {
        isNotiLoading
        ? <Spinner size="sm" color="light" />
        : <>
            <IoNotifications
              size={25}
              color={COLORS.white}
            />
            {
              nonReadNotifications > 0
              &&
              <Point>
                {nonReadNotifications}
              </Point>
            }
          </>
      }
    </Notification>
  );
}

export default NotificationButton;
