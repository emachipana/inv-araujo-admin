import { useState } from "react";
import { CategoryContainer as Container } from "./styles";
import { closeEdit, handleBlur, handleChange, onSave, setupEdit } from "./handlers";
import Input from "../Input";
import { FlexRow, Text } from "../../styles/layout";
import { Spinner } from "reactstrap";
import { MdCheck, MdClose } from "react-icons/md";
import { COLORS } from "../../styles/colors";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { errorParser } from "../../helpers/errorParser";
import toast from "react-hot-toast";

function SubCategory({ id, children, categoryId, isFromTuber, updateSubCategory, deleteSubCategory }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isToEdit, setIsToEdit] = useState(false);
  const [category, setCategory] = useState({
    value: "",
    error: "",
    touched: false
  });

  const onDelete = async () => {
    try {
      await deleteSubCategory(id, categoryId)
    }catch(error) {
      toast.error(errorParser(error.message));
    }
  }

  return (
    <Container padding="0.8rem 1.5rem 0rem 3rem">
      <FlexRow>
        { 
          isToEdit
          ? <Input
              value={category.value}
              handleChange={(event) => handleChange(event, setCategory)}
              error={category.error}
              id="subCategory"
              touched={category.touched}
              handleBlur={() => handleBlur(setCategory)}
            />
          : <Text
              size={15.7}
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
                    size={25}
                    color={COLORS.dim}
                    style={{cursor: "pointer"}}
                    onClick={() => onSave(
                      category,
                      id,
                      {categoryId, name: category.value},
                      setIsToEdit,
                      setCategory,
                      updateSubCategory,
                      setIsLoading
                    )}
                  />
              }
              <MdClose
                onClick={() => closeEdit(setIsToEdit, setCategory)}
                size={25}
                color={COLORS.red}
                style={{cursor: "pointer"}}
              />
            </>
          : <>
              <FaEdit
                onClick={() => isFromTuber ? updateSubCategory(id, categoryId) : setupEdit(children, setIsToEdit, setCategory)}
                size={17}
                color={COLORS.dim}
                style={{cursor: "pointer"}}
              />
              <FaTrashAlt
                size={16}
                color={COLORS.red}
                style={{cursor: "pointer"}}
                onClick={onDelete}
              />
            </>
        }
      </FlexRow>
    </Container>
  );
}

export default SubCategory;
