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
import { filterBuilder, onSearchChange } from "./handlers";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { FlexRow } from "../../../styles/layout";
import Pagination from "../../../components/Pagination";
import apiFetch from "../../../services/apiFetch";
import BatchModal from "./BatchModal";

function Products() {
  const [filters, setFilters] = useState({category: { id: null, name: null }, sort: null});
  const [createModal, setCreateModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
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

  useEffect(() => {
    const filter = async () => {
      if(!filters.category.id && !filters.sort) return setProducts(backup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const products = await apiFetch(`products${params}`);
        setProducts(products);
        setIsGetting(false)
      }catch(error) {
        setIsGetting(false);
        toast.error(errorParser(error.message));
      }
    }

    filter();
  }, [filters, backup, setProducts]);

  return (
    <>
      <Title>Productos</Title>
      <Categories 
        isBlocked={isSearching}
        currentCategory={filters.category?.name}
        setFilters={setFilters}
        setIsGetting={setIsGetting}
      />
      <Filter
        secondButton={{textButton: "Nuevo lote", setModal: setBatchModal}}
        setModal={setCreateModal}
        textButton="Nuevo producto"
        localStorageKey="productType"
        setType={setType}
        type={type}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        labelSearch="Buscar producto..."
        setFilters={setFilters}
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setProducts, "products", backup)}
        searchValue={search}
        setSearch={setSearch}
        reset={() => {}}
      />
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <p>Ordernar por: </p>
        <Pagination
          currentPage={products.number}
          totalPages={products.totalPages}
          filters={filters}
          isLoading={isGetting}
          setIsLoading={setIsGetting}
          set={setProducts}
          to="products"
        />
      </FlexRow>
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? products.content?.map((product, index) => (
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
        batchModal
        &&
        <BatchModal 
          isActive={batchModal}
          setIsActive={setBatchModal}
        />
      }
    </>
  );
}

export default Products;
