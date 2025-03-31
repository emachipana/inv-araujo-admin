import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import ProductForm from "../../../components/ProductForm";
import { Container } from "./styles";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function EditProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const { id } = useParams();

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
          ? <Title>El producto que quieres editar no existe</Title>
          : <Container>
              <ProductForm 
                initialValues={{
                  ...product,
                  categoryId: product.categoryId,
                  isActive: product.active
                }}
                productId={product.id}
              />
            </Container>
        }
      </>
  );
}

export default EditProduct;
