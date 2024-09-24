import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import AlertError from "../../../components/AlertError";
import ProductForm from "../../../components/ProductForm";
import { Container } from "./styles";

function EditProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const { setError, error } = useAdmin();

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
          ? <Title>El producto que quieres editar no existe</Title>
          : <Container>
              <ProductForm 
                initialValues={{
                  ...product,
                  categoryId: product.category.id,
                  isActive: product.active
                }}
                productId={product.id}
              />
            </Container>
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

export default EditProduct;
