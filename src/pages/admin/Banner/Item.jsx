import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import Button from "../../../components/Button";
import { TextDescription } from "../../../components/Product/styles";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Image, Text } from "../../../styles/layout";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";
import { useAdmin } from "../../../context/admin";

function Item({ item, setBanner, banner }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { images = [] } = item.product;
  const navigate = useNavigate();
  const { setError, deleteBannerItem } = useAdmin();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedBanner = await deleteBannerItem(item.id, banner);
      setBanner(updatedBanner);
      setIsDeleting(false);
    }catch(error) {
      setIsDeleting(false);
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <Variety>
      <Wrapper>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Producto
          </Text>
          <FlexRow>
            <Image
              width="25px"
              alt={item.product.name}
              src={(images && images[0]) ? images[0]?.image.url : "/img/default_product.png"}
            />
            <TextDescription
              lines={1}
              align="start"
              weight={600}
              width={200}
              size="14px"
              color={COLORS.dim}
            >
              { item.product.name }
            </TextDescription>
          </FlexRow>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Precio
          </Text>
          <FlexRow>
            <Text
              size={15}
              color={item.product.discount ? COLORS.taupe : COLORS.persian}
              weight={600}
              style={{textDecoration: item.product.discount ? "line-through" : "none"}}
            >
              S/. { item.product.price }
            </Text>
            {
              item.product.discount
              &&
              <Text
                size={15}
                color={COLORS.orange}
                weight={600}
              >
                S/. { item.product.discount.price.toFixed(1) }
              </Text>
            }
          </FlexRow>
        </FlexColumn>
      </Wrapper>
        <Wrapper 
          isButtons
          justify="center"
        >
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={15}
            fontSize={14}
            Icon={FaEye}
            onClick={() => navigate(`/productos/${item.product.id}`)}
          >
            Ver producto
          </Button>
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={14}
            fontSize={14}
            Icon={isDeleting ? null : FaTrashAlt}
            color="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {
              isDeleting
              ? <>
                  <Spinner size="sm" />
                  Eliminado...
                </>
              : "Eliminar"
            }
          </Button>
        </Wrapper>
    </Variety>
  );
}

export default Item;
