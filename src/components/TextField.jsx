import React, { useState } from 'react';

function TextField({ children, name, type }) {
  const [inputValue, setInputValue] = useState("")

  const handleInputValue = (e) => { setInputValue(e.target.value) }
  return (
    <div className="relative h-12 group">
      <label
        htmlFor={name}
        className={`
          absolute left-4
          translate-y-[14px]
          px-2
          text-[var(--gray-clr)]
          cursor-text
          bg-white
          transition-all duration-200
          group-hover:translate-y-[-10px]
          group-hover:text-[var(--primary-hover-clr)]
          group-hover:text-sm
          peer-focus:translate-y-[-10px]
          peer-focus:text-[var(--primary-clr)]
          peer-focus:text-sm
            ${inputValue ?
            'translate-y-[-10px] text-sm text-[var(--primary-clr)]' :
            'translate-y-[14px] group-hover:translate-y-[-10px] group-hover:text-sm group-hover:text-[var(--primary-hover-clr)] '
          }
        `}
      >
        {name}
      </label>

      <input
        type={type}
        name={name}
        id={name}
        className="
          peer
          w-full h-full 
          px-4 py-3
          border rounded-sm
          border-[var(--gray-light-clr)]
          outline-none 
          transition-colors
          hover:border-[var(--primary-hover-clr)]
          focus:border-[var(--primary-clr)]
        "
        value={inputValue}
        onChange={handleInputValue}
      />

    </div>
  );
}

export default TextField;