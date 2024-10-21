import { IoMdAddCircleOutline } from "react-icons/io";
import Button from "../../../components/Button";
import { Title } from "../styles";
import { Section as Filter } from "./styles";
import { useAdmin } from "../../../context/admin";
import { useEffect, useState } from "react";
import Banner from "../../../components/Banner";
import { Spinner } from "reactstrap";
import AlertError from "../../../components/AlertError";
import Modal from "../../../components/Modal";
import BannerForm from "../../../components/BannerForm";
import { Section } from "../Products/styles";

function Banners() {
  const [modalCreate, setModalCreate] = useState(false);
  const { isLoading, setIsLoading, error, setError, matcher, loadBanners, banners } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.banners) await loadBanners();
      }catch(error) {
        setIsLoading(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ loadBanners, matcher.banners, setError, setIsLoading ]);

  return (
    <>
      <Title>Banners</Title>
      <Filter>
        <Button
          style={{alignSelf: "flex-end"}}
          onClick={() => setModalCreate(!modalCreate)}
          fontSize={15}
          Icon={IoMdAddCircleOutline}
          iconSize={18}
        >
          Nuevo banner
        </Button>
      </Filter>
      <Section style={{alignItems: "flex-start"}}>
        {
          isLoading
          ? <Spinner color="secondary" />
          : banners?.map((banner, index) => (
              <Banner 
                key={index}
                id={banner.id}
                isUsed={banner.used}
                description={banner.description}
                title={banner.title}
                products={banner.products || []}
                markedWord={banner.markedWord}
              />
            ))
        }
      </Section>
      <Modal
        isActive={modalCreate}
        setIsActive={setModalCreate}
      >
        <BannerForm isToCreate />
      </Modal>
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

export default Banners;
