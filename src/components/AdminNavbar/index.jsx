import { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { MdEmail, MdDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Container, Header, Hr, Item, Logo, Notification, Point } from "./styles";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FlexRow, Text } from "../../styles/layout";
import { COLORS } from "../../styles/colors";
import { useAuth } from "../../context/auth";
import DropDown from "../DropDown";
import Profile from "./Buttons/Profile";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";

function AdminNavbar({ setIsOpen }) {
  const { logout } = useAuth();
  const [userDrop, setUserDrop] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
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
          onClick={() => navigate("/admin")}
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
        <Notification>
          <IoNotifications 
            size={25}
            color={COLORS.white}
          />
          <Point />
        </Notification>
        <Notification>
          <MdEmail 
            size={25}
            color={COLORS.white}
          />
          <Point />
        </Notification>
        <DropDown
          isOpen={userDrop}
          Button={Profile}
          setIsOpen={setUserDrop}
          buttonData={{ user }}
          rightPosition={"-1rem"}
        >
          <Header>Menú</Header>
          <Item onClick={() => navigate("/admin/perfil")}>
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
