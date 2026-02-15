import { useState, useEffect, useCallback } from 'react';

interface QuoteData {
  text: string;
  author: string;
}

const quotes: QuoteData[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

const Quote: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const nextQuote = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
      setFade(true);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextQuote, 10000);
    return () => clearInterval(interval);
  }, [nextQuote]);

  return (
    <div className="glass-card">
      <div className="section-header">
        <div className="section-icon pink">💬</div>
        <h2 className="section-title">Inspiration</h2>
      </div>

      <div className="quote-content">
        <p
          className="quote-text"
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.4s ease',
          }}
        >
          "{quotes[index].text}"
        </p>
        <span
          className="quote-author"
          style={{
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          — {quotes[index].author}
        </span>

        <div className="quote-nav">
          {quotes.map((_, i) => (
            <button
              key={i}
              className={`quote-dot ${i === index ? 'active' : ''}`}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setIndex(i);
                  setFade(true);
                }, 400);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quote;
