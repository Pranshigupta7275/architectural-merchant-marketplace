import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center transition-all duration-300 ${isFocused ? "w-64" : "w-48"}`}
    >
      <Search className="absolute left-3 w-4 h-4 text-neutral-400 stroke-[1.5]" />
      <input
        type="text"
        placeholder="Search curations..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-neutral-100 border border-transparent focus:border-neutral-300 focus:bg-white text-[13px] rounded-full py-2 pl-9 pr-4 outline-none transition-all duration-300 placeholder:text-neutral-400"
      />
    </div>
  );
}
