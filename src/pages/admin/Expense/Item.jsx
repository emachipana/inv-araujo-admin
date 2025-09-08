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
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Item({ item, handleEdit, profitId, setExpense, setExpenses }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteExpenseItem } = useAdmin();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedExpense = await deleteExpenseItem(item.id, profitId, setExpenses);
      setExpense(updatedExpense);
      setIsDeleting(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsDeleting(false);
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
            width={120}
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
            Tipo
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { item.type }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            {
              item.type === "SERVICIO"
              ? "Monto"
              : "Precio"
            }
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { item.price.toFixed(2) }
          </Text>
        </FlexColumn>
        {
          item.type === "BIEN"
          &&
          <>
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
                S/. { item.subTotal.toFixed(2) }
              </Text>
            </FlexColumn>
          </>
        }
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
