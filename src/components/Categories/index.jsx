import { useState } from "react";
import { Container } from "./styles";
import NewCategory from "../Category/New";
import Category from "../Category";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import Modal from "../Modal";
import EditCategories from "../EditCategories";
import { FaRegEdit } from "react-icons/fa";

function Categories({ isBlocked, currentCategory, setFilters }) {
  const [editModal, setEditModal] = useState(false);
  const { categories, isLoading } = useAdmin();

  const setCurrentCategory = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, category: { id: null, name: null }}));

    setFilters(filters => ({...filters, category: {id, name}}));
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
              Editar categorias
            </NewCategory>
            <Category
              isBlocked={isBlocked}
              name="Todo"
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
            />
            {
              categories.map((category, index) => (
                <Category
                  id={category.id}
                  isBlocked={isBlocked}
                  key={index}
                  name={category.name}
                  currentCategory={currentCategory}
                  setCurrentCategory={setCurrentCategory}
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
        <EditCategories />
      </Modal>
    </Container>
  );
}

export default Categories;
