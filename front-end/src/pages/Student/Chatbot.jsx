import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Send, GraduationCap } from "lucide-react";

const Chatbot = ({ open, initialOpen = true, onOpenChange }) => {
  const isControlled = typeof open === "boolean";
  const [isOpen, setIsOpen] = useState(open ?? initialOpen);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content: "Hi! I'm UniBot 👋 How can I help you today? Ask me anything about Punjab universities or UniSphere.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isControlled) {
      setIsOpen(open);
    }
  }, [isControlled, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    if (!isControlled) {
      setIsOpen(nextState);
    }
    onOpenChange?.(nextState);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message
    const updatedHistory = [...history, { role: "user", content: userMessage }];
    setHistory(updatedHistory);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/unibot/chatbot/message", {
        message: userMessage,
        history: history,
      });

      setHistory([
        ...updatedHistory,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      setHistory([
        ...updatedHistory,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-200 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <GraduationCap size={26} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              🎓
            </div>            <div>
              <h3 className="font-semibold text-lg">UniBot</h3>
              <p className="text-xs opacity-90">Punjab Universities Assistant</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {history.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="text-gray-500">UniBot is thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about universities, programs, merit, or UniSphere..."
                disabled={loading}
                className="flex-1 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-full px-5 py-3 text-sm outline-none disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;