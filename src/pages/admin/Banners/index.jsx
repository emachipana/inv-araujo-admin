import { RiSlideshow2Fill } from "react-icons/ri";
import Button from "../../../components/Button";
import { Title } from "../styles";
import { useAdmin } from "../../../context/admin";
import { useEffect } from "react";
import Banner from "../../../components/Banner";
import { Spinner } from "reactstrap";
import Modal from "../../../components/Modal";
import BannerForm from "../../../components/BannerForm";
import { Section } from "../Products/styles";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";

function Banners() {
  const { isLoading, setIsLoading, loadBanners, banners } = useAdmin();
  const { bannersModal: modalCreate, setBannersModal: setModalCreate } = useModal();
  const { user } = useAuth();

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
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn gap={0.1}>
          <Title>Banners</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los banners de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("BANNERS_CREATE")
          &&
          <Button
            style={{alignSelf: "flex-end"}}
            onClick={() => setModalCreate(!modalCreate)}
            fontSize={15}
            Icon={RiSlideshow2Fill}
            iconSize={18}
          >
            Nuevo banner
          </Button>
        }
      </FlexRow>
      <Section style={{alignItems: "flex-start"}}>
        {
          isLoading
          ? <Spinner color="secondary" />
          : banners?.map((banner, index) => (
              <Banner 
                key={index}
                id={banner.id}
                isUsed={banner.isUsed}
                description={banner.description}
                title={banner.title}
                items={banner.items || []}
                markedWord={banner.markedWord}
              />
            ))
        }
      </Section>
      <Modal
        isActive={modalCreate}
        setIsActive={setModalCreate}
      >
        <BannerForm 
          isToCreate
          setIsActive={setModalCreate}
        />
      </Modal>
    </>
  );
}

export default Banners;
