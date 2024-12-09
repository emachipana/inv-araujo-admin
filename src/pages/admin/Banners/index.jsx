import { IoMdAddCircleOutline } from "react-icons/io";
import Button from "../../../components/Button";
import { Title } from "../styles";
import { Section as Filter } from "./styles";
import { useAdmin } from "../../../context/admin";
import { useEffect, useState } from "react";
import Banner from "../../../components/Banner";
import { Spinner } from "reactstrap";
import Modal from "../../../components/Modal";
import BannerForm from "../../../components/BannerForm";
import { Section } from "../Products/styles";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";

function Banners() {
  const [modalCreate, setModalCreate] = useState(false);
  const { isLoading, setIsLoading, loadBanners, banners } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadBanners();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadBanners, setIsLoading ]);

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
    </>
  );
}

export default Banners;
