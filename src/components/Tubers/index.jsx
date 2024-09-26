import { useEffect, useState } from "react";
import { useAdmin } from "../../context/admin";
import apiFetch from "../../services/apiFetch";
import { Container } from "../Categories/styles";
import { Spinner } from "reactstrap";
import NewCategory from "../Category/New";
import { FaRegEdit } from "react-icons/fa";
import Category from "../Category";
import Modal from "../Modal";
import EditTubers from "../EditTubers";

function Tubers() {
  const [currentTuber, setCurrentTuber] = useState("Todo");
  const [editModal, setEditModal] = useState(false);
  const { tubers, isLoading, setVitroOrders, vitroOrdersBack, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentTuber === "Todo") return setVitroOrders(vitroOrdersBack);
        const tuber = tubers.find(tuber => tuber.name === currentTuber);
        const vitroOrders = await apiFetch(`vitroOrders?tuberId=${tuber.id}`);
        setVitroOrders(vitroOrders);
      }catch(error) {
        setError(error.message);
        console.error(error);
      }
    }

    fetch();
  }, [currentTuber, setError, setVitroOrders, tubers, vitroOrdersBack]);

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <NewCategory
              Icon={FaRegEdit}
              onClick={() => setEditModal(true)}
            >
              Editar variedades
            </NewCategory>
            <Category 
              name="Todo"
              currentCategory={currentTuber}
              setCurrentCategory={setCurrentTuber}
            />
            {
              tubers.map((tuber, index) => (
                <Category 
                  key={index}
                  name={tuber.name}
                  currentCategory={currentTuber}
                  setCurrentCategory={setCurrentTuber}
                />
              ))
            }
          </>
      }
      {
        <Modal
          align="flex-start"
          isActive={editModal}
          setIsActive={setEditModal}
          size="md"
          padding="1rem"
        >
          <EditTubers />
        </Modal>
      }
    </Container>
  );
}

export default Tubers;
