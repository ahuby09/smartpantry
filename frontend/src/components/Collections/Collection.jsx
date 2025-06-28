import React from "react";
import "./Collection.css";

const collections = [
  {
    name: "Pancakes",
    image:
      "https://plus.unsplash.com/premium_photo-1663854478296-dd00b6257021?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "pancakes",
  },
  {
    name: "Stir Fries",
    image:
      "https://plus.unsplash.com/premium_photo-1664478238082-3df93e48c491?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "stirfries",
  },
  {
    name: "Hot right now",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "dinner1",
  },
  {
    name: "Dinner",
    image:
      "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?q=80&w=727&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "dinner2",
  },
  {
    name: "BBQ",
    image:
      "https://images.unsplash.com/photo-1508615263227-c5d58c1e5821?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "bbq",
  },
  {
    name: "Mocktail",
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    area: "mocktail",
  },
];

const Collections = () => {
  return (
    <div className="collections-wrapper">
      <h2>Collections</h2>
      <div className="collections-grid">
        {collections.map((item, index) => (
          <div
            key={index}
            className={`collection-card ${item.area}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
