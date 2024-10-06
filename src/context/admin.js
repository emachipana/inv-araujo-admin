import { createContext, useContext, useState } from "react";
import apiFetch from "../services/apiFetch";
import depJson from "../data/departamentos.json";
import provJson from "../data/provincias.json";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [backup, setBackup] = useState([]);
  const [tubers, setTubers] = useState([]);
  const [vitroOrders, setVitroOrders] = useState([]);
  const [vitroOrdersBack, setVitroOrdersBack] = useState([]);
  const [orders, setOrders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState({});
  const [error, setError] = useState(null);
  const [matcher, setMatcher] = useState({
    products: false,
    vitroOrder: false,
    orders: false,
    departments: false,
    tubers: false
  });

  const loadTubers = async () => {
    setIsLoading(true);
    const tubers = await apiFetch("tubers");
    setTubers(tubers);
    setMatcher(matcher => ({...matcher, tubers: true}));
    setIsLoading(false);
  }

  const loadDepartments = () => {
    setDepartments(depJson);
    setProvinces(provJson);
    setMatcher(matcher => ({...matcher, departments: true}));
  }

  const loadProducts = async () => {
    setIsLoading(true);
    const categories = await apiFetch("categories");
    const products = await apiFetch("products");
    setCategories(categories);
    setProducts(products);
    setBackup(products);
    setMatcher(matcher => ({...matcher, products: true}));
    setIsLoading(false);
  }

  const loadVitroOrders = async () => {
    setIsLoading(true);
    const tubers = await apiFetch("tubers");
    const vitroOrders = await apiFetch("vitroOrders");
    setTubers(tubers);
    setVitroOrders(vitroOrders);        
    setVitroOrdersBack(vitroOrders);
    setMatcher(matcher => ({...matcher, vitroOrders: true, tubers: true}));
    setIsLoading(false);
  }

  const loadOrders = async () => {
    setIsLoading(true);
    const orders = await apiFetch("orders");
    setOrders(orders);
    setMatcher(matcher => ({...matcher, orders: true}));
    setIsLoading(false);
  }

  const updateCategory = async (id, body) => {
    const newCategory = await apiFetch(`categories/${id}`, { body, method: "PUT" });
    const tempCategories = categories;
    const index = categories.findIndex(category => category.id === id);
    tempCategories[index] = newCategory.data;
    setCategories([...tempCategories]);
  }

  const updateSubCategory = async (id, body) => {
    const { categoryId } = body;
    const updatedCategory = await apiFetch(`categories/${id}`, { body, method: "PUT" });
    const category = categories.find(category => category.id === categoryId);
    const tempSubCategories = category.subCategories;
    const index = category.subCategories.findIndex(subCategory => subCategory.id === id);
    tempSubCategories[index] = updatedCategory.data;
    category.subCategories = tempSubCategories;
    const tempCategories = categories;
    const categoryIndex = categories.findIndex(category => category.id === categoryId);
    tempCategories[categoryIndex] = category;
    setCategories([...tempCategories]);
  }

  const deleteCategory = async (id) => {
    await apiFetch(`categories/${id}`, { method: "DELETE" });
    const newCategories = categories.filter(category => category.id !== id);
    setCategories([...newCategories]);
  }

  const deleteSubCategory = async (id, parentId) => {
    await apiFetch(`categories/${id}`, { method: "DELETE" });
    const category = categories.find(category => category.id === parentId);
    const tempCategories = categories;
    const index = categories.findIndex(category => category.id === parentId);
    category.subCategories = category.subCategories.filter(subCategory => subCategory.id !== id);
    tempCategories[index] = category;
    setCategories([...tempCategories]);
  }

  const addCategory = async (body) => {
    const newCategory = await apiFetch("categories", { body });
    setCategories(categories => [...categories, newCategory.data]);
  }

  const addSubCategory = async (body) => {
    const { categoryId } = body;
    const newSubCategory = await apiFetch("categories", { body });
    const category = categories.find(category => category.id === (categoryId * 1));
    category.subCategories = [...category.subCategories || [], {...newSubCategory.data, subCategories: []}];
    const index = categories.findIndex(category => category.id === (categoryId * 1));
    const tempCategories = categories;
    tempCategories[index] = category;
    setCategories([...tempCategories]);
  }

  const updateProduct = async (id, body) => {
    const updatedProduct = await apiFetch(`products/${id}`, { body, method: "PUT" });
    setProduct(id, updatedProduct.data);
    return updatedProduct.data;
  }

  const addProduct = async (body) => {
    const newProduct = await apiFetch("products", { body });
    setProducts(products => [...products, newProduct.data]);
    setBackup(products => [...products, newProduct.data]);
    return newProduct.data;
  }

  const addVitro = async (body) => {
    const newVitro = await apiFetch("vitroOrders", { body });
    setVitroOrders(vitros => [...vitros, newVitro.data]);
    setVitroOrdersBack(vitros => [...vitros, newVitro.data]);
    return newVitro.data;
  }

  const setProduct = (id, product) => {
    const tempProducts = products;
    const tempBackup = backup;
    const index = tempProducts.findIndex(product => product.id === id);
    const indexBackup = tempBackup.findIndex(product => product.id === id);
    tempProducts[index] = product;
    tempBackup[indexBackup] = product;
    setProducts([...tempProducts]);
    setBackup([...tempBackup]);
  }

  const deleteProduct = async (id) => {
    await apiFetch(`products/${id}`, { method: "DELETE" });
    const updatedProducts = products.filter(product => product.id !== id);
    const updatedBackup = backup.filter(product => product.id !== id);
    setProducts([...updatedProducts]);
    setBackup([...updatedBackup]);
  }

  const addProductImage = async (product, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const image = await apiFetch("images", { body: formData, isFile: true });
    const body = {
      productId: product.id,
      imageId: image.data.id
    }
    const newProductImage = await apiFetch("productImages", { body });
    const images = product.images ? [...product.images, newProductImage.data] : [newProductImage.data];
    const updatedProduct = {...product, images};
    setProduct(product.id, updatedProduct);
    return updatedProduct;
  }

  const deleteProductImage = async (imageId, product) => {
    await apiFetch(`productImages/${imageId}`, { method: "DELETE" });
    const images = product.images.filter(image => image.id !== imageId);
    const updatedProduct = {...product, images};
    setProduct(product.id, updatedProduct);
    return updatedProduct;
  }

  const updateTuber = async (id, body) => {
    const newTuber = await apiFetch(`tubers/${id}`, { body, method: "PUT" });
    const tempTubers = tubers;
    const index = tubers.findIndex(tuber => tuber.id === id);
    tempTubers[index] = newTuber.data;
    setTubers([...tempTubers]);
  }

  const deleteTuber = async (id) => {
    await apiFetch(`tubers/${id}`, { method: "DELETE" });
    const updatedTubers = tubers.filter(tuber => tuber.id !== id);
    setTubers([...updatedTubers]);
  }

  const addTuber = async (body) => {
    const newTuber = await apiFetch("tubers", { body });
    setTubers(tubers => [...tubers, newTuber.data]);
  }

  const addVariety = async (body) => {
    const { tuberId } = body;
    const newVariety = await apiFetch("varieties", { body });
    const tuber = tubers.find(tuber => tuber.id === (tuberId * 1));
    tuber.varieties = [...tuber.varieties || [], newVariety.data];
    const index = tubers.findIndex(tuber => tuber.id === (tuberId * 1));
    const tempTubers = tubers;
    tempTubers[index] = tuber;
    setTubers([...tempTubers]);
  }

  const updateVariety = async (body) => {
    const { id, ...toUpdate } = body;
    await apiFetch(`varieties/${id}`, { body: toUpdate, method: "PUT" });
    const tubers = await apiFetch("tubers");
    setTubers(tubers);
  }

  const deleteVariety = async (id, tuberId) => {
    await apiFetch(`varieties/${id}`, { method: "DELETE" });
    const tuber = tubers.find(tuber => tuber.id === tuberId);
    const tempTubers = tubers;
    const index = tubers.findIndex(tuber => tuber.id === tuberId);
    tuber.varieties = tuber.varieties.filter(variety => variety.id !== id);
    tempTubers[index] = tuber;
    setTubers([...tempTubers]);
  }

  const deleteVitro  = async (id) => {
    await apiFetch(`vitroOrders/${id}`, { method: "DELETE" });
    const updatedOrders = vitroOrders.filter(order => order.id !== id);
    const updatedBackup = vitroOrdersBack.filter(order => order.id !== id);
    setVitroOrders([...updatedOrders]);
    setVitroOrdersBack([...updatedBackup]);
  }

  const updateVitro = async (id, body) => {
    const updatedVitro = await apiFetch(`vitroOrders/${id}`, { body, method: "PUT" });
    setVitro(id, updatedVitro.data);
    return updatedVitro.data;
  }

  const setVitro = (id, order) => {
    const tempOrders = vitroOrders;
    const tempBackup = vitroOrdersBack;
    const index = tempOrders.findIndex(order => order.id === id);
    const indexBack = tempBackup.findIndex(order => order.id === id);
    tempOrders[index] = order;
    tempBackup[indexBack] = order;
    setVitroOrders([...tempOrders]);
    setVitroOrdersBack([...tempBackup]);
  }

  const addItem = async (body) => {
    const { vitroOrderId } = body;
    await apiFetch("orderVarieties", { body });
    return getVitroOrder(vitroOrderId);
  }

  const editItem = async (id, body) => {
    const { vitroOrderId } = body;
    await apiFetch(`orderVarieties/${id}`, { body, method: "PUT" });
    return getVitroOrder(vitroOrderId);
  }

  const deleteItem = async (id, vitroOrderId) => {
    await apiFetch(`orderVarieties/${id}`, { method: "DELETE" });
    return getVitroOrder(vitroOrderId);
  }

  const addOrder = async (values) => {
    const now = new Date();
    const clientBody = {
      ...values,
      documentType: (values.documentType * 1) === 1 ? "DNI" : "RUC",
      email: values.email ? values.email : `${now.getTime()}@inversiones.com`
    }
    const newClient = await apiFetch("clients", { body: clientBody });

    const orderBody = {
      clientId: newClient.data.id,
      shipType: (values.shipType * 1) === 1 ? "EXPRESS" : "NORMAL",
      payType: (values.payType * 1) === 1 ? "DEPOSITO" : "TARJETA",
      destination: newClient.data.city
    }
    const newOrder = await apiFetch("orders", { body: orderBody });
    setOrders(orders => [...orders, newOrder.data]);
    return newOrder.data;
  }

  const deleteOrder = async (id) => {
    await apiFetch(`orders/${id}`, { method: "DELETE" });
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders([...updatedOrders]);
  }

  const addAdvance = async (body) => {
    const { vitroOrderId } = body;
    await apiFetch("advances", { body });
    return getVitroOrder(vitroOrderId);
  }

  const editAdvance = async (id, body) => {
    const { vitroOrderId } = body;
    await apiFetch(`advances/${id}`, { body, method: "PUT" });
    return getVitroOrder(vitroOrderId);
  }

  const deleteAdvance = async (id, vitroId) => {
    await apiFetch(`advances/${id}`, { method: "DELETE" });
    return getVitroOrder(vitroId);
  }

  const getVitroOrder = async (id) => {
    const vitroOrder = await apiFetch(`vitroOrders/${id}`);
    setVitro(vitroOrder.data.id, vitroOrder.data);
    return vitroOrder.data;
  }

  return (
    <AdminContext.Provider
      value={{
        categories,
        products,
        backup,
        error,
        isLoading,
        tubers,
        vitroOrders,
        vitroOrdersBack,
        orders,
        matcher,
        departments,
        provinces,
        loadDepartments,
        setTubers,
        setVitroOrders,
        setCategories,
        setProducts,
        setError,
        updateCategory,
        updateSubCategory,
        deleteCategory,
        deleteSubCategory,
        addCategory,
        addSubCategory,
        updateProduct,
        addProduct,
        setProduct,
        deleteProduct,
        addProductImage,
        updateTuber,
        deleteTuber,
        deleteVariety,
        addTuber,
        addVariety,
        updateVariety,
        addVitro,
        deleteVitro,
        addItem,
        editItem,
        deleteItem,
        updateVitro,
        addOrder,
        deleteOrder,
        loadProducts,
        loadOrders,
        loadVitroOrders,
        loadTubers,
        addAdvance,
        editAdvance,
        deleteAdvance,
        deleteProductImage
      }}
    >
      { children }
    </AdminContext.Provider>
  );
}

const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };
