import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog Card */}
      <div className="bg-white rounded-2xl border border-stone-250 max-w-sm w-full p-6 relative shadow-2xl space-y-4 animate-fade-in text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all cursor-pointer"
          aria-label="Close Confirmation Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-extrabold text-[#1C1917]">{title}</h3>
            <p className="text-[9px] uppercase font-mono tracking-wider text-red-600 font-bold leading-none mt-0.5">Danger Action</p>
          </div>
        </div>

        <p className="text-stone-600 text-[11px] leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl font-bold cursor-pointer transition-colors text-[11px]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-sm text-[11px]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
