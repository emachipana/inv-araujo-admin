import { useState } from "react";
import { Title } from "../../pages/admin/styles";
import { Container, Section } from "./styles";
import NewCategory from "../Category/New";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { Container as Navigation } from "../Categories/styles";
import { useAdmin } from "../../context/admin";
import Category from "./Category";

function EditCategories() {
  const { categories } = useAdmin();
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
                    subCategories={category.subCategories}
                    key={index}
                  >
                    { category.name }
                  </Category>
                ))
              }
            </>
          : (currentAction === "addCategory"
              ? <>
                  Agregar categoria
                </>
              : <>
                  Agregar subcategoria
                </>
            )
        }
      </Section>
    </Container>
  );
}

export default EditCategories;
