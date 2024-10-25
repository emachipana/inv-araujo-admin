import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, Text } from "../../../styles/layout";
import { Content } from "../../../components/Banner/styles";
import { handleChecked, parsedTitle } from "../../../components/Banner/handlers";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import Item from "./Item";
import ItemModal from "./ItemModal";
import DeleteModal from "../Product/DeleteModal";
import AlertError from "../../../components/AlertError";

function Banner() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [banner, setBanner] = useState({});
  const { error, setError, deleteBanner, matcher, loadProducts, updateBanner } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const banner = await apiFetch(`offers/${id}`);
        if(!matcher.products) {
          setIsLoading(true);
          await loadProducts();
        }

        setBanner(banner.data);
        setIsUsed(banner.data.used);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setIsLoading(false);
        setError(error.message);
      }
    }

    fetch();
  }, [ id, loadProducts, matcher.products, setError ]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !banner.title
          ? <Title>El banner no existe</Title>
          : <>
              <Title>Detalle</Title>
              <Section>
                <Card>
                  <FlexColumn gap={0.3}>
                    <Text weight={700}>
                      Título
                    </Text>
                    <Content 
                      size={30}
                      height={35}
                      dangerouslySetInnerHTML={parsedTitle(banner.title, banner.markedWord)}
                      color={COLORS.dim}
                    />
                  </FlexColumn>
                  <FlexColumn gap={0.3}>
                    <Text weight={700}>
                      Descripción
                    </Text>
                    <Text
                      align="start"
                      weight={600}
                      size={15}
                      color={COLORS.dim}
                    >
                      { banner.description }
                    </Text>
                  </FlexColumn>
                  <FlexColumn>
                    <Text weight={700}>
                      Estado
                    </Text>
                    <Badge
                      color={isUsed ? "primary" : "danger"}
                    >
                      { isUsed ? "En uso" : "Sin usar" }
                    </Badge>
                  </FlexColumn>
                  <Wrapper 
                    isButtons
                    style={{marginTop: "0.5rem"}}
                  >
                    <Button
                      Icon={MdDiscount}
                      fontSize={15}
                      iconSize={17}
                      color="secondary"
                      onClick={(e) => handleChecked(e, isUsed, banner, setIsUsed, updateBanner, setError)}
                    >
                      { banner.used ? "Dejar de usar" : "Empezar a usar" }
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
                      size={18}
                    >
                      Productos
                    </Text>
                    <FlexColumn
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        banner.products?.map((item, index) => (
                          <Item 
                            key={index}
                            item={item}
                            setBanner={setBanner}
                            banner={banner}
                          />
                        ))
                      }
                      {
                        banner.products.length < 4
                        &&
                        <Button
                          style={{marginTop: "1rem"}}
                          fontSize={16}
                          iconSize={18}
                          Icon={MdDiscount}
                          onClick={() => setItemModal(!itemModal)}
                        >
                          Agregar producto
                        </Button>
                      }
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
              <ItemModal 
                banner={banner}
                isActive={itemModal}
                setBanner={setBanner}
                setIsActive={setItemModal}
              />
              <DeleteModal 
                handleDelete={deleteBanner}
                id={banner.id}
                isActive={deleteModal}
                navTo="banners"
                setIsActive={setDeleteModal}
                title="¿Eliminar banner?"
              />
            </>
        }
        {
          error
          &&
          <AlertError 
            error={error}
            setError={setError}
          />
        }
      </>
  );
}

export default Banner;
