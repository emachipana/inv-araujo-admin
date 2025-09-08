import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
import { Title } from "../../../components/ProductForm/styles";
import { FlexRow } from "../../../styles/layout";
import Button from "../../../components/Button";
import { FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function DeleteModal({ id, isActive, setIsActive, handleDelete, navTo, title }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await handleDelete(id);
      setIsLoading(false);
      navigate(`/${navTo}`);
      setIsActive(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  } 

  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <Title>{ title }</Title>
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
