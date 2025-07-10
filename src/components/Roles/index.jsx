import { FaRegEdit } from "react-icons/fa";
import { Container } from "../Categories/styles";
import NewCategory from "../Category/New";
import Category from "../Category";
import Modal from "../Modal";
import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import { capitalize } from "../../helpers/capitalize";
import EditRoles from "../EditRoles";

function Roles({ isBlocked, currentRole, setFilters }) {
  const [editModal, setEditModal] = useState(false);
  const { roles, isLoading } = useAdmin();

  const setCurrentRole = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, role: { id: null, name: null }, page: 0 }));

    setFilters(filters => ({...filters, role: {id, name}, page: 0 }));
  }

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
              Editar roles
            </NewCategory>
            <Category 
              isBlocked={isBlocked}
              name="Todo"
              setCurrentCategory={setCurrentRole}
              currentCategory={currentRole}
            />
            {
              roles.map((role, index) => (
                <Category
                  id={role.id}
                  isBlocked={isBlocked}
                  key={index}
                  name={capitalize(role.name.toLowerCase())}
                  currentCategory={currentRole}
                  setCurrentCategory={setCurrentRole}
                />
              ))
            }
          </>
      }
      <Modal
        align="flex-start"
        isActive={editModal}
        setIsActive={setEditModal}
        size="lg"
        padding="1rem"
      >
        <EditRoles />
      </Modal>
    </Container>
  );
}

export default Roles;
