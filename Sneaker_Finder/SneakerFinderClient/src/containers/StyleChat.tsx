import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function StyleChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);

    try {
      const response = await axios.post<{
        reply: string;
        error?: string;
        estimated_time?: number;
      }>("http://localhost:5000/api/chat", { message: userInput });

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
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm mt-2">AI is thinking...</div>
        )}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow border rounded-l-lg p-2"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
