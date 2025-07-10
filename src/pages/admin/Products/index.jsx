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
import apiFetch from "../../../services/apiFetch";
import BatchModal from "./BatchModal";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import Button from "../../../components/Button";
import { COLORS } from "../../../styles/colors";
import { FaBoxesStacked, FaTruckRampBox } from "react-icons/fa6";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { TbSitemapFilled } from "react-icons/tb";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { RiFilterOffFill } from "react-icons/ri";
import Pagination from "../../../components/Pagination";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";

function Products() {
  const [filters, setFilters] = useState({
    category: { id: null, name: null },
    sort: null,
    page: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const { products, isLoading, setIsLoading, loadProducts, setProducts, backup } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("productType") || "group");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { productsModal, setProductsModal, productsBatchModal, setProductsBatchModal } = useModal();
  const { user } = useAuth();

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
      if(!filters.category.id && !filters.sort && !filters.page) return setProducts(backup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const products = await apiFetch(`products${!params ? `?activeProducts=false` : `${params}&activeProducts=false`}`);
        setProducts(products);
        setIsGetting(false)
      }catch(error) {
        setIsGetting(false);
        toast.error(errorParser(error.message));
      }
    }

    filter();
  }, [filters, backup, setProducts]);

  const sortData = {
    "PRICE_HIGH_TO_LOW": "Precio (mayor a menor)",
    "PRICE_LOW_TO_HIGH": "Precio (menor a mayor)",
    "STOCK_HIGH_TO_LOW": "Stock (mayor a menor)",
    "STOCK_LOW_TO_HIGH": "Stock (menor a mayor)",
  }

  const onClickSort = (name) => {
    if(filters.sort === name) return;

    setFilters({...filters, sort: name, page: 0});
    setIsSortOpen(false);
  }

  return (
    <>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn gap={0.1}>
          <Title>Productos</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los productos de tu tienda
          </Text>
        </FlexColumn>
        <FlexRow>
          {
            user.role.permissions.includes("PRODUCTS_BATCH_CREATE")
            &&
            <Button
              onClick={() => setProductsBatchModal(!productsBatchModal)}
              fontSize={15}
              Icon={FaTruckRampBox}
              iconSize={18}
            >
              Nuevo lote
            </Button>
          }
          {
            user.role.permissions.includes("PRODUCTS_CREATE")
            &&
            <Button
              onClick={() => setProductsModal(!productsModal)}
              fontSize={15}
              Icon={FaBoxesStacked}
              iconSize={18}
            >
              Nuevo producto
            </Button>
          }
        </FlexRow>
      </FlexRow>
      <HeaderPage>
        <Categories 
          isBlocked={isSearching}
          currentCategory={filters.category?.name}
          setFilters={setFilters}
        />
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter
            localStorageKey="productType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            labelSearch="Buscar producto..."
            resetFilters={() => setFilters(filters => ({...filters, category: {id: null, name: null}, sort: null, page: 0}))}
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setProducts, "products", backup)}
            searchValue={search}
            reset={() => setSearch("")}
          />
          <FlexRow gap={1}>
            <DropDown
              Button={SelectButton}
              buttonData={{
                Icon: TbSitemapFilled,
                children: `${sortData[filters.sort] || "Ordernar por"}`,
                isActive: !!filters.sort,
              }}
              isOpen={isSortOpen}
              setIsOpen={setIsSortOpen}
            >
              <MenuSection>
                <SelectItem
                  minWidth={185}
                  onClick={() => onClickSort("PRICE_HIGH_TO_LOW")}
                  isActive={filters.sort === "PRICE_HIGH_TO_LOW"}
                >
                  Precio (mayor a menor)
                </SelectItem>
                <SelectItem
                  minWidth={185}
                  onClick={() => onClickSort("PRICE_LOW_TO_HIGH")}
                  isActive={filters.sort === "PRICE_LOW_TO_HIGH"}
                >
                  Precio (menor a mayor)
                </SelectItem>
                <SelectItem
                  minWidth={185}
                  onClick={() => onClickSort("STOCK_HIGH_TO_LOW")}
                  isActive={filters.sort === "STOCK_HIGH_TO_LOW"}
                >
                  Stock (mayor a menor)
                </SelectItem>
                <SelectItem
                  minWidth={185}
                  onClick={() => onClickSort("STOCK_LOW_TO_HIGH")}
                  isActive={filters.sort === "STOCK_LOW_TO_HIGH"}
                >
                  Stock (menor a mayor)
                </SelectItem>
              </MenuSection>
            </DropDown>
            {
              (filters.sort || filters.category.name)
              &&
              <Button
                onClick={() => setFilters(filters => ({...filters, sort: null, category: {id: null, name: null}, page: 0}))}
                Icon={RiFilterOffFill}
                fontSize={14}
                color="danger"
                iconSize={14}
                style={{padding: "0.25rem 0.5rem"}}
              >
                Limpiar
              </Button>
            }
          </FlexRow>
        </FlexRow>
      </HeaderPage>
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
      <Pagination 
        currentPage={products.number}
        totalPages={products.totalPages}
        // totalPages={50}
        setFilters={setFilters}
        isLoading={isLoading || isGetting}
      />
      <Modal
        isActive={productsModal}
        setIsActive={setProductsModal}
      >
        <ProductForm isToCreate />
      </Modal>
      {
        productsBatchModal
        &&
        <BatchModal 
          isActive={productsBatchModal}
          setIsActive={setProductsBatchModal}
        />
      }
    </>
  );
}

export default Products;
