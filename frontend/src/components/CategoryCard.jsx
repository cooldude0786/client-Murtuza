import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, className }) => {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <h2 className="card-title text-2xl">{category.name}</h2>
        <div className="divider"></div>
        <ul className="space-y-2">
          {category.subCategories.map((sub) => (
            <li key={sub.slug}>
              {/* Change the 'to' prop to match your new route */}
              <Link 
                to={`/all/${sub.slug}`} 
                className="link link-hover link-primary"
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryCard;