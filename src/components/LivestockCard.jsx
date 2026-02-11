import React from "react";

const LivestockCard = ({
  animal,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 border border-gray-100">
      <img
        src={animal.image_url || "https://placehold.co/600x400"}
        alt={animal.breed}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="font-bold text-lg">
        {animal.species} - {animal.breed}
      </h3>
      <p className="text-gray-600 text-sm mb-2">{animal.location}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-bold text-xl">
          KES {animal.price}
        </span>
        <button
          onClick={() => onAddToCart(animal.id)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default LivestockCard;
