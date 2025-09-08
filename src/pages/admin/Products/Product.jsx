import { Name } from "../../../components/Product/styles";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Image, Text } from "../../../styles/layout";
import { ProductItem } from "./styles";
import { Input as Radio } from "reactstrap";

function Product({currentProductId, setProductId, product}) {
  const { id, images = [], name, stock } = product;
  
  return (
    <ProductItem htmlFor={`${id}-select`}>
      <FlexRow 
        width="100%"
        justify="space-around"
      >
        <Radio
          type="radio"
          id={`${id}-select`}
          name="products"
          defaultChecked={currentProductId === id}
          onChange={() => setProductId(id)}
        />
        <FlexRow>
          <Image 
            width="80px"
            alt={id}
            src={(images && images[0]) ? images[0]?.image.url : "/img/default_product.png"}
          />
          <FlexColumn gap={0.1}>
            <Name
              style={{maxWidth: "140px"}}
              weight={700}
            >
              { name }
            </Name>
            <Text
              color={COLORS.taupe}
              weight={600}
            >
              Stock: { stock }
            </Text>
          </FlexColumn>
        </FlexRow>
      </FlexRow>
    </ProductItem>
  );
}

export default Product;
