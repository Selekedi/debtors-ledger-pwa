import React,{ useState, useRef } from "react";

export default function SearchBar({ data, placeholder, filterFn, onSelect, renderItem }) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null)

  const filtered = data.filter(item =>
    filterFn(item,query.toLowerCase())
  );

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      onSelect(filtered[highlightedIndex]);
      setQuery('');
      setHighlightedIndex(-1);
      setIsFocused(false);
      inputRef.current?.blur()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        onKeyDown={handleKeyDown}
      />
      {isFocused && filtered.length > 0 && (
        <ul style={{ background: 'white', border: '1px solid gray' }}>
          {filtered.map((item, index) => (
            <li
              key={item}
              style={{ background: index === highlightedIndex ? '#eee' : 'white', padding: '4px' }}
              onMouseDown={() => {
                onSelect(item);
                setQuery('');
                setIsFocused(false);
              }}
            >
              {renderItem(item,
                {isHighlighted:index === highlightedIndex})}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
