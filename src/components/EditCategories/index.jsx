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
import AddSubCategory from "./AddSubCategory";
import AlertError from "../AlertError";

function EditCategories() {
  const { categories, error, setError } = useAdmin();
  const [currentAction, setCurrentAction] = useState("categories");

  return (
    <Container>
      <Title
        size={1.5}
      >
        { currentAction === "categories" ? "Categorias" : (currentAction === "addCategory" ? "Agregar categoria" : "Agregar subcategoria") }
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
        <NewCategory
          onClick={() => setCurrentAction("addSubCategory")}
          Icon={MdAddCircleOutline}
          isActive={currentAction === "addSubCategory"}
        >
          Agregar subcategoria
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
                    subCategories={category.subCategories || []}
                    key={index}
                  >
                    { category.name }
                  </Category>
                ))
              }
            </>
          : (currentAction === "addCategory"
              ? <AddCategory setCurrentAction={setCurrentAction} />
              : <AddSubCategory setCurrentAction={setCurrentAction} />
            )
        }
      </Section>
      {
        error
        &&
        <AlertError
          error={error}
          setError={setError}
          from="categories"
        />
      }
    </Container>
  );
}

export default EditCategories;
