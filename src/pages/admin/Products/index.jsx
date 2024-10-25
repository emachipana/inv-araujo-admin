import Categories from "../../../components/Categories";
import { Title } from "../styles";
import { Section } from "./styles";
import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Product from "../../../components/Product";
import AlertError from "../../../components/AlertError";
import Modal from "../../../components/Modal";
import ProductForm from "../../../components/ProductForm";
import List from "./List";
import Filter from "../../../components/Filter";
import apiFetch from "../../../services/apiFetch";

function Products() {
  const [currentCategory, setCurrentCategory] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const { products, isLoading, error, setError, loadProducts, setIsLoading, matcher, setProducts, backup } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("productType") || "group");

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.products) {
          setIsLoading(true);
          await loadProducts();
          setIsLoading(false);
        }
      }catch(error) {
        setIsLoading(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ loadProducts, matcher.products, setError, setIsLoading ]);

  const onSearchChange = async (e) => {
    const value = e.target.value;
    
    try {
      if(isGetting) return;
      setSearch(value);

      if(value.length >= 3) {
        setIsGetting(true);
        const searchedProducts = await apiFetch(`products/search?param=${value}`);
        setProducts(searchedProducts);
        setIsGetting(false);
        return;
      }

      setProducts(backup);

      if(value.length <= 0) setIsSearching(false);
    }catch(error) {
      console.error(error);
      setIsGetting(false);
      setError(error.message);
    }
  }

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
        onSearchChange={onSearchChange}
        searchValue={search}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? products.map((product, index) => (
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
      {
        error
        &&
        <AlertError
          from="categories"
          error={error}
          setError={setError}
        />
      }
    </>
  );
}

export default Products;
