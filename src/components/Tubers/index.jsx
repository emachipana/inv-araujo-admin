import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { Container } from "../Categories/styles";
import { Spinner } from "reactstrap";
import NewCategory from "../Category/New";
import { FaRegEdit } from "react-icons/fa";
import Category from "../Category";
import Modal from "../Modal";
import EditTubers from "../EditTubers";
import { useAuth } from "../../context/auth";

function Tubers({ currentTuber, setFilters, isBlocked }) {
  const [editModal, setEditModal] = useState(false);
  const { tubers, isLoading } = useAdmin();
  const { user } = useAuth();
  const userPermissions = user.role.permissions;

  const setCurrentTuber = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, tuber: { id: null, name: null }, page: 0 }));

    setFilters(filters => ({...filters, tuber: {id, name}, page: 0 }));
  };

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            {
              (userPermissions.includes("TUBER_CREATE") || userPermissions.includes("TUBER_UPDATE"))
              &&
              <NewCategory
                isBlocked={isBlocked}
                Icon={FaRegEdit}
                onClick={() => setEditModal(true)}
              >
                Editar variedades
              </NewCategory>
            }
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
                  id={tuber.id}
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
