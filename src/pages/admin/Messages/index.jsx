import { useEffect, useState, Fragment } from "react";
import { useAdmin } from "../../../context/admin";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { FlexColumn, Text } from "../../../styles/layout";
import { Title } from "../styles";
import { COLORS } from "../../../styles/colors";
import { Container, Line } from "./styles";
import { Spinner } from "reactstrap";
import Message from "./Message";
import Pagination from "../../../components/Pagination";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import DeleteModal from "../Product/DeleteModal";

function Messages() {
  const [toDelete, setToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    sort: null,
    page: 0,
  });
  const { messages, isLoading, setIsLoading, loadMessages, setMessages, messagesBackup, deleteMessage } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadMessages();
      }catch(error) {
        setIsLoading(false);
        toast.error(errorParser(error.message));
      }
    }

    fetch();
  }, [loadMessages, setIsLoading]);

  useEffect(() => {
    const fetch = async () => {
      if(!filters.page) return setMessages(messagesBackup);

      try {
        setIsLoading(true);
        const params = filterBuilder(filters);
        const messages = await apiFetch(`messages${params}`);
        setMessages(messages);
        setIsLoading(false);
      }catch(e) {
        toast.error(errorParser(e.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [filters, setIsLoading, messagesBackup, setMessages]);

  const onDeleteClick = (id) => {
    setToDelete(id);
    setDeleteModal(true);
  }

  const deleteClose = (val) => {
    setDeleteModal(val);
    setToDelete(null);
  }

  return (
    <>
      <FlexColumn gap={0.1}>
        <Title>Mensajes</Title>
        <Text
          style={{marginTop: "-0.5rem"}}
          color={COLORS.dim}
        >
          Revisa las consultas que envían desde la web
        </Text>
      </FlexColumn>
      <Container>
        {
          isLoading
          ? <Spinner color="secondary" />
          : messages?.content?.map((message, index) => (
              <Fragment
                key={index}
              >
                <Message
                  id={message.id}
                  fullName={message.fullName}
                  email={message.email}
                  content={message.content}
                  subject={message.subject}
                  phone={message.phone}
                  createdAt={message.createdAt}
                  onDeleteClick={onDeleteClick}
                />
                {
                  index < messages?.content?.length - 1
                  && 
                  <Line />
                }
              </Fragment>
            ))
        }
      </Container>
      <Pagination 
        currentPage={messages.number}
        totalPages={messages.totalPages}
        // totalPages={100}
        setFilters={setFilters}
        isLoading={isLoading}
      />
      <DeleteModal 
        handleDelete={deleteMessage}
        id={toDelete}
        isActive={deleteModal}
        setIsActive={deleteClose}
        navTo="mensajes"
        title="¿Estás seguro de eliminar este mensaje?"
      />
    </>
  );
}

export default Messages;
