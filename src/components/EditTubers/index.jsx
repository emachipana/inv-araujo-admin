import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { Container, Section } from "../EditCategories/styles";
import { Title } from "../../pages/admin/styles";
import { Container as Navigation } from "../Categories/styles";
import NewCategory from "../Category/New";
import { FaRegEye } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import Category from "../EditCategories/Category";
import AddCategory from "../EditCategories/AddCategory";
import AddVariety from "./AddVariety";

function EditTubers() {
  const [currentAction, setCurrentAction] = useState("tubers");
  const [toEditVariety, setToEditVariety] = useState({ isActive: false, id: "", tuberId: "" });
  const { tubers, updateTuber, addTuber, deleteTuber, deleteVariety } = useAdmin();

  const handleUpdateVariety = (id, tuberId) => {
    setCurrentAction("addVariety");
    setToEditVariety({ isActive: true, id, tuberId });
  }


  const handleClick = (action) => {
    if(action === "addVariety" && toEditVariety.isActive) return;
    setCurrentAction(action);
    if(toEditVariety) setToEditVariety({ isActive: false, id: "", tuberId: "" });
  }

  return (
    <Container>
      <Title
        size={1.5}
      >
        { currentAction === "tubers"
            ? "Tubérculos"
            : (
                currentAction === "addTuber"
                ? "Agregar tubérculo"
                : (
                    toEditVariety.isActive ? "Editar variedad" : "Agregar variedad"
                  )
              ) 
        }
      </Title>
      <Navigation>
        <NewCategory
          onClick={() => handleClick("tubers")}
          Icon={FaRegEye}
          isActive={currentAction === "tubers"}
        >
          Ver tubérculos
        </NewCategory>
        <NewCategory
          onClick={() => handleClick("addTuber")}
          Icon={MdAddCircleOutline}
          isActive={currentAction === "addTuber"}
        >
          Agregar tubérculo
        </NewCategory>
        <NewCategory
          onClick={() => handleClick("addVariety")}
          Icon={MdAddCircleOutline}
          isActive={currentAction === "addVariety"}
        >
          {
            toEditVariety.isActive
            ? "Editar variedad"
            : "Agregar variedad"
          }
        </NewCategory>
      </Navigation>
      <Section>
        {
          currentAction === "tubers"
          ? <>
              {
                tubers.map((tuber, index) => {
                  const varieties = tuber.varieties 
                    ? tuber.varieties.map(variety => ({...variety, name: `S/. ${variety.price} - ${variety.name}`}))
                    : [];
                  
                  return (
                    <Category
                      id={tuber.id}
                      subCategories={varieties}
                      key={index}
                      isFromTuber
                      forCategory={{updateCategory: updateTuber, deleteCategory: deleteTuber}}
                      forSubCategory={{updateSubCategory: handleUpdateVariety, deleteSubCategory: deleteVariety}}
                    >
                      { tuber.name }
                    </Category>
                  )
                })
              }
            </>
          : (
              currentAction === "addTuber"
              ? <AddCategory 
                  setCurrentAction={setCurrentAction}
                  to="tubers"
                  addCategory={addTuber}
                />
              : <AddVariety 
                  setCurrentAction={setCurrentAction}
                  id={toEditVariety.id}
                  tuberId={toEditVariety.tuberId}
                  setEdit={setToEditVariety}
                />
            )
        }
      </Section>
    </Container>
  );
}

export default EditTubers;
