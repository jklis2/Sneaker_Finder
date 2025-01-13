import { useState } from "react";
import axios, { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function StyleChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('styleAdvisor');

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);

    try {
      const response = await axios.post<{
        reply: string;
        error?: string;
        estimated_time?: number;
      }>(`${API_URL}/api/chat`, { message: userInput });

      if (response.data.error && response.data.estimated_time) {
        const estimatedTime = Math.ceil(response.data.estimated_time);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `The AI model is currently loading. Please try again in ${estimatedTime} seconds.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply },
        ]);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(
        "Error communicating with the backend:",
        err.response?.data?.message || err.message
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: Unable to get a response from the server.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-4 mt-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t('chat.title')}
              </h2>
              <p className="text-sm text-gray-500">
                {t('chat.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white border-l border-r border-gray-200 scroll-smooth">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium">{t('chat.welcome')}</p>
                  <p className="text-sm">
                    {t('chat.askMe')}
                  </p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={`bg-white rounded-2xl ${
                    message.role === "user"
                      ? "rounded-tr-none bg-gray-800 text-white"
                      : "rounded-tl-none"
                  } shadow-md px-6 py-4 max-w-[80%]`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none shadow-md px-6 py-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-b-xl shadow-lg border border-t-0 border-gray-200 p-4 mb-6">
          <div className="flex flex-col max-[428px]:space-y-3 min-[429px]:flex-row min-[429px]:space-x-4">
            <input
              type="text"
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder={t('chat.placeholder')}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
            />
            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[100px] transform hover:scale-105 active:scale-95"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  {t('chat.send')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
