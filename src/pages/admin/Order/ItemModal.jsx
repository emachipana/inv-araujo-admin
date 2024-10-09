import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { FlexColumn, Text } from "../../../styles/layout";
import { List, Products } from "./styles";
import Input from "../../../components/Input";
import { BiSearch } from "react-icons/bi";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Product from "./Product";
import { filterProducts } from "./handlers";
import apiFetch from "../../../services/apiFetch";
import Button from "../../../components/Button";
import { FaShoppingCart } from "react-icons/fa";

function ItemModal({ isActive, setIsActive, order, setOrder, isToEdit = false, item, setItem }) {
  const [values, setValues] = useState({ productId: "", quantity: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { setError, backup, addOrderItem, editOrderItem } = useAdmin();

  useEffect(() => {
    const init = () => {
      const filteredProducts = filterProducts(order, backup);
      if(item) {
        setValues({
          productId: item.product.id,
          quantity: item.quantity
        });
      }

      setSearchProducts(filteredProducts);
    }

    init();
  }, [ backup, order, item ]);

  const onClose = () => {
    setValues({productId: "", quantity: 1});
    setSearch("");
    setIsActive(false);
    if(item) setItem(null);
  }

  const onSave = async () => {
    try {
      if(!values.productId && !values.quantity) return;
      setIsSaving(true);
      const body = {
        ...values,
        orderId: order.id
      }

      const updatedOrder = isToEdit ? await editOrderItem(item.id, body) : await addOrderItem(body);
      setOrder(updatedOrder);
      onClose();
      setIsSaving(false);
    }catch(error) {
      console.error(error);
      setError(error.message);
      setIsSaving(false);
    }
  }

  const onSearchChange = async (e) => {
    try {
      const value = e.target.value;
      setSearch(value);
      if(value.length >= 3) {
        setIsLoading(true);
        const searchedProducts = await apiFetch(`products/search?param=${value}`);
        const filteredProducts = filterProducts(order, searchedProducts);
        setSearchProducts(filteredProducts);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      const filteredProducts = filterProducts(order, backup);
      setSearchProducts(filteredProducts);
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Modal
      size="md"
      isActive={isActive}
      setIsActive={onClose}
    >
      <FlexColumn width="100%">
        <Text
          weight={700}
          size={18}
        >
          {
            isToEdit
            ? "Editar item"
            : "Elige un producto"
          }
        </Text>
        <Products>
          {
            !isToEdit
            &&
            <Input
              id="search"
              placeholder="Buscar un producto..."
              Icon={BiSearch}
              value={search}
              handleChange={onSearchChange}
              style={{width: "60%"}}
            />
          }
          <List height={isToEdit ? "auto" : ""}>
            {
              isLoading
              ? <Spinner color="secondary" />
              : <>
                  {
                    isToEdit
                    ? <Product
                        id={values.productId}
                        name={item.product.name}
                        price={item.product.price}
                        setValues={setValues}
                        isToEdit={true}
                        discount={item.product.discount}
                        stock={item.product.stock + item.quantity}
                        values={values}
                        images={item.product.images}
                        initialQuantity={item.quantity}
                      />
                    : searchProducts.map((product, index) => (
                        <Product 
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          setValues={setValues}
                          stock={product.stock}
                          values={values}
                          images={product.images}
                          discount={product.discount}
                          key={index}
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
          Icon={isSaving ? null : FaShoppingCart}
          disabled={isSaving || !values.productId || !values.quantity}
          onClick={onSave}
        >
          {
            isSaving
            ? <>
                <Spinner size="sm" />
                {
                  isToEdit
                  ? "Editando..."
                  : "Agregando..."
                }
              </>
            : (isToEdit ? "Editar" : "Agregar")
          }
        </Button>
      </FlexColumn>
    </Modal>
  );
}

export default ItemModal;
