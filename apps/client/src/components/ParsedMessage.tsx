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

export function ParsedMessage({ text }: ParsedMessageProps) {
  if (typeof text !== 'string' || !text) {
    return <p className="text-white text-sm break-words" />;
  }

  if (text.startsWith('\\media:')) {
    const url = text.replace('\\media:', '').trim();

    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

    if (isImage) {
      return (
        <img
          src={url}
          alt="media"
          className="max-w-xs max-h-64 rounded-lg border border-gray-600"
        />
      );
    }

    return <p className="text-white text-sm break-words">{url}</p>;
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
