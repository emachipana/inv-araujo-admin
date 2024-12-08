/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Image, ImageCard as Container, Cancel } from "./styles";
import { COLORS } from "../../../styles/colors";
import { IoIosRemoveCircle } from "react-icons/io";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function ImageCard({ image, product, setProduct }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hover, setHover] = useState(false);
  const { deleteProductImage } = useAdmin();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedProduct = await deleteProductImage(image.id, product);
      setProduct(updatedProduct);
      setIsDeleting(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsDeleting(false);
    }
  }

  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {
        hover
        &&
        <IoIosRemoveCircle
          css={Cancel}
          color={COLORS.red}
          onClick={handleDelete}
        />
      }
      {
        isDeleting
        ? <Spinner color="secondary"/>
        :  <Image
            src={image.image.url}
            alt={`${product.name}-${product.id}`}
          />
      }
    </Container>
  );
}

export default ImageCard;
