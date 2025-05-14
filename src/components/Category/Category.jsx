import { useState } from "react";
import "./Category.css"; // Import the CSS file

const Category = ({ onCategorySelect }) => {
    const [category, setCategory] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categories = [
        "Legal", "Technology", "Technology-Contract", "Property & Construction",
        "Procurement & Supply Chain", "Human Resources", "Healthcare & Life Sciences",
        "Finance & Accounting Skills", "Banking", "Sales & Marketing"
    ];

    const dic = {"Legal":"Legal", "Technology":"Technology", "Technology-Contract": "Technology_Contracting", "Property & Construction": "property_and_construction", "Human Resources": "Human_Resources", 
        "Healthcare & Life Sciences":"Healthcare_and_Life_Sciences", "Finance & Accounting Skills": "Finance_and_accounting", "Banking":"Banking"
    ,"Sales & Marketing":"Sales_and_Marketing", "Procurement & Supply Chain":"Procurement_and_supply_chain"
    }

    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().startsWith(category.toLowerCase())
    );

    const handleCategorySelect = (cat) => {
        setCategory(cat);
        setIsCategoryOpen(false);
        onCategorySelect(dic[cat]); // Send selected category to parent
    };

    return (
       <div className="relative w-full max-w-sm">
  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
    Category Selection:
  </label>
  <input
    type="text"
    id="category"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
    placeholder="Search category..."
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    onFocus={() => setIsCategoryOpen(true)}
    onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
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
