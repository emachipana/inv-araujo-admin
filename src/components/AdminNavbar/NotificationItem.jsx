import { useNavigate } from "react-router-dom";
import { Hr, NotificationItemContainer, Point } from "./styles";
import { FaShoppingBag, FaCalendar } from "react-icons/fa";
import { RiPlantFill, RiCheckDoubleFill } from "react-icons/ri";
import { IoPersonCircleSharp, IoPersonAdd } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { COLORS } from "../../styles/colors";
import { FlexRow, Text } from "../../styles/layout";
import { useAdmin } from "../../context/admin";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";

function NotificationItem({ notification }) {
  const { id, type, message, isRead, redirectTo } = notification;
  const { markAsRead } = useAdmin();
  const navigate = useNavigate();

  const icons = {
    NEW_VITRO_ORDER: RiPlantFill,
    NEW_ORDER: FaShoppingBag,
    NEW_CONTACT_MESSAGE: IoPersonCircleSharp,
    NEW_USER: IoPersonAdd,
    PROX_VITRO_ORDER: FaCalendar,
    PROX_ORDER: FaCalendar,
    NEW_ORDER_MESSAGE: FaMessage,
    NEW_VITROORDER_MESSAGE: FaMessage,
  }

  const colors = {
    NEW_VITRO_ORDER: COLORS.persian,
    NEW_ORDER: COLORS.blue,
    NEW_CONTACT_MESSAGE: COLORS.dim,
    NEW_USER: COLORS.orange,
    PROX_VITRO_ORDER: COLORS.red,
    PROX_ORDER: COLORS.red,
    NEW_ORDER_MESSAGE: COLORS.blue,
    NEW_VITROORDER_MESSAGE: COLORS.persian,
  }

  const Icon = icons[type];

  const onRead = async (e) => {
    if(isRead) return;

    e.stopPropagation();

    try {
      await markAsRead(id);
    }catch(e) {
      toast.error(errorParser(e.message));
    }
  }

  return (
    <>
      <NotificationItemContainer
        onClick={() => navigate(redirectTo)}
      >
        <FlexRow>
          {
            !isRead
            &&
            <Point
              size={10}
            />
          }
          <Icon 
            size={20}
            color={colors[type]}
            style={{marginTop: "-2px"}}
          />
          <Text
            size={16}
            weight={600}
          >
            { message }
          </Text>
        </FlexRow>
        <RiCheckDoubleFill
          onClick={onRead}
          size={28}
          color={isRead ? COLORS.persian : COLORS.dim}
        />
      </NotificationItemContainer>
      <Hr />
    </>
  );
}

export default NotificationItem;
