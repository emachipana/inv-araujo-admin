import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import Modal from "../../../components/Modal";
import { Formik } from "formik";
import { Form } from "../../../styles/layout";
import { Spinner } from "reactstrap";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Title } from "../../../components/ProductForm/styles";
import Select from "../../../components/Input/Select";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { List, Products } from "../Order/styles";
import { BiSearch } from "react-icons/bi";
import Product from "./Product";
import { onSearchChange } from "../Order/handlers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function BatchModal({isActive, setIsActive}) {
  const [productId, setProductId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [opWarehouses, setOpWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const { loadWarehouses, warehousesBackup, backup, isLoading, newBatch } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadWarehouses();

      setSearchProducts(backup.content);
      setOpWarehouses(warehousesBackup.map((war) => ({id: war.id, content: war.name})))
    }

    init();
  }, [loadWarehouses, backup, warehousesBackup]);

  const initialValues = {
    warehouseId: "",
    quantity: "",
  }

  const onClose = () => {
    setProductId(null);
    setSearch("");
    setIsActive(false);
  }

  const validate = (values) => {
    const errors = {};

    if(!values.warehouseId) errors.warehouseId = "Este campo es obligatorio";

    if(!values.quantity) errors.quantity = "Este campo es obligatorio";

    return errors;
  }

  const onSubmit = async (values) => {
    const body = {...values, productId};
    
    try {
      setIsSaving(true);
      await newBatch(body);
      setIsSaving(false);
      navigate(`/productos/${productId}`);
    }catch(e) {
      setIsSaving(false);
      toast.error(e.message);
    }
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleSubmit,
          handleChange,
          handleBlur
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>Nuevo lote</Title>
            {
              isLoading
              ? <Spinner />
              : <>
                  <Select
                    id="warehouseId"
                    label="Almacén"
                    error={errors.warehouseId}
                    touched={touched.warehouseId}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    options={opWarehouses}
                    value={values.warehouseId}
                  />
                  <Input
                    id="quantity"
                    label="Cantidad"
                    placeholder="Cantidad del nuevo lote"
                    error={errors.quantity}
                    touched={touched.quantity}
                    value={values.quantity}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                  <Products>
                    <Input
                      id="search"
                      placeholder="Buscar un producto..."
                      Icon={BiSearch}
                      value={search}
                      handleChange={(e) => onSearchChange(e, setSearch, setIsSearching, [], setSearchProducts, backup, isSearching)}
                    />
                    <List height="200px">
                      {
                        isLoading || isSearching
                        ? <Spinner />
                        : searchProducts?.map((product, index) => (
                            <Product 
                              key={index}
                              product={product}
                              currentProductId={productId}
                              setProductId={setProductId}
                            />
                          ))
                      }
                    </List>
                  </Products>
                  <Button
                    type="submit"
                    iconSize={18}
                    fontSize={17}
                    size="full"
                    style={{marginTop: "0.7rem"}}
                    disabled={!isValid || isSaving || !productId}
                    Icon={isSaving ? null : IoMdAddCircleOutline}
                  >
                    
                    {
                      isSaving
                      ? <>
                          <Spinner size="sm" />
                          {" "}
                          Agregando...
                        </>
                      : "Agregar"
                    }
                  </Button>
                </>
            }
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default BatchModal;
