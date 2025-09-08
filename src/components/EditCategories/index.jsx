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
import { useAuth } from "../../context/auth";

function EditCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [currentAction, setCurrentAction] = useState("categories");
  const { user } = useAuth();

  const userPermissions = user.role.permissions;

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
        {
          userPermissions.includes("PRODUCTS_CATEGORY_CREATE")
          &&
          <NewCategory
            onClick={() => setCurrentAction("addCategory")}
            Icon={MdAddCircleOutline}
            isActive={currentAction === "addCategory"}
          >
            Agregar categoria
          </NewCategory>
        }
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
                    ableToEdit={userPermissions.includes("PRODUCTS_CATEGORY_UPDATE")}
                    ableToDelete={userPermissions.includes("PRODUCTS_CATEGORY_DELETE")}
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
