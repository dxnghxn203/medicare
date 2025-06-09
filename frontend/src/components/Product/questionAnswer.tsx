import { useState } from "react";

interface QAItem {
  question: string;
  answer?: string;
}

const QuestionAnswer: React.FC = () => {
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim()) {
      setQuestions([...questions, { question }]);
      setQuestion("");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Hỏi & Đáp</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Nhập câu hỏi..."
      />
      <button className="mt-2" onClick={handleSubmit}>
        Gửi câu hỏi
      </button>

      <div className="mt-4">
        {questions.map((qa, index) => (
          <div key={index} className="border-b py-2">
            <p className="font-semibold">Q: {qa.question}</p>
            <p className="text-gray-500">
              {qa.answer ? `A: ${qa.answer}` : "Chưa có câu trả lời"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionAnswer;
