import React from "react";
import { Bell, Bot } from "lucide-react";
import ReusableModal from "./ReusableModal";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Notificaciones">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Bell className="w-5 h-5 text-gray-500" /> Algo nuevo
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Bell className="w-5 h-5 text-gray-500" /> Esto te puede interesar
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Bot className="w-5 h-5 text-gray-500" /> ¿Necesitas ayuda?
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Bell className="w-5 h-5 text-gray-500" /> Más...
        </div>
      </div>
    </ReusableModal>
  );
};

export default NotificationModal;