import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import BannerForm from "../../../components/BannerForm";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";

function EditBanner() {
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const banner = await apiFetch(`offers/${id}`);
        setBanner(banner.data);
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
          !banner.title
          ? <Title>El banner que quieres editar no existe</Title>
          : <Container>
              <BannerForm
                width="400px"
                initialValues={banner}
                bannerId={banner.id}
                setIsActive={() => {}}
              />
            </Container>
        }
      </>
  );
}

export default EditBanner;
