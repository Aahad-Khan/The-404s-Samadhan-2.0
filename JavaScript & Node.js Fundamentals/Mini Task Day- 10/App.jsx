import React from 'react';

const App = () => {
  // Mock product data for a Protein bar
  const product = {
    name: "Protein Bar",
    price: 60.00,
    description: "A wholesome protein bar infused with the rich and aromatic spices of India.",
    benefits: [
      { text: "High in PROTEIN", color: "text-orange-500" },
      { text: "Boosts ENERGY", color: "text-yellow-400" },
      { text: "Rich in FIBER", color: "text-green-500" },
      { text: "No added SUGAR", color: "text-emerald-500" },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-inter">
      {/* Product Card Container */}
      <div className="bg-gray-800 text-white shadow-2xl rounded-2xl w-full max-w-sm mx-auto overflow-hidden transform transition duration-500 hover:scale-105">
        
        {/* Product Image Section */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1621057621391-7ed446a24b41?q=80&w=2014&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Delicious Protein Bar"
            className="w-full h-64 object-cover object-center"
          />
          <span className="absolute top-4 left-4 bg-orange-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
            NEW
          </span>
        </div>

        {/* Product Details Section */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-4xl font-extrabold text-orange-400">₹{product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-400 mt-2 text-sm">{product.description}</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Key Benefits:</h3>
            <ul className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-1">
                  {benefit.text.split(' ').map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className={word === word.toUpperCase() && word.length > 1
                        ? `${benefit.color} text-lg font-bold`
                        : 'text-gray-300'
                      }
                    >
                      {word}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0">
          <button className="w-full bg-orange-400 text-gray-900 font-bold py-3 rounded-lg shadow-lg hover:bg-orange-500 transition duration-300">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
