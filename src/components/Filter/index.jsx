import { FaListUl } from "react-icons/fa";
import { FlexRow } from "../../styles/layout";
import { Container, Group, Wrapper } from "./styles";
import { HiSquares2X2 } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";

function Filter({ setModal, textButton, localStorageKey, setType, type }) {
  const handleClick = (type) => {
    setType(type);
    localStorage.setItem(localStorageKey, type);
  }

  return (
    <Container>
      <FlexRow gap={0.8}>
        <Group>
          <Wrapper
            isActive={type === "list"} 
            onClick={() => handleClick("list")}
          >
            <FaListUl
              size={17}
            />
          </Wrapper>
          <Wrapper 
            isActive={type === "group"}
            onClick={() => handleClick("group")}
          >
            <HiSquares2X2
              size={19}
            />
          </Wrapper>
        </Group>
        <Wrapper>
          <IoSearchOutline
            size={25}
          />
        </Wrapper>
      </FlexRow>
      <Button
        onClick={() => setModal(modal => !modal)}
        fontSize={15}
        Icon={IoMdAddCircleOutline}
        iconSize={18}
      >
        { textButton }
      </Button>
    </Container>
  );
}

export default Filter;
