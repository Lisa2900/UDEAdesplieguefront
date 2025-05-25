import React from "react";
  
interface ModalDesignProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const ModalDesign: React.FC<ModalDesignProps> = ({
  title,
  children,
  
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[450px]">
        <h2 className="text-center text-xl font-bold text-gray-800">{title}</h2>
        <div className="mt-4">{children}</div>
        <div className="flex justify-center mt-6"></div>
      </div>
    </div>
  );
};

export default ModalDesign;
