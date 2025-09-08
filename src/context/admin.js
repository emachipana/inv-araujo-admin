import { createContext, useCallback, useContext, useState } from "react";
import apiFetch from "../services/apiFetch";
import { useAuth } from "./auth";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [backup, setBackup] = useState({});
  const [tubers, setTubers] = useState([]);
  const [vitroOrders, setVitroOrders] = useState({});
  const [vitroOrdersBack, setVitroOrdersBack] = useState({});
  const [orders, setOrders] = useState({});
  const [ordersBackup, setOrdersBackup] = useState({});
  const [invoices, setInvoices] = useState({});
  const [invoicesBackup, setInvoicesBackup] = useState({});
  const [banners, setBanners] = useState([]);
  const [clients, setClients] = useState({});
  const [clientsBackup, setClientsBackup] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesBackup, setWarehousesBackup] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeesBackup, setEmployeesBackup] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [roles, setRoles] = useState([]);
  const [productionSummary, setProductionSummary] = useState([]);
  const [messages, setMessages] = useState({});
  const [messagesBackup, setMessagesBackup] = useState({});
  const [homeData, setHomeData] = useState({
    orders: {
      data: {ship: 0, pen: 0},
      content: []
    },
    vitroOrders: {
      data: {ship: 0, pen: 0},
      content: []
    }
  });
  const [matcher, setMatcher] = useState({
    home: false,
    products: false,
    vitroOrders: false,
    orders: false,
    tubers: false,
    invoices: false,
    banners: false,
    clients: false,
    expenses: false,
    warehouses: false,
    employees: false,
    notifications: false,
  });
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1,
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", 
      sender: 'bot',
      type: 'text'
    }
  ]);

  const { user } = useAuth();

  const markAsRead = async (id) => {
    if(!id) throw Error("Hubo un problema vuelve a intentarlo más tarde");
    const index = notifications.findIndex((noti) => noti.id === id);
    const notification = notifications[index];
    if(!notification) return;
    notifications[index] = {...notification, isRead: true};
    setNotifications([...notifications]);

    await apiFetch(`notifications/${id}`, { method: "PUT" });
  }

  const loadNotifications = useCallback(async () => {
    if(matcher.notifications) return;
    const notifications = await apiFetch("notifications/getByUser");
    setNotifications(notifications.data?.reverse());
    setMatcher(matcher => ({...matcher, notifications: true}));
  }, [matcher.notifications]);

  const loadMessages = useCallback(async () => {
    if(matcher.messages) return;
    const messages = await apiFetch("messages");
    setMessages(messages);
    setMessagesBackup(messages);
    setIsLoading(false);
    setMatcher(matcher => ({...matcher, messages: true}));
  }, [matcher.messages]);

  const loadExpenses = useCallback(async () => {
    if(!user.role.permissions.includes("PROFITS_WATCH")) return;

    if(matcher.expenses) return;
    setIsLoading(true);
    const expenses = await apiFetch("profits");
    setExpenses(expenses);
    setMatcher(matcher => ({...matcher, expenses: true}));
    setIsLoading(false);
  }, [matcher.expenses, user.role]);

  const loadClients = useCallback(async () => {
    if(matcher.clients) return;
    setIsLoading(true);
    const clients = await apiFetch("clients");
    setClients(clients);
    setClientsBackup(clients);
    setMatcher(matcher => ({...matcher, clients: true}));
    setIsLoading(false);
  }, [matcher.clients]);

  const loadWarehouses = useCallback(async () => {
    if(matcher.warehouses) return;
    setIsLoading(true);
    const warehouses = await apiFetch("warehouses");
    setWarehouses(warehouses);
    setWarehousesBackup(warehouses);
    setMatcher(matcher => ({...matcher, warehouses: true}));
    setIsLoading(false);
  }, [matcher.warehouses]);

  const loadBanners = useCallback(async () => {
    if(matcher.banners) return;
    setIsLoading(true);
    const banners = await apiFetch("offers");
    setBanners(banners);
    setMatcher(matcher => ({...matcher, banners: true}));
    setIsLoading(false);
  }, [matcher.banners]);

  const loadInvoices = useCallback(async () => {
    if(matcher.invoices) return;
    setIsLoading(true);
    const invoices = await apiFetch("invoices");
    setInvoices(invoices);
    setInvoicesBackup(invoices);
    setMatcher(matcher => ({...matcher, invoices: true}));
    setIsLoading(false);
  }, [matcher.invoices]);

  const loadOnHome = useCallback(async () => {
    if(matcher.home) return;
    await loadExpenses();
    setIsLoading(true);
    let vitroOrdersData = {};
    let ordersData = {};
    let orders = {};
    let vitroOrders = {};

    if(user.role.permissions.includes("ORDERS_WATCH")) {
      ordersData = await apiFetch("orders/data");
      orders = await apiFetch("orders?size=5&direction=DESC&sortby=date");
    }

    if(user.role.permissions.includes("INVITRO_WATCH")) {
      vitroOrdersData = await apiFetch("vitroOrders/data");
      vitroOrders = await apiFetch("vitroOrders?size=5&direction=DESC&sortby=initDate");
    }
    
    setHomeData({
      orders: {
        data: ordersData.data,
        content: orders.content
      },
      vitroOrders: {
        data: vitroOrdersData.data,
        content: vitroOrders.content
      }
    });
    setMatcher(matcher => ({...matcher, home: true}));
    setIsLoading(false);
    // eslint-disable-next-line
  }, [matcher.home]);

  const loadProducts = useCallback(async () => {
    if(matcher.products) return;
    setIsLoading(true);
    const categories = await apiFetch("categories");
    const products = await apiFetch("products?activeProducts=false");
    setCategories(categories);
    setProducts(products);
    setBackup(products);
    setMatcher(matcher => ({...matcher, products: true}));
    setIsLoading(false);
  }, [matcher.products]);

  const loadVitroOrders = useCallback(async () => {
    if(matcher.vitroOrders) return;
    setIsLoading(true);
    const tubers = await apiFetch("tubers");
    const vitroOrders = await apiFetch("vitroOrders");
    const productionSummary = await apiFetch("vitroOrders/productionSummary");
    setTubers(tubers);
    setVitroOrders(vitroOrders);        
    setVitroOrdersBack(vitroOrders);
    setProductionSummary(productionSummary.data);
    setMatcher(matcher => ({...matcher, vitroOrders: true, tubers: true}));
    setIsLoading(false);
  }, [matcher.vitroOrders]);

  const loadOrders = useCallback(async () => {
    if(matcher.orders) return;
    setIsLoading(true);
    const orders = await apiFetch("orders");
    setOrders(orders);
    setOrdersBackup(orders);
    setMatcher(matcher => ({...matcher, orders: true}));
    setIsLoading(false);
  }, [matcher.orders]);

  const loadEmployees = useCallback(async () => {
    if(matcher.employees) return;
    const rolesToFilter = ["CLIENTE", "ADMINISTRADOR"];

    setIsLoading(true);
    const employees = await apiFetch("employees");
    const roles = await apiFetch("roles");
    const employeesFiltered = employees.filter((emp) => !rolesToFilter.includes(emp?.role?.name));
    setRoles(roles.filter(role => !rolesToFilter.includes(role?.name)));
    setEmployees(employeesFiltered);
    setEmployeesBackup(employeesFiltered);
    setMatcher(matcher => ({...matcher, employees: true}));
    setIsLoading(false);
  }, [matcher.employees]);

  const updateCategory = async (id, body) => {
    const category = categories.find(category => category.id === id);
    const newCategory = await apiFetch(`categories/${id}`, { body: {
      ...body,
      description: category.description,
      imageId: category.image.id
    }, method: "PUT" });
    const tempCategories = categories;
    const index = categories.findIndex(category => category.id === id);
    tempCategories[index] = newCategory.data;
    setCategories([...tempCategories]);
  }

  const deleteCategory = async (id) => {
    await apiFetch(`categories/${id}`, { method: "DELETE" });
    const newCategories = categories.filter(category => category.id !== id);
    setCategories([...newCategories]);
  }

  const deleteMessage = async (id) => {
    await apiFetch(`messages/${id}`, { method: "DELETE" });
    const newMessages = messages.content.filter(message => message.id !== id);
    const backupUpdatedMessages = messagesBackup.content.filter(message => message.id !== id);
    setMessages({...messages, content: [...newMessages]});
    setMessagesBackup({...messagesBackup, content: [...backupUpdatedMessages]});
  }

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const image = await apiFetch("images", { body: formData, isFile: true });

    return image.data;
  }

  const addCategory = async (body) => {
    const image = await uploadImage(body.file);

    const newCategory = await apiFetch("categories", { body: {
      name: body.name,
      description: body.description,
      imageId: image.id,
      employeeId: body.employeeId
    }});
    setCategories(categories => [...categories, newCategory.data]);
  }

  const orderAtAgency = async (orderId, body) => {
    const image = await uploadImage(body.file);

    const orderBody = {
      ...body,
      employeeId: user.employeeId,
      evidenceId: image.id,
    }

    const updatedOrder = await apiFetch(`orders/${orderId}/agency`, { body: orderBody, method: "PUT" });
    
    return updatedOrder.data;
  }
  
  const vitroOrderAtAgency = async (orderId, body) => {
    const image = await uploadImage(body.file);

    const orderBody = {
      ...body,
      employeeId: user.employeeId,
      evidenceId: image.id,
    }

    const updatedOrder = await apiFetch(`vitroOrders/${orderId}/agency`, { body: orderBody, method: "PUT" });
    
    return updatedOrder.data;
  }

  const orderDelivered = async (orderId, body) => {
    const image = await uploadImage(body.file);
    const orderBody = {
      employeeId: user.employeeId,
      evidenceId: image.id,
    }

    const updatedOrder = await apiFetch(`orders/${orderId}/delivered`, { body: orderBody, method: "PUT" });
    
    return updatedOrder.data;
  }
    
  const vitroOrderDelivered = async (orderId, body) => {
    const image = await uploadImage(body.file);

    const orderBody = {
      employeeId: user.employeeId,
      evidenceId: image.id,
    }

    const updatedOrder = await apiFetch(`vitroOrders/${orderId}/delivered`, { body: orderBody, method: "PUT" });
    
    return updatedOrder.data;
  }

  const addRole = async (body) => {
    const newRole = await apiFetch("roles", { body });
    setRoles(roles => [...roles, newRole.data]);
  }

  const updateProduct = async (id, body) => {
    const updatedProduct = await apiFetch(`products/${id}`, { body, method: "PUT" });
    setProduct(id, updatedProduct.data);
    return updatedProduct.data;
  }

  const newBatch = async (body) => {
    const product = backup.content?.find((prod) => prod.id === body.productId);
    await apiFetch("warehouseProducts", {body});
    if(product) setProduct(product.id, {...product, stock: product.stock + +body.quantity});
  }

  const updateActiveProduct = async (id, body) => {
    setProduct(id, body);
    await apiFetch(`products/${id}`, { body, method: "PUT" });
  }

  const addProduct = async (body) => {
    const newProduct = await apiFetch("products", { body });
    setProducts(products => ({...products, content: [newProduct.data, ...products.content]}));
    setBackup(products => ({...products, content: [newProduct.data, ...products.content]}));
    return newProduct.data;
  }

  const addWarehouse = async (body) => {
    body.employeeId = user.employeeId;
    const newWarehouse = await apiFetch("warehouses", { body });
    setWarehouses(warehouses => [...warehouses, newWarehouse.data]);
    setWarehousesBackup(warehouses => [...warehouses, newWarehouse.data]);
    return newWarehouse.data;
  }

  const addBanner = async (body) => {
    body.employeeId = user.employeeId;
    const newBanner = await apiFetch("offers", { body });
    setBanners(banners => [...banners, newBanner.data]);
    return newBanner.data;
  }

  const addVitro = async (body) => {
    const newVitro = await apiFetch("vitroOrders?alert=false", { body });
    setVitroOrders(vitros => ({...vitros, content: [newVitro.data, ...vitros.content]}));
    setVitroOrdersBack(vitros => ({...vitros, content: [newVitro.data, ...vitros.content]}));
    return newVitro.data;
  }

  const addOrder = async (body) => {
    body.operatorId = user.employeeId;
    const newOrder = await apiFetch("orders?alert=false", { body });
    setOrders(orders => ({...orders, content: [newOrder.data, ...orders.content]}));
    setOrdersBackup(orders => ({...orders, content: [newOrder.data, ...orders.content]}));
    return newOrder.data;
  }

  const addClient = async (body) => {
    body.employeeId = user.employeeId;
    const newClient = await apiFetch("clients", { body });
    setClients(clients => ({...clients, content: [newClient.data, ...clients.content]}));
    setClientsBackup(clients => ({...clients, content: [newClient.data, ...clients.content]}));
    return newClient.data;
  }

  const addInvoice = async (body) => {
    body.employeeId = user.employeeId;
    const newInvoice = await apiFetch("invoices", { body });
    setInvoices(invoices => ({...invoices, content: [newInvoice.data, ...invoices.content]}));
    setInvoicesBackup(invoices => ({...invoices, content: [newInvoice.data, ...invoices.content]}));
    return newInvoice.data;
  }

  const setProduct = (id, product) => {
    if(!products.content) return;

    const tempProducts = products;
    const tempBackup = backup;
    const index = tempProducts.content?.findIndex(product => product.id === id);
    const indexBackup = tempBackup.content?.findIndex(product => product.id === id);
    tempProducts.content[index] = product;
    tempBackup.content[indexBackup] = product;
    setProducts({...tempProducts});
    setBackup({...tempBackup});
  }

  const deleteProduct = async (id) => {
    await apiFetch(`products/${id}`, { method: "DELETE" });
    const updatedProducts = products.filter(product => product.id !== id);
    const updatedBackup = backup.filter(product => product.id !== id);
    setProducts([...updatedProducts]);
    setBackup([...updatedBackup]);
  }

  const addProductImage = async (product, file) => {
    const image = await uploadImage(file);
    const body = {
      productId: product.id,
      imageId: image.id,
      employeeId: user.employeeId
    }
    const newProductImage = await apiFetch("productImages", { body });
    const images = product.images ? [...product.images, newProductImage.data] : [newProductImage.data];
    const updatedProduct = {...product, images};
    setProduct(product.id, updatedProduct);
    return updatedProduct;
  }

  const deleteProductImage = async (imageId, product) => {
    await apiFetch(`productImages/${imageId}?employeeId=${user.employeeId}`, { method: "DELETE" });
    const images = product.images.filter(image => image.id !== imageId);
    const updatedProduct = {...product, images};
    setProduct(product.id, updatedProduct);
    return updatedProduct;
  }

  const updateTuber = async (id, body) => {
    body.employeeId = user.employeeId;
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
    body.employeeId = user.employeeId;
    const newTuber = await apiFetch("tubers", { body });
    setTubers(tubers => [...tubers, newTuber.data]);
  }

  const addVariety = async (body) => {
    body.employeeId = user.employeeId;
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
    body.employeeId = user.employeeId;
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
    const vitro = vitroOrdersBack.content.find(vitro => vitro.id === id);
    if(!vitro) return;

    const updatedOrders = vitroOrders.content.filter(order => order.id !== id);
    const updatedBackup = vitroOrdersBack.content.filter(order => order.id !== id);
    setVitroOrders({...vitroOrders, content: [...updatedOrders]});
    setVitroOrdersBack({...vitroOrdersBack, content: [...updatedBackup]});
  }

  const deleteOrder = async (id) => {
    await apiFetch(`orders/${id}`, { method: "DELETE" });
    const order = ordersBackup.content.find(orderF => orderF.id === id);
    if(!!order.invoice && matcher.invoices) setMatcher(matcher => ({...matcher, invoices: false}));
    setMatcher(matcher => ({...matcher, expenses: false, clients: false}));
    const updatedOrders = orders.content.filter(order => order.id !== id);
    const updatedBackup = ordersBackup.content.filter(order => order.id !== id); 
    setOrders({...orders, content: [...updatedOrders]});
    setOrdersBackup({...ordersBackup, content: [...updatedBackup]});
  }

  const updateVitro = async (id, body) => {
    const updatedVitro = await apiFetch(`vitroOrders/${id}`, { body, method: "PUT" });
    setVitro(id, updatedVitro.data);
    return updatedVitro.data;
  }

  const updateInvoice = async (id, body) => {
    const updatedInvoice = await apiFetch(`invoices/${id}`, { body, method: "PUT" });
    setMatcher(matcher => ({...matcher, invoices: false}));
    return updatedInvoice.data;
  }

  const updateBanner = async (id, body) => {
    body.employeeId = user.employeeId;
    const updatedBanner = await apiFetch(`offers/${id}`, { body, method: "PUT" });
    setBanner(id, updatedBanner.data);
    return updatedBanner.data;
  }

  const setVitro = (id, order) => {
    if(!vitroOrders.content) return;

    const tempOrders = vitroOrders;
    const tempBackup = vitroOrdersBack;
    const index = tempOrders.content.findIndex(order => order.id === id);
    const indexBack = tempBackup.content.findIndex(order => order.id === id);
    tempOrders.content[index] = order;
    tempBackup.content[indexBack] = order;
    setVitroOrders({...tempOrders});
    setVitroOrdersBack({...tempBackup});
  }

  const setOrder = (id, order) => {
    if(!orders.content) return;

    const tempOrders = orders;
    const tempBack = ordersBackup;
    const index = tempOrders.content.findIndex(order => order.id === id);
    const indexBack = tempBack.content.findIndex(order => order.id === id);
    tempOrders[index] = order;
    tempBack[indexBack] = order;
    setOrders({...tempOrders});
    setOrdersBackup({...tempBack});
  }

  const setExpense = (id, expense) => {
    const tempExpenses = expenses;
    const index = tempExpenses.findIndex(expense => expense.id === id);
    tempExpenses[index] = expense;
    setExpenses([...tempExpenses]);
  }

  const setInvoice = (id, invoice) => {
    if(!matcher.invoices) return invoice;

    const tempInvoices = invoices.content;
    const tempBackup = invoicesBackup.content;
    const index = tempInvoices.findIndex(invoice => invoice.id === id);
    const indexBackup = tempBackup.findIndex(invoice => invoice.id === id);
    tempInvoices[index] = invoice;
    tempBackup[indexBackup] = invoice;
    setInvoices({...invoices, content: [...tempInvoices]});
    setInvoicesBackup({...invoicesBackup, content: [...tempBackup]});
  }

  const setBanner = (id, banner) => {
    const tempBanners = banners;
    const index = tempBanners.findIndex(banner => banner.id === id);
    tempBanners[index] = banner;
    setBanners([...tempBanners]);
  }

  const addItem = async (body) => {
    const { vitroOrderId } = body;
    const orderVariety = await apiFetch("orderVarieties", { body });
    const newVitroOrder = await getVitroOrder(vitroOrderId);

    return {orderVariety: orderVariety.data, newVitroOrder};
  }

  const addExpenseItem = async (body) => {
    const { profitId } = body;
    const expense = await apiFetch("expenses", { body });
    const updatedProfit = await apiFetch(`profits/${profitId}`);
    setMatcher(matcher => ({...matcher, expenses: false}));

    return {expense: expense.data, updatedProfit: updatedProfit.data};
  }

  const addInvoiceItem = async (body) => {
    const { invoiceId } = body;
    const invoiceItem = await apiFetch("invoiceItems", { body });
    const updatedInvoice = await apiFetch(`invoices/${invoiceId}`);
    setMatcher(matcher => ({...matcher, invoices: false}));

    return {updatedInvoice: updatedInvoice.data, invoiceItem: invoiceItem};
  }
 
  const editItem = async (id, body, setItems) => {
    const { vitroOrderId } = body;
    const updatedVariety = await apiFetch(`orderVarieties/${id}`, { body, method: "PUT" });
    const newVitroOrder = await getVitroOrder(vitroOrderId);

    setItems((items) => {
      const index = items.findIndex((item) => item.id === updatedVariety.data.id);
      items[index] = updatedVariety.data;

      return [...items];
    });
    
    return {orderVariety: updatedVariety.data, newVitroOrder};
  }

  const editExpenseItem = async (id, body, setExpenses) => {
    const { profitId } = body;
    const updatedExpense = await apiFetch(`expenses/${id}`, { body, method: "PUT" });
    const updatedProfit = await apiFetch(`profits/${profitId}`);
    setMatcher(matcher => ({...matcher, expenses: false}));

    setExpenses((expenses) => {
      const index = expenses.findIndex((expense) => expense.id === updatedExpense.data.id);
      expenses[index] = updatedExpense.data;

      return [...expenses];
    });

    return {expense: updatedExpense.data, updatedProfit: updatedProfit.data};
  }

  const editInvoiceItem = async (id, body, setItems) => {
    const { invoiceId } = body;
    const newItem = await apiFetch(`invoiceItems/${id}`, { body, method: "PUT" });
    const updatedInvoice = await apiFetch(`invoices/${invoiceId}`);
    setMatcher(matcher => ({...matcher, invoices: false}));

    setItems((items) => {
      const index = items.findIndex((item) => item.id === newItem.data.id);
      items[index] = newItem.data;

      return [...items];
    });

    return {updatedInvoice: updatedInvoice.data, invoiceItem: newItem.data};
  }

  const generateDoc = async (invoiceId) => {
    await apiFetch(`invoices/sendToSunat/${invoiceId}`, { method: "POST" });
    return getInvoice(invoiceId);
  }

  const deleteDocInvoice = async (invoiceId) => {
    await apiFetch(`invoices/deletePDF/${invoiceId}`, { method: "DELETE" });
    return getInvoice(invoiceId);
  }

  const deleteItem = async (id, vitroOrderId, setItems, employeeId) => {
    await apiFetch(`orderVarieties/${id}?employeeId=${employeeId}`, { method: "DELETE" });

    setItems((items) => [...items.filter((item) => item.id !== id)]);

    return getVitroOrder(vitroOrderId);
  }

  const deleteExpenseItem = async (id, profitId, setItems) => {
    await apiFetch(`expenses/${id}`, { method: "DELETE" });
    setItems((items) => [...items.filter((item) => item.id !== id)]);
    setMatcher(matcher => ({...matcher, expenses: false}));
    return getExpense(profitId);
  }

  const deleteInvoiceItem = async (id, invoiceId, setItems) => {
    await apiFetch(`invoiceItems/${id}?employeeId=${user.employeeId}`, { method: "DELETE" });
    setItems((items) => [...items.filter((item) => item.id !== id)]);
    setMatcher(matcher => ({...matcher, invoices: false}));
    return getInvoice(invoiceId);
  }

  const updateOrder = async (id, body) => {
    body.operatorId = user.employeeId;
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
    const updatedInvoices = invoices.content.filter(invoice => invoice.id !== id);
    const updatedBack = invoicesBackup.content.filter(invoice => invoice.id !== id);
    setInvoices({...invoices, content: [...updatedInvoices]});
    setInvoicesBackup({...invoicesBackup, content: [...updatedBack]});
  }

  const addAdvance = async (body) => {
    const { vitroOrderId } = body;
    const newAdvance = await apiFetch("advances", { body });
    setMatcher(matcher => ({...matcher, expenses: false, clients: false, home: false}));
    const updatedVitroOrder = await getVitroOrder(vitroOrderId);

    return {advance: newAdvance.data, updatedVitroOrder};
  }

  const editAdvance = async (id, body, setAdvances) => {
    const { vitroOrderId } = body;
    const updatedAdvance = await apiFetch(`advances/${id}`, { body, method: "PUT" });
    const updatedVitroOrder = await getVitroOrder(vitroOrderId);
    setMatcher(matcher => ({...matcher, expenses: false, clients: false, home: false}));

    setAdvances((advances) => {
      const index = advances.findIndex((advance) => advance.id === updatedAdvance.data.id);
      advances[index] = updatedAdvance.data;

      return [...advances];
    });

    return {advance: updatedAdvance.data, updatedVitroOrder};
  }

  const deleteAdvance = async (id, vitroId, setAdvances) => {
    await apiFetch(`advances/${id}`, { method: "DELETE" });
    setMatcher(matcher => ({...matcher, expenses: false, clients: false, home: false}));
    setAdvances((advances) => [...advances.filter((advance) => advance.id !== id)]);
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
    body.employeeId = user.employeeId;
    const orderItem = await apiFetch("orderProducts", { body });
    const newOrder = await apiFetch(`orders/${orderId}`);
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));

    return {newOrder: newOrder.data, orderItem};
  }

  const addBannerItem = async (body) => {
    const { offerId } = body;
    body.employeeId = user.employeeId;
    await apiFetch("offerProducts", { body });
    return getBanner(offerId);
  }

  const deleteOrderItem = async (id, orderId, setItems) => {
    await apiFetch(`orderProducts/${id}?employeeId=${user.employeeId}`, { method: "DELETE" });
    setItems((items) => [...items.filter((item) => item.id !== id)]);
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));
    return getOrder(orderId);
  }

  const deleteBannerItem = async (id, banner) => {
    await apiFetch(`offerProducts/${id}?employeeId=${user.employeeId}`, { method: "DELETE" });
    if(banner.items.length <= 1 && banner.isUsed) {
      const body = {
        ...banner,
        isUsed: !banner.isUsed
      }

      return updateBanner(banner.id, body);
    }

    return getBanner(banner.id);
  }

  const editOrderItem = async (id, body, setItems) => {
    const { orderId } = body;
    body.employeeId = user.employeeId;
    const orderItem = await apiFetch(`orderProducts/${id}`, { body, method: "PUT" });
    const newOrder = await apiFetch(`orders/${orderId}`);
    setMatcher(matcher => ({...matcher, products: false, expenses: false, clients: false}));

    setItems((items) => {
      const index = items.findIndex((item) => item.id === orderItem.data.id);
      items[index] = orderItem.data;

      return [...items];
    });

    return {newOrder: newOrder.data, orderItem};
  }

  const addEmployee = async (body) => {
    const newEmployee = await apiFetch(`employees`, { body });
    const employee = {...newEmployee.data?.employee, role: newEmployee.data?.user.role};
    setEmployees(employees => [employee, ...employees]);
    setEmployeesBackup(employees => [employee, ...employees]);
    return employee;
  }

  const updateEmployee = async (employeeId, body) => {
    const updatedEmployee = await apiFetch(`employees/${employeeId}`, { body, method: "PUT" });
    setEmployees(employees => employees.map((employee) => employee.id === employeeId ? updatedEmployee.data : employee));
    setEmployeesBackup(employees => employees.map((employee) => employee.id === employeeId ? updatedEmployee.data : employee));
    return updatedEmployee.data;
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
        isLoading,
        tubers,
        vitroOrders,
        vitroOrdersBack,
        orders,
        matcher,
        banners,
        clients,
        clientsBackup,
        homeData,
        warehouses,
        warehousesBackup,
        employees,
        employeesBackup,
        notifications,
        roles,
        productionSummary,
        messages,
        messagesBackup,
        chatMessages,
        setChatMessages,
        loadMessages,
        setProductionSummary,
        setRoles,
        addEmployee,
        setEmployees,
        setEmployeesBackup,
        updateEmployee,
        loadEmployees,
        loadBanners,
        setTubers,
        setVitroOrders,
        setCategories,
        setProducts,
        addWarehouse,
        updateCategory,
        deleteCategory,
        addCategory,
        setIsLoading,
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
        deleteMessage,
        updateBanner,
        addOrder,
        deleteOrder,
        deleteInvoice,
        loadProducts,
        loadOrders,
        loadVitroOrders,
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
        setOrders,
        loadOnHome,
        updateActiveProduct,
        loadWarehouses,
        newBatch,
        loadNotifications,
        setNotifications,
        markAsRead,
        setOrdersBackup,
        setWarehouses,
        setWarehousesBackup,
        addRole,
        orderAtAgency,
        orderDelivered,
        vitroOrderAtAgency,
        vitroOrderDelivered,
        setMessages,
        setMessagesBackup
      }}
    >
      { children }
    </AdminContext.Provider>
  );
}

const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };
