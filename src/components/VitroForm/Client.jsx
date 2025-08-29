import { Fragment } from "react";
import { ProductSection } from "../../pages/admin/Order/styles";
import { FlexColumn, Text } from "../../styles/layout";
import { Input } from "reactstrap";
import { ClientSection } from "./styles";
import { COLORS } from "../../styles/colors";
import { TextDescription } from "../Product/styles";

function Client({ id, rsocial, document, documentType, phone, setClientSelected, clientSelected }) {
  const handleChange = () => {
    setClientSelected({id, rsocial, document, documentType, phone});
  }

  return (
    <Fragment>
      <ClientSection>
        <Input 
          type="radio"
          id={id}
          name="clients"
          defaultChecked={clientSelected === id}
          onChange={handleChange}
        />
        <ProductSection htmlFor={id}>
          <FlexColumn gap={0.1}>
            <TextDescription
              width="100%"
              color={COLORS.gray}
              size="16px"
              lines={1}
              style={{textTransform: "capitalize"}}
              weight={600}
            > 
              { rsocial.toLowerCase() }
            </TextDescription>
            <Text
              size={14}
              color={COLORS.dim}
              weight={600}
            >
              { documentType }: { document }
            </Text>
          </FlexColumn>
        </ProductSection>
      </ClientSection>
    </Fragment>
  );
}

export default Client;
