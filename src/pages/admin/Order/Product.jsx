import { Fragment, useState } from "react";
import { Container, Line, ProductSection } from "./styles";
import { FlexColumn, FlexRow, Image, Text } from "../../../styles/layout";
import { Input as Radio } from "reactstrap";
import { COLORS } from "../../../styles/colors";
import Control from "../../../components/Control";

function Product({images = [], id, values, name, price, stock, discount, setValues, isToEdit = false, initialQuantity = 1}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleChangeQuantity = (quantity) => {
    if(id !== values.productId) return;
    setQuantity(quantity);
    setValues(values => ({...values, quantity}))
  }

  const handleRadioChange = () => {
    setValues({quantity, productId: id});
  }

  return (
    <Fragment>
      <Container>
        <FlexRow>
          {
            !isToEdit
            &&
            <Radio
              type="radio"
              id={id}
              name="products"
              defaultChecked={values.productId === id}
              onChange={handleRadioChange}
            />
          }
          <ProductSection htmlFor={id}>
            <Image
              width="80px"
              src={(images && images[0]) ? images[0]?.image.url : "/img/default_product.png"}
              alt={name}
            />
            <FlexColumn gap={0.1}>
              <Text
                weight={700}
              >
                { name}
              </Text>
              <FlexRow>
                <Text
                  color={discount ? COLORS.taupe : COLORS.persian}
                  weight={700}
                  size={15}
                  style={{textDecoration: discount ? "line-through" : "none"}}
                >
                  S/. { price }
                </Text>
                {
                  discount
                  &&
                  <Text
                    color={COLORS.orange}
                    weight={700}
                    size={15}
                  >
                    S/. { discount.price }
                  </Text>
                }
              </FlexRow>
            </FlexColumn>
          </ProductSection>
        </FlexRow>
        <Control
          size="sm"
          fontSize={16}
          controlSize={19}
          number={quantity}
          setNumber={handleChangeQuantity}
          stock={stock}
          disabled={id !== values.productId}
        />
      </Container>
      {
        !isToEdit
        &&
        <Line />
      }
    </Fragment>
  );
}

export default Product;
