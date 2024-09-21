import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { Blocker, Brand, Container, Description, Discount, Image, Name, TextDescription, Toggle } from "./styles";
import { TiShoppingCart } from "react-icons/ti";
import { FaCheck } from "react-icons/fa6";
import { FlexRow, Text } from "../../styles/layout";
import { COLORS } from "../../styles/colors";
import { useAdmin } from "../../context/admin";

function Product({ product, isInAdmin, addCartProduct, cartItems = [] }) {
  const { id, images, name, price, discount, description, brand, category, active } = product;
  const { updateProduct, setError } = useAdmin();
  const navigate = useNavigate();

  const foundProduct = cartItems.find(item => item.id === id);

  const handleClick = () => {
    window.scrollTo(0, 0);
    if(isInAdmin) return navigate(`/admin/productos/${id}`);

    navigate(`/tienda/${category.name}/${id}`);
  }

  const handleCartButtonClick = (e) => {
    if(isInAdmin) return;
    
    e.stopPropagation();
    if(foundProduct) return;

    addCartProduct(product, 1);
  }

  const handleChange = async () => {
    try {
      const body = {...product, categoryId: category.id, isActive: !active};
      await updateProduct(id, body);
    }catch(error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Container
      onClick={handleClick}
    >
      {
        discount
        &&
        <Discount>
          <Text
            color="white"
            weight={700}
          >
            -{discount.percentage}%
          </Text>
        </Discount>
      }
      <Image 
        alt={`${name}-image`}
        src={images[0] ? images[0]?.image.url : "/img/default_product.png"}
      />
      <Description>
        <FlexRow width="100%" justify="space-between">
          <Text 
            size={12.5}
            color={COLORS.taupe}
            weight={700}
          >
            { category?.name.toUpperCase() }
          </Text>
          <Brand>{ brand }</Brand>
        </FlexRow>
        <Name>{ name }</Name>
        <TextDescription>{ description }</TextDescription>
        <FlexRow>
          <Text
            color={discount ? COLORS.taupe : COLORS.persian}
            weight={700}
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
            >
              S/. { discount.price }
            </Text>
          }
        </FlexRow>
        <Button
          color={foundProduct ? "primary" : "secondary"}
          fontSize={16}
          size="full"
          Icon={isInAdmin ? null : (foundProduct ? FaCheck : TiShoppingCart)}
          iconSize={18}
          onClick={handleCartButtonClick}
        >
          {
            isInAdmin
            ? "Ver detalle"
            : foundProduct
              ? "En el carrito"
              : "Agregar al carrito"
          }
        </Button>
      </Description>
      { !active && <Blocker /> }
      {
        isInAdmin
        &&
        <Toggle onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox"
            className="checkbox"
            id="checkbox"
            checked={active}
            onChange={handleChange}
          />
          <label className="switch" htmlFor="checkbox">
            <span className="slider"></span>
          </label>
        </Toggle>
      }
    </Container>
  );
}

export default Product;
