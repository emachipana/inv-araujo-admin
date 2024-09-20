import { useState } from "react";
import { Container } from "./styles";
import NewCategory from "../Category/New";
import Category from "../Category";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import Modal from "../Modal";
import EditCategories from "../EditCategories";
import { FaRegEdit } from "react-icons/fa";

function Categories() {
  const [currentCategory, setCurrentCategory] = useState("Todo");
  const [editModal, setEditModal] = useState(false);
  const { categories, isLoading } = useAdmin();

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
              Editar categorias
            </NewCategory>
            <Category 
              name="Todo"
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
            />
            {
              categories.map((category, index) => (
                <Category
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
        isActive={editModal}
        setIsActive={setEditModal}
        size="lg"
        padding={"1rem"}
      >
        <EditCategories />
      </Modal>
    </Container>
  );
}

export default Categories;
