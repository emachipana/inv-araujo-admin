import { useState } from "react";
import Modal from "../../../components/Modal";
import { Spinner } from "reactstrap";
import { Doc, Loader } from "./styles";
import { FlexRow } from "../../../styles/layout";
import Button from "../../../components/Button";
import { FaEye } from "react-icons/fa6";
import { HiDocumentMinus } from "react-icons/hi2";
import { useAdmin } from "../../../context/admin";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function DocModal({ isActive, setIsActive, pdfUrl, setInvoice, invoiceId }) {
  const [toDelete, setToDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteDocInvoice } = useAdmin();

  const handleDeleteClick = async () => {
    if(!toDelete) return setToDelete(true);

    try {
      setIsDeleting(true);
      const updatedInvoice = await deleteDocInvoice(invoiceId);
      setInvoice(updatedInvoice);
      setIsDeleting(false);
      onClose();
    }catch(error) {
      toast.error(errorParser(error.message));
      setToDelete(false);
      setIsDeleting(false);
    }
  }

  const onClose = () => {
    setIsActive(false);
    if(!isLoading) setIsLoading(true);
    if(toDelete) setToDelete(false);
  }

  return (
    <Modal
      align="start"
      size="md"
      setIsActive={onClose}
      isActive={isActive}
    >
      <FlexRow
        width="100%"
        justify="space-evenly"
        gap={1}
        style={{margin: "1.5rem 0"}}
      >
        <Button
          Icon={FaEye}
          fontSize={15}
          iconSize={17}
        >
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver en navegador
          </a>
        </Button>
      </FlexRow>
      <Doc>
        {isLoading && (
          <Loader>
            <Spinner color="light" />
          </Loader>
        )}
        <iframe 
          title="factura"
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            toast.error('No se pudo cargar la vista previa del documento');
          }}
        />
      </Doc>
    </Modal>
  );
}

export default DocModal;
