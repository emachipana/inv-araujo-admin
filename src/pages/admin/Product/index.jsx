import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../styles";
import { useEffect, useState } from "react";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Card, Image, ImageCard, Section, Wrapper } from "./styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { BiSolidOffer } from "react-icons/bi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DiscountModal from "./DiscountModal";
import { useAdmin } from "../../../context/admin";
import AlertError from "../../../components/AlertError";
import DeleteModal from "./DeleteModal";
import { AiTwotoneFileAdd } from "react-icons/ai";
import ImageModal from "./ImageModal";

function Product() {
  const [discountModal, setDiscountModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, setError, deleteProduct } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const product = await apiFetch(`products/${id}`);
        setProduct(product.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error.message);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [id, setError]);

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
                <Card position="first">
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
                        Precio
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
                            S/. { product.discount.price }
                          </Text>
                        }
                      </FlexRow>
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
                    <Wrapper justify="center" isButtons>
                      <ImageCard
                        onClick={() => setImageModal(!imageModal)}
                      >
                        <AiTwotoneFileAdd 
                          size={70}
                          color={COLORS.dim}
                        />
                      </ImageCard>
                      {
                        product?.images.map((image, index) => (
                          <ImageCard key={index}>
                            <Image
                              src={image.image.url}
                              alt={`${product.name}-${index + 1}`}
                            />
                          </ImageCard>
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
        {
          error
          &&
          <AlertError 
            error={error}
            setError={setError}
            from="product"
          />
        }
      </>
  );
}

export default Product;
