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
        <div className="category-container">
            <span className="title">Category Selection :</span>
            <input 
                type="text" 
                className="category-input"
                placeholder="Search category..."
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                onFocus={() => setIsCategoryOpen(true)}
                onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
            />
            {isCategoryOpen && (
                <ul className="category-list">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, index) => (
                            <li 
                                key={index} 
                                className="category-item"
                                onClick={() => handleCategorySelect(cat)}
                            >
                                {cat}
                            </li>
                        ))
                    ) : (
                        <li className="category-no-match">No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Category;
