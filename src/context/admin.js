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
  const [ordersBackup, setOrdersBackup] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoicesBackup, setInvoicesBackup] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState({});
  const [banners, setBanners] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientsBackup, setClientsBackup] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [matcher, setMatcher] = useState({
    products: false,
    vitroOrder: false,
    orders: false,
    departments: false,
    tubers: false,
    invoices: false,
    banners: false,
    clients: false,
    expenses: false
  });

  const loadExpenses = async () => {
    const expenses = await apiFetch("profits");
    setExpenses(expenses);
    setMatcher(matcher => ({...matcher, expenses: true}));
  }

  const loadClients = async () => {
    const clients = await apiFetch("clients");
    setClients(clients);
    setClientsBackup(clients);
    setMatcher(matcher => ({...matcher, clients: true}));
  }

  const loadBanners = async () => {
    const banners = await apiFetch("offers");
    setBanners(banners);
    setMatcher(matcher => ({...matcher, banners: true}));
  }

  const loadInvoices = async () => {
    const invoices = await apiFetch("invoices");
    const reversed = invoices.reverse();
    setInvoices(reversed);
    setInvoicesBackup(reversed);
    setMatcher(matcher => ({...matcher, invoices: true}));
  }

  const loadTubers = async () => {
    const tubers = await apiFetch("tubers");
    setTubers(tubers);
    setMatcher(matcher => ({...matcher, tubers: true}));
  }

  const loadDepartments = () => {
    setDepartments(depJson);
    setProvinces(provJson);
    setMatcher(matcher => ({...matcher, departments: true}));
  }

  const loadProducts = async () => {
    const categories = await apiFetch("categories");
    const products = await apiFetch("products");
    setCategories(categories);
    setProducts(products);
    setBackup(products);
    setMatcher(matcher => ({...matcher, products: true}));
  }

  const loadVitroOrders = async () => {
    const tubers = await apiFetch("tubers");
    const vitroOrders = await apiFetch("vitroOrders");
    setTubers(tubers);
    const reversed = vitroOrders.reverse();
    setVitroOrders(reversed);        
    setVitroOrdersBack(reversed);
    setMatcher(matcher => ({...matcher, vitroOrders: true, tubers: true}));
  }

  const loadOrders = async () => {
    const orders = await apiFetch("orders");
    const reversed = orders.reverse();
    setOrders(reversed);
    setOrdersBackup(reversed);
    setMatcher(matcher => ({...matcher, orders: true}));
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

  const addBanner = async (body) => {
    const newBanner = await apiFetch("offers", { body });
    setBanners(banners => [...banners, newBanner.data]);
    return newBanner.data;
  }

  const addVitro = async (body) => {
    const newVitro = await apiFetch("vitroOrders", { body });
    setVitroOrders(vitros => [newVitro.data, ...vitros]);
    setVitroOrdersBack(vitros => [newVitro.data, ...vitros]);
    return newVitro.data;
  }

  const addOrder = async (body) => {
    const newOrder = await apiFetch("orders", { body });
    setOrders(orders => [newOrder.data, ...orders]);
    setOrdersBackup(orders => [newOrder.data, ...orders]);
    return newOrder.data;
  }

  const addClient = async (body) => {
    const newClient = await apiFetch("clients", { body });
    setClients(clients => [...clients, newClient.data]);
    setClientsBackup(clients => [...clients, newClient.data]);
    return newClient.data;
  }

  const addInvoice = async (body) => {
    const newInvoice = await apiFetch("invoices", { body });
    setInvoices(invoices => [newInvoice.data, ...invoices]);
    setInvoicesBackup(invoices => [newInvoice.data, ...invoices]);
    return newInvoice.data;
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
    const vitro = vitroOrdersBack.find(vitroO => vitroO.id === id);
    if(!!vitro.invoice && matcher.invoices) setMatcher(matcher => ({...matcher, invoices: false}));
    const updatedOrders = vitroOrders.filter(order => order.id !== id);
    const updatedBackup = vitroOrdersBack.filter(order => order.id !== id);
    setVitroOrders([...updatedOrders]);
    setVitroOrdersBack([...updatedBackup]);
  }

  const deleteOrder = async (id) => {
    await apiFetch(`orders/${id}`, { method: "DELETE" });
    const order = ordersBackup.find(orderF => orderF.id === id);
    if(!!order.invoice && matcher.invoices) setMatcher(matcher => ({...matcher, invoices: false}));
    setMatcher(matcher => ({...matcher, expenses: false, clients: false}));
    const updatedOrders = orders.filter(order => order.id !== id);
    const updatedBackup = ordersBackup.filter(order => order.id !== id); 
    setOrders([...updatedOrders]);
    setOrdersBackup([...updatedBackup]);
  }

  const updateVitro = async (id, body) => {
    const updatedVitro = await apiFetch(`vitroOrders/${id}`, { body, method: "PUT" });
    setVitro(id, updatedVitro.data);
    return updatedVitro.data;
  }

  const updateInvoice = async (id, body) => {
    const { comment, issueDate, address } = body;
    const updatedInvoice = await apiFetch(`invoices/${id}`, { body: { comment, issueDate, address }, method: "PUT" });
    setInvoice(id, updatedInvoice.data);
    return updatedInvoice.data;
  }

  const updateBanner = async (id, body) => {
    const updatedBanner = await apiFetch(`offers/${id}`, { body, method: "PUT" });
    setBanner(id, updatedBanner.data);
    return updatedBanner.data;
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

  const setOrder = (id, order) => {
    const tempOrders = orders;
    const tempBack = ordersBackup;
    const index = tempOrders.findIndex(order => order.id === id);
    const indexBack = tempBack.findIndex(order => order.id === id);
    tempOrders[index] = order;
    tempBack[indexBack] = order;
    setOrders([...tempOrders]);
    setOrdersBackup([...tempBack]);
  }

  const setExpense = (id, expense) => {
    const tempExpenses = expenses;
    const index = tempExpenses.findIndex(expense => expense.id === id);
    tempExpenses[index] = expense;
    setExpenses([...tempExpenses]);
  }

  const setInvoice = (id, invoice) => {
    const tempInvoices = invoices;
    const tempBackup = invoicesBackup;
    const index = tempInvoices.findIndex(invoice => invoice.id === id);
    const indexBackup = tempBackup.findIndex(invoice => invoice.id === id);
    tempInvoices[index] = invoice;
    tempBackup[indexBackup] = invoice;
    setInvoices([...tempInvoices]);
    setInvoicesBackup([...tempBackup]);
  }

  const setBanner = (id, banner) => {
    const tempBanners = banners;
    const index = tempBanners.findIndex(banner => banner.id === id);
    tempBanners[index] = banner;
    setBanners([...tempBanners]);
  }

  const addItem = async (body) => {
    const { vitroOrderId } = body;
    await apiFetch("orderVarieties", { body });
    return getVitroOrder(vitroOrderId);
  }

  const addExpenseItem = async (body) => {
    const { profitId } = body;
    await apiFetch("expenses", { body });
    return getExpense(profitId);
  }

  const addInvoiceItem = async (body) => {
    const { invoiceId } = body;
    await apiFetch("invoiceItems", { body });
    return getInvoice(invoiceId);
  }
 
  const editItem = async (id, body) => {
    const { vitroOrderId } = body;
    await apiFetch(`orderVarieties/${id}`, { body, method: "PUT" });
    return getVitroOrder(vitroOrderId);
  }

  const editExpenseItem = async (id, body) => {
    const { profitId } = body;
    await apiFetch(`expenses/${id}`, { body, method: "PUT" });
    return getExpense(profitId);
  }

  const editInvoiceItem = async (id, body) => {
    const { invoiceId } = body;
    await apiFetch(`invoiceItems/${id}`, { body, method: "PUT" });
    return getInvoice(invoiceId);
  }

  const generateDoc = async (invoiceId) => {
    await apiFetch(`invoices/generatePDF/${invoiceId}`, { method: "POST" });
    return getInvoice(invoiceId);
  }

  const deleteDocInvoice = async (invoiceId) => {
    await apiFetch(`invoices/deletePDF/${invoiceId}`, { method: "DELETE" });
    return getInvoice(invoiceId);
  }

  const deleteItem = async (id, vitroOrderId) => {
    await apiFetch(`orderVarieties/${id}`, { method: "DELETE" });
    return getVitroOrder(vitroOrderId);
  }

  const deleteExpenseItem = async (id, profitId) => {
    await apiFetch(`expenses/${id}`, { method: "DELETE" });
    return getExpense(profitId);
  }

  const deleteInvoiceItem = async (id, invoiceId) => {
    await apiFetch(`invoiceItems/${id}`, { method: "DELETE" });
    return getInvoice(invoiceId);
  }

  const updateOrder = async (id, body) => {
    const updatedOrder = await apiFetch(`orders/${id}`, { body, method: "PUT" });
    setOrder(id, updatedOrder.data);
    return updatedOrder.data;
  }

  const deleteBanner = async (id) => {
    await apiFetch(`offers/${id}`, { method: "DELETE" });
    const updatedBanners = banners.filter(banner => banner.id !== id);
    setBanners([...updatedBanners]);
  }

  const deleteInvoice = async (id) => {
    await apiFetch(`invoices/${id}`, { method: "DELETE" });
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    const updatedBack = invoicesBackup.filter(invoice => invoice.id !== id);
    setInvoices([...updatedInvoices]);
    setInvoicesBackup([...updatedBack]);
  }

  const addAdvance = async (body) => {
    const { vitroOrderId } = body;
    await apiFetch("advances", { body });
    setMatcher(matcher => ({...matcher, expenses: false, clients: false}));
    return getVitroOrder(vitroOrderId);
  }

  const editAdvance = async (id, body) => {
    const { vitroOrderId } = body;
    await apiFetch(`advances/${id}`, { body, method: "PUT" });
    setMatcher(matcher => ({...matcher, expenses: false, clients: false}));
    return getVitroOrder(vitroOrderId);
  }

  const deleteAdvance = async (id, vitroId) => {
    await apiFetch(`advances/${id}`, { method: "DELETE" });
    setMatcher(matcher => ({...matcher, expenses: false, clients: false}));
    return getVitroOrder(vitroId);
  }

  const getVitroOrder = async (id) => {
    const vitroOrder = await apiFetch(`vitroOrders/${id}`);
    setVitro(vitroOrder.data.id, vitroOrder.data);
    return vitroOrder.data;
  }

  const getExpense = async (id) => {
    const expense = await apiFetch(`profits/${id}`);
    setExpense(expense.data.id, expense.data);
    return expense.data;
  }

  const getInvoice = async (id) => {
    const invoice = await apiFetch(`invoices/${id}`);
    setInvoice(invoice.data.id, invoice.data);
    return invoice.data;
  }

  const getOrder = async (id) => {
    const order = await apiFetch(`orders/${id}`);
    setOrder(order.data.id, order.data);
    return order.data;
  }

  const getBanner = async (id) => {
    const banner = await apiFetch(`offers/${id}`);
    setBanner(banner.data.id, banner.data);
    return banner.data;
  }

  const addOrderItem = async (body) => {
    const { orderId } = body;
    await apiFetch("orderProducts", { body });
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));
    return getOrder(orderId);
  }

  const addBannerItem = async (body) => {
    const { offerId } = body;
    await apiFetch("offerProducts", { body });
    return getBanner(offerId);
  }

  const deleteOrderItem = async (id, orderId) => {
    await apiFetch(`orderProducts/${id}`, { method: "DELETE" });
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));
    return getOrder(orderId);
  }

  const deleteBannerItem = async (id, banner) => {
    await apiFetch(`offerProducts/${id}`, { method: "DELETE" });
    if(banner.products.length <= 1 && banner.used) {
      const body = {
        ...banner,
        used: !banner.used
      }

      return updateBanner(banner.id, body);
    }

    return getBanner(banner.id);
  }

  const editOrderItem = async (id, body) => {
    const { orderId } = body;
    await apiFetch(`orderProducts/${id}`, { body, method: "PUT" });
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));
    return getOrder(orderId);
  }

  return (
    <AdminContext.Provider
      value={{
        ordersBackup,
        categories,
        expenses,
        invoices,
        invoicesBackup,
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
        banners,
        clients,
        clientsBackup,
        loadBanners,
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
        setIsLoading,
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
        deleteExpenseItem,
        addExpenseItem,
        addInvoiceItem,
        editItem,
        editExpenseItem,
        deleteItem,
        updateVitro,
        updateInvoice,
        updateBanner,
        addOrder,
        deleteOrder,
        deleteInvoice,
        loadProducts,
        loadOrders,
        loadVitroOrders,
        loadTubers,
        addAdvance,
        editAdvance,
        deleteAdvance,
        deleteProductImage,
        addOrderItem,
        addBannerItem,
        deleteOrderItem,
        deleteBannerItem,
        editOrderItem,
        updateOrder,
        loadInvoices,
        setInvoices,
        addInvoice,
        editInvoiceItem,
        deleteInvoiceItem,
        generateDoc,
        deleteDocInvoice,
        addBanner,
        deleteBanner,
        getInvoice,
        setOrder,
        setMatcher,
        loadClients,
        addClient,
        loadExpenses,
        setClients,
        setOrders
      }}
    >
      { children }
    </AdminContext.Provider>
  );
}

const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };
