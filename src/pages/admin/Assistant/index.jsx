import { useState, useRef, useEffect } from "react";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, Text } from "../../../styles/layout";
import { Title } from "../styles";
import { ChatContainer, Chats, Question, ChatMessage } from "./styles";
import apiFetch from "../../../services/apiFetch";
import { Input, Spinner } from "reactstrap";
import { FiSend } from "react-icons/fi";
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useAdmin } from "../../../context/admin";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend
);

function VirtualAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { chatMessages: messages, setChatMessages: setMessages } = useAdmin();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiFetch('chatbot/admin', {body: { question: inputValue }});

      const botMessage = {
        id: messages.length + 2,
        text: response.content,
        sender: 'bot',
        type: response.type || 'text'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Lo siento, ha ocurrido un error al procesar tu solicitud.',
        sender: 'bot',
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  console.log(messages);

  return (
    <>
      <FlexColumn gap={0.1}>
        <Title>Asistente virtual</Title>
        <Text style={{ marginTop: "-0.5rem" }} color={COLORS.dim}>
          Haz consultas sobre productos, stock y predicciones
        </Text>
      </FlexColumn>
      <ChatContainer>
        <Chats>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              sender={message.sender}
              type={message.type}
            >
              {
                message.type === "chart"
                ? <Line 
                    height={400}
                    data={{
                      labels: message.text.labels,
                      datasets: [
                        {
                          label: message.text.label,
                          data: message.text.data,
                          borderColor: COLORS.blue
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: "Predicción de demanda (recuerda que son datos aproximados)"
                        }
                      }
                    }}
                  />
                : message.text
              }
            </ChatMessage>
          ))}
          {isLoading && (
            <ChatMessage sender="bot">
              <Spinner size="sm" /> Pensando...
            </ChatMessage>
          )}
          <div ref={messagesEndRef} />
        </Chats>
        <Question>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
            <Input
              type="textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, marginRight: '0.5rem', resize: 'none', minHeight: '38px' }}
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                background: COLORS.primary,
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                opacity: inputValue.trim() && !isLoading ? 1 : 0.5
              }}
            >
              <FiSend color="white" />
            </button>
          </div>
        </Question>
      </ChatContainer>
    </>
  );
}

export default VirtualAssistant;
