import { FlexRow } from "../../styles/layout";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Page } from "./styles";
import { COLORS } from "../../styles/colors";
import { filterBuilder } from "../../pages/admin/Products/handlers";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import apiFetch from "../../services/apiFetch";

function Pagination({ currentPage, totalPages, isLoading, setIsLoading, set, to, filters }) {
  const isLast = currentPage === totalPages - 1;
  const isFirst = currentPage <= 0;
  const pages = Array(totalPages).fill(0);

  const nextPage = async () => {
    if( isLast || isLoading) return;

    try {
      setIsLoading(true);
      const params = filterBuilder({...filters, page: currentPage + 1});
      const data = await apiFetch(to + params);
      set(data);
      setIsLoading(false);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  const prevPage = async () => {
    if(isFirst || isLoading) return;

    try {
      setIsLoading(true);
      const params = filterBuilder({...filters, page: currentPage - 1});
      const data = await apiFetch(to + params);
      set(data);
      setIsLoading(false);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  const onPageClick = async (page) => {
    if(currentPage === page || isLoading) return;

    try {
      setIsLoading(true);
      const params = filterBuilder({...filters, page});
      const data = await apiFetch(to + params);
      set(data);
      setIsLoading(false);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  return (
    <FlexRow gap={0.25}>
      <FaAngleLeft 
        size={16}
        style={{cursor: "pointer"}}
        color={isFirst ? COLORS.taupe : COLORS.gray}
        onClick={prevPage}
      />
      {
        pages.map((_page, index) => (
          <Page
            onClick={() => onPageClick(index)}
            key={index}
            isActive={index === currentPage}
          >
            { index + 1 }
          </Page>
        ))
      }
      <FaAngleRight 
        size={16}
        style={{cursor: "pointer"}}
        color={isLast ? COLORS.taupe : COLORS.gray}
        onClick={nextPage}
      />
    </FlexRow>
  );
}

export default Pagination;
