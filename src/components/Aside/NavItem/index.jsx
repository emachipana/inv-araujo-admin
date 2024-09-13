import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { Container } from "./styles";
import { FlexRow, Text } from "../../../styles/layout";
import { useAuth } from "../../../context/auth";

function NavItem({ Icon, children, redirectTo, setIsOpen, isOpen, isLogout, isActive }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    if(isOpen) setIsOpen(false);
    if(isLogout) logout();
    navigate(redirectTo);
  }

  return (
    <Container
      onClick={handleClick}
      isActive={isActive || (pathname === redirectTo)}
    >
      <FlexRow gap={0.8}>
        <Icon
          style={{marginTop: "-3px"}}
          size={19}
        />
        <Text
          size={16}
          weight={700}
        >
          { children }
        </Text>
      </FlexRow>
      {
        !isLogout
        &&
        <FaChevronRight 
          size={14}
        />
      }
    </Container>
  );
}

export default NavItem;
