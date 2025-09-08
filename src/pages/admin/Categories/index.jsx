import { useState } from "react";
import Filter from "../../../components/Filter";
import { Title } from "../styles";

function Categories() {
  const [createModal, setCreateModal] = useState();
  const [type, setType] = useState();

  return (
    <>
      <Title>Categorías</Title>
      <Filter 
				setModal={setCreateModal}
				textButton="Nueva categoría"
				localStorageKey="categoryType"
        type={type}
        setType={setType}
        
      />
    </>
  );
}

export default Categories;
