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
        <div className="category-container">
            <span className="title">Experience Category :</span>
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
