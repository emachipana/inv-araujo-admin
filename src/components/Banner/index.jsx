import { useState } from "react";
import { COLORS } from "../../styles/colors";
import { FlexColumn, Text } from "../../styles/layout";
import { Content, Section, Title } from "./styles";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { handleChecked, parsedTitle } from "./handlers";
import SelectBox from "../Input/SelectBox";

function Banner({ id, title, description, markedWord, isUsed, items}) {
  const [checked, setChecked] = useState(isUsed);
  const { updateBanner } = useAdmin();
  const navigate = useNavigate();

  return (
    <Section onClick={() => navigate(`${id}`)}>
      <FlexColumn gap={0.1}>
        <Title>titulo</Title>
        <Content
          style={{marginTop: "-0.5rem"}}
          size={30}
          height={35}
          dangerouslySetInnerHTML={parsedTitle(title, markedWord)}
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
      <SelectBox
        size={18}
        checked={checked}
        label={checked ? "Usando" : "Usar"}
        onChange={
          (e) => handleChecked(
            e,
            checked,
            { id, title, description, markedWord, isUsed, items },
            setChecked,
            updateBanner
          )
        }
      />
    </Section>
  );
}

export default Banner;
