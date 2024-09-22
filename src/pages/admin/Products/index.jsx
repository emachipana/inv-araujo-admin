import Categories from "../../../components/Categories";
import { FlexRow } from "../../../styles/layout";
import { Title } from "../styles";
import { Filter, Group, Section, Wrapper } from "./styles";
import { IoSearchOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import { HiSquares2X2 } from "react-icons/hi2";
import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Product from "../../../components/Product";
import Button from "../../../components/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import ProductList from "../../../components/ProducList";

function Products() {
  const { products, isLoading } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("productType") || "group");

  const handleClick = (type) => {
    setType(type);
    localStorage.setItem("productType", type);
  }

  return (
    <>
      <Title>Productos</Title>
      <Categories />
      <Filter>
        <FlexRow gap={0.8}>
          <Group>
            <Wrapper 
              isActive={type === "list"} 
              onClick={() => handleClick("list")}
            >
              <FaListUl
                size={17}
              />
            </Wrapper>
            <Wrapper 
              isActive={type === "group"}
              onClick={() => handleClick("group")}
            >
              <HiSquares2X2
                size={19}
              />
            </Wrapper>
          </Group>
          <Wrapper>
            <IoSearchOutline
              size={25}
            />
          </Wrapper>
        </FlexRow>
        <Button
          fontSize={15}
          Icon={IoMdAddCircleOutline}
          iconSize={18}
        >
          Nuevo producto
        </Button>
      </Filter>
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
              : <ProductList />
            )
        }
      </Section>
    </>
  );
}

export default Products;
