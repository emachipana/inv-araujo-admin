import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../styles";
import { useEffect, useState } from "react";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Card, ImageCard as AddCard, Section, Wrapper } from "./styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { BiSolidOffer } from "react-icons/bi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DiscountModal from "./DiscountModal";
import { useAdmin } from "../../../context/admin";
import DeleteModal from "./DeleteModal";
import { AiTwotoneFileAdd } from "react-icons/ai";
import ImageModal from "./ImageModal";
import ImageCard from "./ImageCard";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Product() {
  const [discountModal, setDiscountModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteProduct } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const product = await apiFetch(`products/${id}`);
        setProduct(product.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !product.name
          ? <Title>El producto no existe</Title>
          : <>
              <Title>{ product.name }</Title>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Marca
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{textTransform: "capitalize"}}
                      >
                        { product.brand }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Categoría
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { product.category.name }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Stock
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { product.stock }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Estado
                      </Text>
                      <Badge color={product.active ? "primary" : "danger"}>
                        { product.active ? "activo" : "inactivo" }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Precio compra
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.orange}
                      >
                        S/. { product.purchasePrice }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Precio venta
                      </Text>
                      <FlexRow>
                        <Text
                          size={15}
                          color={product.discount ? COLORS.taupe : COLORS.persian}
                          weight={600}
                          style={{textDecoration: product.discount ? "line-through" : "none"}}
                        >
                          S/. { product.price }
                        </Text>
                        {
                          product.discount
                          &&
                          <Text
                            size={15}
                            color={COLORS.orange}
                            weight={600}
                          >
                            S/. { product.discount.price.toFixed(1) }
                          </Text>
                        }
                      </FlexRow>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Ganancia
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.blue}
                      >
                        S/.
                        {" "} 
                        { 
                          ((
                            product.discount
                            ? product.discount.price 
                            : product.price
                          ) - product.purchasePrice).toFixed(2)
                        }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Descuento
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { product.discount ? product.discount.percentage : 0 }%
                      </Text>
                    </FlexColumn>
                    
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn 
                      gap={0.3}
                    >
                      <Text
                        weight={700}
                      >
                        Descripción
                      </Text>
                      <Text
                        align="flex-start"
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { product.description }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper isButtons>
                    <Button
                      Icon={BiSolidOffer}
                      fontSize={15}
                      iconSize={19}
                      color="secondary"
                      onClick={() => setDiscountModal(!discountModal)}
                    >
                      {
                        product.discount
                        ? "Editar dscto."
                        : "Crear dscto."
                      }
                    </Button>
                    <Button
                      Icon={FaEdit}
                      fontSize={15}
                      iconSize={18}
                      color="warning"
                      onClick={() => navigate("edit")}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => setDeleteModal(!deleteModal)}
                      Icon={FaTrashAlt}
                      fontSize={15}
                      iconSize={16}
                      color="danger"
                    >
                      Eliminar
                    </Button>
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                    <Text
                      weight={700}
                      size={17}
                    >
                      Imagenes
                    </Text>
                    <Wrapper wrap="true">
                      <AddCard
                        onClick={() => setImageModal(!imageModal)}
                      >
                        <AiTwotoneFileAdd 
                          size={70}
                          color={COLORS.dim}
                        />
                      </AddCard>
                      {
                        product?.images.map((image, index) => (
                          <ImageCard
                            key={index}
                            image={image}
                            product={product}
                            setProduct={setProduct}
                          />
                        ))
                      }
                    </Wrapper>
                  </FlexColumn>
                </Card>
              </Section>
              <DiscountModal
                product={product}
                isActive={discountModal}
                setIsActive={setDiscountModal}
                setMainProduct={setProduct}
              />
              <DeleteModal 
                id={product.id}
                isActive={deleteModal}
                setIsActive={setDeleteModal}
                handleDelete={deleteProduct}
                navTo="productos"
                title="¿Eliminar producto?"
              />
              <ImageModal 
                product={product}
                isActive={imageModal}
                setIsActive={setImageModal}
                setProduct={setProduct}
              />
            </>
        }
      </>
  );
}

export default Product;
