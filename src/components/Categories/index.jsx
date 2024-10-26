import { useEffect, useState } from "react";
import { Container } from "./styles";
import NewCategory from "../Category/New";
import Category from "../Category";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import Modal from "../Modal";
import EditCategories from "../EditCategories";
import { FaRegEdit } from "react-icons/fa";
import apiFetch from "../../services/apiFetch";

function Categories({ isBlocked, currentCategory, setCurrentCategory, setIsGetting }) {
  const [editModal, setEditModal] = useState(false);
  const { categories, isLoading, setProducts, backup, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentCategory === "Todo") return setProducts(backup);
        setIsGetting(true);
        const category = categories.find(category => category.name === currentCategory);
        const products = await apiFetch(`products?categoryId=${category.id}`);
        setProducts(products);
        setIsGetting(false);
      }catch(error) {
        setIsGetting(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [currentCategory, backup, categories, setProducts, setError, setIsGetting]);

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
