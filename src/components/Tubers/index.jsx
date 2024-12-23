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

function Tubers({ currentTuber, setCurrentTuber, isBlocked, setIsGetting }) {
  const [editModal, setEditModal] = useState(false);
  const { tubers, isLoading, setVitroOrders, vitroOrdersBack, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentTuber === "Todo") return setVitroOrders(vitroOrdersBack);
        setIsGetting(true);
        const tuber = tubers.find(tuber => tuber.name === currentTuber);
        const vitroOrders = await apiFetch(`vitroOrders?tuberId=${tuber.id}`);
        setVitroOrders(vitroOrders);
        setIsGetting(false);
      }catch(error) {
        setIsGetting(false);
        setError(error.message);
        console.error(error);
      }
    }

    fetch();
  }, [currentTuber, setError, setVitroOrders, tubers, vitroOrdersBack, setIsGetting]);

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <NewCategory
              isBlocked={isBlocked}
              Icon={FaRegEdit}
              onClick={() => setEditModal(true)}
            >
              Editar variedades
            </NewCategory>
            <Category
              isBlocked={isBlocked}
              name="Todo"
              currentCategory={currentTuber}
              setCurrentCategory={setCurrentTuber}
            />
            {
              tubers.map((tuber, index) => (
                <Category
                  isBlocked={isBlocked}
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
