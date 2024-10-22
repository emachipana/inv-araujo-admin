import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import BannerForm from "../../../components/BannerForm";
import AlertError from "../../../components/AlertError";

function EditBanner() {
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState({});
  const { id } = useParams();
  const { setError, error } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const banner = await apiFetch(`offers/${id}`);
        setBanner(banner.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id, setError ]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !banner.title
          ? <Title>El banner que quieres editar no existe</Title>
          : <Container>
              <BannerForm
                width="400px"
                initialValues={banner}
                bannerId={banner.id}
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

export default EditBanner;
