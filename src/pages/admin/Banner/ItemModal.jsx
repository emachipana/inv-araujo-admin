import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import { filterProducts, onSearchChange } from "../Order/handlers";
import { FlexColumn, Text } from "../../../styles/layout";
import { List, Products } from "../Order/styles";
import Input from "../../../components/Input";
import { BiSearch } from "react-icons/bi";
import { Spinner } from "reactstrap";
import Product from "../Order/Product";
import Button from "../../../components/Button";
import { MdDiscount } from "react-icons/md";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";

function ItemModal({ isActive, setIsActive, banner, setBanner }) {
  const [values, setValues] = useState({ productId: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { backup, addBannerItem } = useAdmin();

  useEffect(() => {
    const init = () => {
      const filteredProducts = filterProducts(banner.products, backup);
      setSearchProducts(filteredProducts);
    }

    init();
  }, [ banner.products, backup ]);

  const onClose = () => {
    setValues({ productId: "" });
    setSearch("");
    setIsActive(false);
  }

  const onSave = async () => {
    try {
      if(!values.productId) return;
      setIsSaving(true);
      const body = {
        ...values,
        offerId: banner.id
      }

      const updatedBanner = await addBannerItem(body);
      setBanner(updatedBanner);
      onClose();
      setIsSaving(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <FlexColumn width="100%">
        <Text
          weight={700}
          size={18}
        >
          Elige un producto
        </Text>
        <Products>
          <Input 
            id="search"
            placeholder="Buscar un producto..."
            Icon={BiSearch}
            value={search}
            handleChange={(e) => onSearchChange(e, setSearch, setIsLoading, banner.products, setSearchProducts, backup, isLoading)}
            style={{width: "60%"}}
          />
          <List>
            {
              isLoading
              ? <Spinner color="secondary" />
              : <>
                  {
                    searchProducts.map((product, index) => (
                      <Product 
                        key={index}
                        discount={product.discount}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        setValues={setValues}
                        values={values}
                        images={product.images}
                        isToBanner
                      />
                    ))
                  }
                </>
            }
          </List>
        </Products>
        <Button
          style={{alignSelf: "center", marginTop: "1rem"}}
          fontSize={16}
          iconSize={18}
          Icon={isSaving ? null : MdDiscount}
          disabled={isSaving || !values.productId}
          onClick={onSave}
        >
          {
            isSaving
            ? <>
                <Spinner size="sm" />
                Agregando...
              </>
            : "Agregar"
          }
        </Button>
      </FlexColumn>
    </Modal>
  );
}

export default ItemModal;
