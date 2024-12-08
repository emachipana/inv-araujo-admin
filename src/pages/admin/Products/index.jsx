import Categories from "../../../components/Categories";
import { Title } from "../styles";
import { Section } from "./styles";
import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Product from "../../../components/Product";
import Modal from "../../../components/Modal";
import ProductForm from "../../../components/ProductForm";
import List from "./List";
import Filter from "../../../components/Filter";
import { onSearchChange } from "./handlers";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";

function Products() {
  const [currentCategory, setCurrentCategory] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const { products, isLoading, setIsLoading, loadProducts, setProducts, backup } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("productType") || "group");

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadProducts();
      }catch(error) {
        setIsLoading(false);
        toast.error(errorParser(error.message));
      }
    }

    fetch();
  }, [ loadProducts, setIsLoading ]);

  return (
    <>
      <Title>Productos</Title>
      <Categories 
        isBlocked={isSearching}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        setIsGetting={setIsGetting}
      />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo producto"
        localStorageKey="productType"
        setType={setType}
        type={type}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        labelSearch="Buscar producto..."
        setCurrentCategory={setCurrentCategory}
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setProducts, "products", backup, setIsSearching)}
        searchValue={search}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? products?.map((product, index) => (
                  <Product 
                    key={index}
                    isInAdmin
                    product={product}
                  />
                ))
              : <List />
            )
        }
      </Section>
      <Modal
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <ProductForm isToCreate />
      </Modal>
    </>
  );
}

export default Products;
