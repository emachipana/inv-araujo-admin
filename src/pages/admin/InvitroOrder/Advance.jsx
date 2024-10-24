import { useState } from "react";
import { Variety as Container } from "./styles";
import { Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { capitalize } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { COLORS } from "../../../styles/colors";
import AdvanceForm from "./AdvanceForm";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";

function Advance({ id, date, amount, setOrder, vitroId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setError, deleteAdvance } = useAdmin();

  const options = {
    day: "numeric",
    weekday: "long",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }

  const parsedDate = new Date(date).toLocaleDateString("es-ES", options);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedVitro = await deleteAdvance(id, vitroId);
      setOrder(updatedVitro);
      setIsDeleting(false);
    }catch(error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Container>
      {
        isEditing
        ? <AdvanceForm 
            setIsActive={setIsEditing}
            initialValues={{
              date,
              amount
            }}
            isToCreate={false}
            id={id}
            setVitroOrder={setOrder}
            vitroOrderId={vitroId}
          />
        : <>
            <Wrapper>
              <FlexColumn gap={0.1}>
                <Text
                  weight={700}
                  size={15}
                >
                  Fecha
                </Text>
                <Text
                  weight={600}
                  size={14}
                  color={COLORS.dim}
                >
                  { capitalize(parsedDate) }
                </Text>
              </FlexColumn>
              <FlexColumn gap={0.1}>
                <Text
                  weight={700}
                  size={15}
                >
                  Monto
                </Text>
                <Text
                  weight={600}
                  size={14}
                  color={COLORS.dim}
                >
                  S/. { amount }
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
                onClick={() => setIsEditing(true)}
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
          </>
      }
    </Container>
  );
}

export default Advance;
