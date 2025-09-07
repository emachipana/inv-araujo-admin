import newStyled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";

export const ChatContainer = newStyled.div`
  width: 100%;
  height: calc(100vh - 185px);
  background-color: ${COLORS.smoke};
  border-radius: 1rem;
  border: 1px solid ${COLORS.dim}20;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Chats = newStyled.div`
  width: 100%;
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ChatMessage = newStyled.div`
  max-width: 80%;
  ${({ type }) => type === "chart" ? "width: 50%" : ""};
  max-height: 500px;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  line-height: 1.4;
  word-wrap: break-word;
  position: relative;
  font-weight: 500;
  font-size: 15px;
  
  ${({ sender }) => sender === 'user' ? `
    align-self: flex-end;
    background-color: ${COLORS.persian};
    color: white;
    border-bottom-right-radius: 0.25rem;
  ` : `
    align-self: flex-start;
    background-color: white;
    border: 1px solid ${COLORS.dim}30;
    border-bottom-left-radius: 0.25rem;
  `}
`;

export const Question = newStyled.div`
  width: 100%;
  padding: 1rem 0 0;
  border-top: 1px solid ${COLORS.dim}30;
  background-color: white;
`;

export const QuickOptions = newStyled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid ${COLORS.dim}20;
`;

export const OptionButton = newStyled.button`
  background-color: ${COLORS.persian_light};
  border: 1px solid ${COLORS.dim}30;
  border-radius: 1rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  color: ${COLORS.dark};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${COLORS.dim}10;
    border-color: ${COLORS.dim}50;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;
