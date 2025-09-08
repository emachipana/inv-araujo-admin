import { useNavigate } from "react-router-dom";
import { Hr, NotificationItemContainer, Point } from "./styles";
import { FaShoppingBag, FaCalendar } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { IoPersonCircleSharp, IoPersonAdd } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { COLORS } from "../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../styles/layout";
import { useAdmin } from "../../context/admin";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MdCancel } from "react-icons/md";

function NotificationItem({ notification }) {
  const { id, type, message, isRead, redirectTo, createdAt } = notification;
  const { markAsRead } = useAdmin();
  const navigate = useNavigate();
  
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true,
    locale: es 
  }) : '';

  const data = {
    NEW_VITRO_ORDER: {
      icon: RiPlantFill,
      color: COLORS.persian,
    },
    NEW_ORDER: {
      icon: FaShoppingBag,
      color: COLORS.blue,
    },
    NEW_CONTACT_MESSAGE: {
      icon: IoPersonCircleSharp,
      color: COLORS.dim,
    },
    NEW_USER: {
      icon: IoPersonAdd,
      color: COLORS.orange,
    },
    PROX_VITRO_ORDER: {
      icon: FaCalendar,
      color: COLORS.red,
    },
    PROX_ORDER: {
      icon: FaCalendar,
      color: COLORS.red,
    },
    NEW_ORDER_MESSAGE: {
      icon: FaMessage,
      color: COLORS.blue,
    },
    NEW_VITROORDER_MESSAGE: {
      icon: FaMessage,
      color: COLORS.persian,
    },
    CANCEL_ORDER_REQUEST: {
      icon: MdCancel,
      color: COLORS.red,
    }
  }

  const Icon = data[type].icon;
  const color = data[type].color;

  const onRead = async (e) => {
    if(isRead) return;

    try {
      await markAsRead(id);
    }catch(e) {
      toast.error(errorParser(e.message));
    }
  }

  const onClick = async (e) => {
    e.stopPropagation();
    navigate(redirectTo);
    await onRead();
  }

  return (
    <>
      <NotificationItemContainer
        onClick={onClick}
      >
        <FlexRow>
          {
            !isRead
            &&
            <Point
              top={8}
              right={16}
              size={10}
            />
          }
          <Icon 
            size={20}
            color={color}
            style={{marginTop: "-2px"}}
          />
          <FlexColumn
            gap={0.1}
          >
            <Text
              size={16}
              weight={600}
            >
              { message }
            </Text>
            <Text
              size={13}
              color={COLORS.dim}
            >
              { timeAgo }
            </Text>
          </FlexColumn>
        </FlexRow>
      </NotificationItemContainer>
      <Hr />
    </>
  );
}

export default NotificationItem;
