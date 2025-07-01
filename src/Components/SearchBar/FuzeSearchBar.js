import Fuse from "fuse.js";
import React,{ useState, useRef, useEffect } from "react";
import "./FusySearchBar.css"

export default function FuzeSearchBar({ data,searchFeilds, placeholder, onSelect, renderItem }) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null)
  const itemRefs = useRef([]);

  
  const fuse = new Fuse(data, {
    keys:searchFeilds,
    ignoreLocation:true,
    threshold:0.3
  })

  const filtered = query ? fuse.search(query).map(res => res.item) : data

  useEffect(() => {
	  itemRefs.current = [];
	}, [filtered]);

  function scrollToItem(index) {
	  const el = itemRefs.current[index];
	  if (el) {
		el.scrollIntoView({ block: 'nearest' });
	  }
	}

  function handleKeyDown(e) {
	  if (e.key === 'ArrowDown') {
		setHighlightedIndex((i) => {
		  const nextIndex = (i + 1) % filtered.length;
		  scrollToItem(nextIndex);
		  return nextIndex;
		});
	  } else if (e.key === 'ArrowUp') {
		setHighlightedIndex((i) => {
		  const nextIndex = (i - 1 + filtered.length) % filtered.length;
		  scrollToItem(nextIndex);
		  return nextIndex;
		});
	  } else if (e.key === 'Enter' && highlightedIndex >= 0) {
		onSelect(filtered[highlightedIndex]);
		setQuery('');
		setHighlightedIndex(-1);
		setIsFocused(false);
		inputRef.current?.blur();
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
        style ={{padding:"8px", borderRadius:"8px"}}
      />
      {isFocused && filtered.length > 0 && (
        <ul className="search-results">
		  {filtered.map((item, index) => (
			<li
			  key={item.id}
			  ref={(el) => (itemRefs.current[index] = el)}
			  className={index === highlightedIndex ? "highlighted" : ""}
			  onMouseDown={() => {
				onSelect(item);
				setQuery('');
				setIsFocused(false);
			  }}
			>
			  {renderItem(item, { isHighlighted: index === highlightedIndex })}
			</li>
		  ))}
	</ul>
      )}
    </div>
  );
}
