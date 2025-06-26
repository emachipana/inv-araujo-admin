import React, { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Container, Header, Hr, Item, Logo } from "./styles";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FlexRow, Text } from "../../styles/layout";
import { COLORS } from "../../styles/colors";
import { useAuth } from "../../context/auth";
import DropDown from "../DropDown";
import Profile from "./Buttons/Profile";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useAdmin } from "../../context/admin";
import NotificationButton from "./Buttons/Notification";
import NotificationItem from "./NotificationItem";

function AdminNavbar({ setIsOpen }) {
  const { logout } = useAuth();
  const [userDrop, setUserDrop] = useState(false);
  const [notiDrop, setNotiDrop] = useState(true);
  const [isNotiLoading, setIsNotiLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, loadNotifications } = useAdmin();

  const nonReadNotifications = notifications.filter((noti) => !noti.isRead)?.length;

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsNotiLoading(true);
        await loadNotifications();
        setIsNotiLoading(false);
      }catch(e) {
        setIsNotiLoading(false);
      }
    }

    fetch();
  }, [loadNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <Container>
      <HiOutlineMenuAlt2
        size={28}
        color={COLORS.white}
        style={{cursor: "pointer"}}
        className="activer"
        onClick={() => setIsOpen(true)}
      />
      <FlexRow
        gap={3.5}
      >
        <FlexRow
          onClick={() => navigate("/")}
          style={{cursor: "pointer"}}
        >
          <Logo 
            alt="logo"
            src="/img/logo_min.png"
          />
          <Text
            color={COLORS.white}
            weight={800}
            size={18}
          >
            Inversiones Araujo
          </Text>
        </FlexRow>
      </FlexRow>
      <FlexRow gap={1.5}>
        <DropDown
          isOpen={notiDrop}
          Button={NotificationButton}
          setIsOpen={setNotiDrop}
          buttonData={{ isNotiLoading }}
          rightPosition={"-0.5rem"}
        >
          <Header style={{minWidth: "220px"}}>
            {
              nonReadNotifications <= 0
              ? "Notificaciones"
              : `Tienes ${nonReadNotifications} notificaciones`
            }
          </Header>
          {
            notifications.length <= 0
            ? <Text
                style={{marginTop: "1rem"}}
                size={18}
                weight={700}
              >
                Sin notificaciones por ahora
              </Text>
            : notifications.map((noti, index) => (
                <NotificationItem 
                  key={index}
                  notification={noti}
                />
              ))
          }
        </DropDown>
        <DropDown
          isOpen={userDrop}
          Button={Profile}
          setIsOpen={setUserDrop}
          buttonData={{ user }}
          rightPosition={"-1rem"}
        >
          <Header>Menú</Header>
          <Item onClick={() => navigate("/perfil")}>
            <FaUser
              size={18}
              style={{marginTop: "-2px"}}
            />
            <Text
              size={16}
              weight={600}
            >
              Perfil
            </Text>
          </Item>
          <Hr />
          <Item>
            <MdDarkMode
              size={18}
              style={{marginTop: "-2px"}}
            />
            <Text
              size={16}
              weight={600}
            >
              Tema
            </Text>
          </Item>
          <Hr />
          <Item onClick={handleLogout}>
            <RiLogoutBoxFill
              size={18}
              style={{marginTop: "-2px"}}
            />
            <Text
              size={16}
              weight={600}
            >
              Salir
            </Text>
          </Item>
        </DropDown>
      </FlexRow>
    </Container>
  );
}

export default AdminNavbar;
