import { useState } from "react";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { Wrapper } from "../Product/styles";
import { Variety } from "./styles";
import { useAdmin } from "../../../context/admin";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";

function Item({ item, vitroId, setVitro, handleEdit, orderStatus }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { setError, deleteItem } = useAdmin();
  const { id, variety, price, quantity, subTotal } = item;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedVitroOrder = await deleteItem(id, vitroId);
      setVitro(updatedVitroOrder);
      setIsDeleting(false);
    }catch(error) {
      setIsDeleting(false);
      console.error(error);
      setError(error.message);
    }
  } 

  return (
    <Variety>
      <Wrapper>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Variedad
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { variety.name }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Precio
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { price }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Cantidad
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { quantity }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Subtotal
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { subTotal }
          </Text>
        </FlexColumn>
      </Wrapper>
      {
        orderStatus === "PENDIENTE"
        &&
        <FlexRow gap={1}>
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={15}
            fontSize={14}
            Icon={FaEdit}
            color="warning"
            onClick={() => handleEdit(item)}
          >
            Editar
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
        </FlexRow>
      }
    </Variety>
  );
}

export default Item;
