import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface Message {
    sender: "user" | "bot";
    text: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [user, setUser] = useState<{ id: string } | null>(null); 

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData && userData.id) {
            setUser(userData); 
        }
    }, []); 

    const sendMessage = async (message?: string) => {
        const messageToSend = message || input.trim();
        if (!messageToSend || !user?.id) return; 

        const newMessages: Message[] = [...messages, { sender: "user", text: messageToSend }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageToSend, user_id: user.id }) 
            });

            const data = await response.json();
            setMessages([...newMessages, { sender: "bot", text: data.reply }]);
            setSuggestedQuestions(data.suggestedQuestions || []);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col items-end">
            {isOpen && (
                <div className="w-96 h-[500px] bg-white shadow-lg rounded-lg p-4 dark:bg-gray-800 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-lg font-semibold dark:text-white text-gray-600">Chat Financeiro</h3>
                        <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="flex-1 overflow-y-auto mb-2 p-2 border">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-md my-1 ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800"}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    {suggestedQuestions.length > 0 && (
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold mb-1 dark:text-white text-gray-600">Perguntas Sugeridas:</h4>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                                        onClick={() => sendMessage(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex">
                        <input
                            className="flex-1 border p-2 rounded-l-md dark:bg-gray-700 dark:text-white text-gray-800"
                            type="text"
                            placeholder="Digite sua pergunta..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className="bg-blue-500 text-white px-4 rounded-r-md" onClick={() => sendMessage()}>Enviar</button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                <MessageCircle />
            </button>
        </div>
    );
}