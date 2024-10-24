import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";
import { TextDescription } from "../../../components/Product/styles";
import { COLORS } from "../../../styles/colors";

function Item({ item, handleEdit, profitId, setExpense }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { setError, deleteExpenseItem } = useAdmin();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedExpense = await deleteExpenseItem(item.id, profitId);
      setExpense(updatedExpense);
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
            Nombre
          </Text>
          <TextDescription
            lines={1}
            align="start"
            weight={600}
            size="14px"
            color={COLORS.dim}
          >
            { item.name }
          </TextDescription>
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
            S/. { item.price.toFixed(1) }
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
            { item.quantity }
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
            S/. { item.subTotal.toFixed(1) }
          </Text>
        </FlexColumn>
      </Wrapper>
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
    </Variety>
  );
}

export default Item;
