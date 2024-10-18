import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { FaEdit, FaFileInvoice, FaTrashAlt } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import AlertError from "../../../components/AlertError";
import { AiFillProduct } from "react-icons/ai";
import ItemModal from "./ItemModal";
import Item from "./Item";

function Invoice() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [item, setItem] = useState("");
  const [invoice, setInvoice] = useState({});
  const { id } = useParams("");
  const { error, setError, deleteInvoice } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const invoice = await apiFetch(`invoices/${id}`);
        setInvoice(invoice.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id, setError ]);

  const handleEditItem = (item) => {
    setItemModal(true);
    setItem(item);
  }

  const base = (invoice.total / 1.18).toFixed(2);
  const igv = (parseFloat(base) * 0.18).toFixed(2);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !invoice.rsocial
          ? <Title>El comprobante no existe</Title>
          : <>
              <Title capitalize>{ invoice.rsocial.toLowerCase() }</Title>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        { invoice.documentType }
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { invoice.document }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Serie
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { 
                          !invoice.serie
                          ? "No emitido"
                          : invoice.serie
                        }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Fecha emisión
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { invoice.issueDate }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Tipo
                      </Text>
                      <Badge color="orange">
                        { invoice.invoiceType }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Monto base
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { base }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        IGV
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { igv }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Total
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { invoice.total.toFixed(2) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Items
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { invoice.items.length }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Dirección
                      </Text>
                      <Text
                        style={{textTransform: "capitalize"}}
                        align="start"
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { 
                          !invoice.address
                          ? "No proporcionado"
                          : invoice.address.toLowerCase()
                        }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Comentario
                      </Text>
                      <Text
                        align="start"
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { 
                          !invoice.comment
                          ? "Nulo"
                          : invoice.comment
                        }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper isButtons>
                    <Button
                      disabled={invoice.items.length <= 0}
                      Icon={FaFileInvoice}
                      fontSize={15}
                      iconSize={17}
                      color="secondary"
                    >
                      Emitir { invoice.invoiceType.toLowerCase() }
                    </Button>
                    <Button
                      Icon={FaEdit}
                      fontSize={15}
                      iconSize={18}
                      color="warning"
                      onClick={() => navigate("edit")}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => setDeleteModal(!deleteModal)}
                      Icon={FaTrashAlt}
                      fontSize={15}
                      iconSize={16}
                      color="danger"
                      disabled={invoice.isGenerated}
                    >
                      Eliminar
                    </Button>
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                  <Text
                      weight={700}
                      size={18}
                    >
                      Items
                    </Text>
                    <FlexColumn 
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        invoice.items?.map((item, index) => (
                          <Item
                            key={index}
                            item={item}
                            handleEdit={handleEditItem}
                            invoiceId={id}
                            isInvoiceGenerated={invoice.isGenerated}
                            setInvoice={setInvoice}
                          />
                        ))
                      }
                      {
                        !invoice.isGenerated
                        &&
                        <Button
                          style={{marginTop: "1rem"}}
                          fontSize={16}
                          iconSize={18}
                          Icon={AiFillProduct}
                          onClick={() => setItemModal(!itemModal)}
                        >
                          Agregar item
                        </Button>
                      }
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
              <DeleteModal 
                handleDelete={deleteInvoice}
                id={invoice.id}
                isActive={deleteModal}
                navTo="comprobantes"
                setIsActive={setDeleteModal}
                title="¿Eliminar el comprobante?"
              />
              <ItemModal 
                invoiceId={id}
                isActive={itemModal}
                item={item}
                setInvoice={setInvoice}
                setIsActive={setItemModal}
                setItem={setItem}
              />
            </>
        }
        {
          error
          &&
          <AlertError 
            error={error}
            setError={setError}
          />
        }
      </>
  );
}

export default Invoice;
