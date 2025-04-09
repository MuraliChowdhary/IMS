import React from "react";

interface CardProps {
  name: string[];
  ele: string[][];
}

export const Card: React.FC<CardProps> = (props) => {
  const handleClick = (item: string) => {
    console.log(`Clicked on: ${item}`);
    // Add your navigation logic here
    // For example: router.push(`/${item.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      {props.name.map((heading, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-gray-950 font-semibold text-lg mb-2">
            {heading}
          </h2>

          <ul className="text-gray-400">
            {props.ele[index]?.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                <a
                  onClick={() => handleClick(item)}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
