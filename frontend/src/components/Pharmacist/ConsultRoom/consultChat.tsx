"use client";
import {usePathname} from "next/navigation";
import {useState, useRef, useEffect} from "react";
import {IoSend} from "react-icons/io5";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        {sender: "user1", text: "Chào bạn!"},
        {sender: "user2", text: "Bạn khỏe không?"},
    ]);
    const [input, setInput] = useState("");
    const [currentSender, setCurrentSender] = useState("user1");

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() === "") return;
        setMessages([...messages, {sender: currentSender, text: input}]);
        setInput("");
        setCurrentSender(currentSender === "user1" ? "user2" : "user1");
    };
    const pathname = usePathname();
    const segments = pathname.split("/");
    const ID = segments[segments.length - 1];

    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="p-4 font-semibold text-center text-lg">
                Phòng tư vấn {ID}
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col justify-end">
                <div className="space-y-2">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400">Chưa có tin nhắn</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`w-fit p-2 rounded-lg text-sm ${
                                    msg.sender === "user1"
                                        ? "bg-blue-100 self-start"
                                        : "bg-green-100 self-end ml-auto"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))
                    )}
                    <div ref={scrollRef}/>
                </div>
            </div>

            <div className="sticky bottom-0 ">
                <div className="flex justify-between gap-4">
                    <input
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Nhập tin nhắn (${currentSender})`}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="text-blue-600" onClick={sendMessage}>
                        <IoSend className="text-2xl"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
