import { useState } from "react";
import { COLORS } from "../../styles/colors";
import { FlexColumn, Text } from "../../styles/layout";
import CheckBox from "../Input/CheckBox";
import { Content, Section, Title } from "./styles";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";

function Banner({ id, title, description, markedWord, isUsed}) {
  const [checked, setChecked] = useState(isUsed);
  const { setError, updateBanner } = useAdmin();
  const navigate = useNavigate();

  const parsedTitle = {
    __html: title.replaceAll(new RegExp(markedWord, 'gi'), `<span class='marked'>${markedWord}</span>`)
  }

  const handleChecked = async (e) => {
    e.stopPropagation();

    try {
      setChecked(!checked);
      const body = {
        title,
        description,
        markedWord,
        used: !checked
      }

      await updateBanner(id, body);
    }catch(error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Section onClick={() => navigate(`${id}`)}>
      <FlexColumn gap={0.1}>
        <Title>titulo</Title>
        <Content
          style={{marginTop: "-0.5rem"}}
          size={30}
          height={35}
          dangerouslySetInnerHTML={parsedTitle}
        />
      </FlexColumn>
      <FlexColumn gap={0.1}>
        <Title>DESCRIPCION</Title>
        <Text
          align="start"
          style={{lineHeight: "20px", marginTop: "-0.5rem"}}
          color={COLORS.smoke}
          weight={600}
          size={16}
        >
          { description }
        </Text>
      </FlexColumn>
      <CheckBox
        size={18}
        checked={checked}
        label={checked ? "Usando" : "Usar"}
        onChange={handleChecked}
      />
    </Section>
  );
}

export default Banner;
