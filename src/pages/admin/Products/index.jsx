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

function Products() {
  const { products, isLoading } = useAdmin();
  const [type, setType] = useState("group");

  return (
    <>
      <Title>Productos</Title>
      <Categories />
      <Filter>
        <FlexRow gap={1}>
          <Wrapper>
            <IoSearchOutline
              size={25}
            />
          </Wrapper>
          <Group>
            <Wrapper 
              isActive={type === "list"} 
              onClick={() => setType("list")}
            >
              <FaListUl
                size={18}
              />
            </Wrapper>
            <Wrapper 
              isActive={type === "group"}
              onClick={() => setType("group")}
            >
              <HiSquares2X2

                size={20}
              />
            </Wrapper>
          </Group>
        </FlexRow>
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
              : "view in list"
            )
        }
      </Section>
    </>
  );
}

export default Products;
