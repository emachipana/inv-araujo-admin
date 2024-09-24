import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
import { Title } from "../../../components/ProductForm/styles";
import { FlexRow } from "../../../styles/layout";
import Button from "../../../components/Button";
import { FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";

function DeleteModal({ id, isActive, setIsActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, deleteProduct } = useAdmin();
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProduct(id);
      setIsLoading(false);
      navigate("/admin/productos");
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      setError(error.message);
    }
  } 

  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <Title>¿Eliminar producto?</Title>
      <FlexRow
        width="100%"
        gap={1}
        style={{marginTop: "3rem"}}
      >
        <Button
          color="danger"
          fontSize={16}
          iconSize={16}
          Icon={isLoading ? null : FaTrashAlt}
          disabled={isLoading}
          onClick={onDelete}
        >
          {
            isLoading
            ? <>
                <Spinner size="sm" />
                Eliminado...
              </>
            : "Eliminar"
          }
        </Button>
        <Button
          color="secondary"
          fontSize={16}
          disabled={isLoading}
          onClick={() => setIsActive(false)}
        >
          Cancelar
        </Button>
      </FlexRow>
    </Modal>
  );
}

export default DeleteModal;
