import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../services/apiFetch";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [backup, setBackup] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const categories = await apiFetch("categories");
        const products = await apiFetch("products");
        setCategories(categories.filter(category => category.name));
        setProducts(products)
        setBackup(products);
        setIsLoading(false);
      }catch(error) {
        setError(error.message);
        console.error(error);

        setIsLoading(false);
      }
    }

    fetch();
  }, []);

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
    category.subCategories = [...category.subCategories, newSubCategory.data];
    const index = categories.findIndex(category => category.id === categoryId);
    const tempCategories = categories;
    tempCategories[index] = category;
    setCategories([...tempCategories]);
  }

  const updateProduct = async (id, body) => {
    const updatedProduct = await apiFetch(`products/${id}`, { body, method: "PUT" });
    const tempProducts = products;
    const tempBackup = backup;
    const index = tempProducts.findIndex(product => product.id === id);
    const indexBackup = tempBackup.findIndex(product => product.id === id);
    tempProducts[index] = updatedProduct.data;
    tempBackup[indexBackup] = updatedProduct.data;
    setProducts([...tempProducts]);
    setBackup([...tempBackup]);
  }

  return (
    <AdminContext.Provider
      value={{
        categories,
        products,
        backup,
        error,
        isLoading,
        setCategories,
        setProducts,
        setError,
        updateCategory,
        updateSubCategory,
        deleteCategory,
        deleteSubCategory,
        addCategory,
        addSubCategory,
        updateProduct
      }}
    >
      { children }
    </AdminContext.Provider>
  );
}

const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };
