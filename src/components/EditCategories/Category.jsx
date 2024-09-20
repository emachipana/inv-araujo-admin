import { useState } from "react";
import { COLORS } from "../../styles/colors";
import { FlexRow, Text } from "../../styles/layout";
import { CategoryContainer as Container, Wrapper } from "./styles";
import { MdClose, MdCheck } from "react-icons/md";
import { FaEdit, FaTrashAlt, FaCaretRight } from "react-icons/fa";
import Input from "../Input";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import { closeEdit, handleChange, handleBlur, setupEdit, onSave } from "./handlers";
import SubCategory from "./SubCategory";
import AlertError from "../AlertError";

function Category({ id, children, subCategories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isToEdit, setIsToEdit] = useState(false);
  const [category, setCategory] = useState({
    value: "",
    error: "",
    touched: false
  });
  const { updateCategory, deleteCategory, error, setError } = useAdmin();

  const onDelete = async () => {
    try {
      await deleteCategory(id);
    }catch(error) {
      setError(error.message);
      console.error(error);
    }
  }

  return (
    <Wrapper>
      <Container>
        <FlexRow>
          { 
            subCategories.length > 0 
            && 
            <FaCaretRight
              size={20}
              style={{cursor: "pointer", transform: isOpen ? "rotate(90deg)" : "rotate(0)"}}
              onClick={() => setIsOpen(!isOpen)}
            />
          }
          {
            isToEdit
            ? <Input
                value={category.value}
                handleChange={(event) => handleChange(event, setCategory)}
                error={category.error}
                id="category"
                touched={category.touched}
                handleBlur={() => handleBlur(setCategory)}
              />
            : <Text
                size={16.8}
                weight={600}
              >
                { children }
              </Text>
          }
        </FlexRow>
        <FlexRow gap={1}>
          {
            isToEdit
            ? <>
                {
                  isLoading
                  ? <Spinner size="sm" color="secondary" />
                  : <MdCheck 
                      size={27}
                      color={COLORS.dim}
                      style={{cursor: "pointer"}}
                      onClick={() => onSave(
                        category,
                        id,
                        { name: category.value },
                        setIsToEdit,
                        setCategory,
                        updateCategory,
                        setIsLoading
                      )}
                    />
                }
                <MdClose 
                  onClick={() => closeEdit(setIsToEdit, setCategory)}
                  size={27}
                  color={COLORS.red}
                  style={{cursor: "pointer"}}
                />
              </>
            : <>
                <FaEdit
                  onClick={() => setupEdit(children, setIsToEdit, setCategory)}
                  size={19}
                  color={COLORS.dim}
                  style={{cursor: "pointer"}}
                />
                <FaTrashAlt 
                  size={18}
                  color={COLORS.red}
                  style={{cursor: "pointer"}}
                  onClick={onDelete}
                />
              </>
          }
        </FlexRow>
      </Container>
      {
        isOpen
        &&
        <>
          <hr 
            style={{width: "100%", margin: 0, border: "1px solid"}}
          />
          {
            subCategories.map((subCategory, index) => (
              <SubCategory
                key={index}
                categoryId={id}
                id={subCategory.id}
              >
                { subCategory.name }
              </SubCategory>
            ))
          }
        </>
      }
      {
        error
        &&
        <AlertError 
          error={error}
          setError={setError}
          from="categories"
        />
      }
    </Wrapper>
  );
}

export default Category;
