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

function Products() {
  const [createModal, setCreateModal] = useState(false);
  const { products, isLoading, error, setError, loadProducts, setIsLoading, matcher } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("productType") || "group");

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.products) await loadProducts();
      }catch(error) {
        setIsLoading(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ loadProducts, matcher.products, setError, setIsLoading ]);

  return (
    <>
      <Title>Productos</Title>
      <Categories />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo producto"
        localStorageKey="productType"
        setType={setType}
        type={type}
      />
      <Section>
        {
          isLoading
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
