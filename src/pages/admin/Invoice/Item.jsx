import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "../../../components/Button";
import { TextDescription } from "../../../components/Product/styles";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";

function Item({ item, isInvoiceGenerated, invoiceId, setInvoice, handleEdit }) {
  const [isDeleting, setIsDeleting] = useState();
  const { setError, deleteInvoiceItem } = useAdmin();
  const { id, name, price, quantity, subTotal } = item;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedInvoice = await deleteInvoiceItem(id, invoiceId);
      setInvoice(updatedInvoice);
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
            { name }
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
            S/. { price.toFixed(2) }
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
            S/. { subTotal.toFixed(2) }
          </Text>
        </FlexColumn>
      </Wrapper>
      {
        !isInvoiceGenerated
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
