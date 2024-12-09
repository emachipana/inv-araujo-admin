import { useState } from "react";
import { Title } from "../../pages/admin/styles";
import { Container, Section } from "./styles";
import NewCategory from "../Category/New";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { Container as Navigation } from "../Categories/styles";
import { useAdmin } from "../../context/admin";
import Category from "./Category";
import AddCategory from "./AddCategory";

function EditCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [currentAction, setCurrentAction] = useState("categories");

  return (
    <Container>
      <Title
        size={1.5}
      >
        { currentAction === "categories" ? "Categorias" : "Agregar categoría" }
      </Title>
      <Navigation>
        <NewCategory
          onClick={() => setCurrentAction("categories")}
          Icon={FaRegEye}
          isActive={currentAction === "categories"}
        >
          Ver categorias
        </NewCategory>
        <NewCategory
          onClick={() => setCurrentAction("addCategory")}
          Icon={MdAddCircleOutline}
          isActive={currentAction === "addCategory"}
        >
          Agregar categoria
        </NewCategory>
      </Navigation>
      <Section>
        {
          currentAction === "categories"
          ? <>
              {
                categories.map((category, index) => (
                  <Category
                    id={category.id}
                    key={index}
                    forCategory={{updateCategory, deleteCategory}}
                  >
                    { category.name }
                  </Category>
                ))
              }
            </>
          : <AddCategory 
              setCurrentAction={setCurrentAction}
              to="categories"
              addCategory={addCategory}
            />
        }
      </Section>
    </Container>
  );
}

export default EditCategories;
