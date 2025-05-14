import { useState } from "react";
import "./ExperienceCategory.css"; // Import the CSS file

const Category = ({ onEXPCategorySelect }) => {
    const [category, setCategory] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categories = [
        "Entry-level (0-2 years)", "Mid-Level (2-5 years)", "Senior-Level (5+ years)"
    ];

    const dic = { "Entry-level (0-2 years)": "Fresher", "Mid-Level (2-5 years)": "mid", "Senior-Level (5+ years)": "senior"}

    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().startsWith(category.toLowerCase())
    );

    const handleCategorySelect = (cat) => {
        setCategory(cat);
        setIsCategoryOpen(false);
        onEXPCategorySelect(dic[cat]); // Send selected category to parent
    };

    return (
      <div className="relative w-full max-w-sm">
  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
    Experience Category:
  </label>
  <input
    type="text"
    id="experience"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
    placeholder="Search category..."
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    onFocus={() => setIsCategoryOpen(true)}
    onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)} // Prevents immediate close before onClick
  />
  {isCategoryOpen && (
    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto text-sm">
      {filteredCategories.length > 0 ? (
        filteredCategories.map((cat, index) => (
          <li
            key={index}
            onClick={() => handleCategorySelect(cat)}
            className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-700"
          >
            {cat}
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-400 italic">No matches found</li>
      )}
    </ul>
  )}
</div>

    );
};

export default Category;
