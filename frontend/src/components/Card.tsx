import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="card flex-col h-fit flex bg-slate-600 px-6 pb-6 pt-4 shadow-slate-800 shadow-md rounded-xl">
      {children}
    </div>
  );
};

export default Card;
