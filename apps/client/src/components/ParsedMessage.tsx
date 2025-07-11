interface ParsedMessageProps {
  text: string;
}

const emojiMap: { [key: string]: string } = {
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':smile:': '😄',
  ':laughing:': '😆',
  ':blush:': '😊',
  ':relaxed:': '☺️',
  ':smirk:': '😏',
  ':heart:': '❤️',
  ':rocket:': '🚀',
  ':ok_hand:': '👌',
  ':v:': '✌️',
};

const emojiRegex = new RegExp(`(${Object.keys(emojiMap).join('|')})`);

interface ParsedMessageProps {
  text: string;
}

export function ParsedMessage({ text }: ParsedMessageProps) {
  if (typeof text !== 'string' || !text) {
    return <p className="text-white text-sm break-words"></p>;
  }
  
  const parts = text.split(emojiRegex);

  return (
    <p className="text-white text-sm break-words">
      {parts.map((part, i) => 
        emojiMap[part] ? <span key={i}>{emojiMap[part]}</span> : part
      )}
    </p>
  );
}