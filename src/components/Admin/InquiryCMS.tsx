import React, { useState } from 'react';
import { Inquiry } from '../../types';
import { Mail, Phone, Calendar, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface InquiryCMSProps {
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  addActivityLog: (action: string, details: string) => void;
}

export default function InquiryCMS({
  inquiries,
  setInquiries,
  addActivityLog
}: InquiryCMSProps) {
  // Simple view switcher: 'cakes' for Custom Cake Requests, 'messages' for Contact Messages
  const [currentSubView, setCurrentSubView] = useState<'cakes' | 'messages'>('cakes');
  const [inquiryToDelete, setInquiryToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filter lists based on type
  const cakeRequests = inquiries.filter(i => i.type === 'custom-cake');
  const contactMessages = inquiries.filter(i => i.type === 'general' || (i.type as string) === 'contact' || !i.type);

  const handleDelete = (id: string, customerName: string) => {
    setInquiryToDelete({ id, name: customerName });
  };

  const handleDeleteConfirm = () => {
    if (!inquiryToDelete) return;
    const { id, name } = inquiryToDelete;
    setInquiries(inquiries.filter(i => i.id !== id));
    addActivityLog('Delete Inquiry', `Permanently deleted inquiry from "${name}"`);
    setInquiryToDelete(null);
  };

  const triggerWhatsApp = (phone: string, customerName: string, messageBody: string, eventDate?: string) => {
    // Sanitize phone number to contain only numeric digits
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const greeting = `Assalam-o-Alaikum ${customerName}! 🌟\nThis is Mittho Sweets & Bakers Gojra here. We received your request:\n`;
    const details = eventDate 
      ? `📅 *Event Date*: ${eventDate}\n💬 *Your Message*: ${messageBody}`
      : `💬 *Your Message*: ${messageBody}`;
    
    const textMsg = `${greeting}${details}\n\nLet's discuss details and confirm. JazakAllah!`;
    const encoded = encodeURIComponent(textMsg);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6 text-xs text-left animate-fade-in font-sans">
      <div>
        <h2 className="text-xl font-serif font-extrabold text-[#1C1917]">Inquiries & Requests</h2>
        <p className="text-stone-500 mt-1">Review custom theme cakes and standard customer messages.</p>
      </div>

      {/* SEGMENT TAB SWITCHER */}
      <div className="flex border-b border-beige">
        <button
          onClick={() => setCurrentSubView('cakes')}
          className={`flex-1 py-3 text-center font-bold text-xs cursor-pointer border-b-2 transition-all ${
            currentSubView === 'cakes' 
              ? 'border-maroon-900 text-maroon-900' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          🍰 Cake Requests ({cakeRequests.length})
        </button>
        <button
          onClick={() => setCurrentSubView('messages')}
          className={`flex-1 py-3 text-center font-bold text-xs cursor-pointer border-b-2 transition-all ${
            currentSubView === 'messages' 
              ? 'border-maroon-900 text-maroon-900' 
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          ✉️ Contact Messages ({contactMessages.length})
        </button>
      </div>

      {/* 1. CAKE REQUESTS LIST */}
      {currentSubView === 'cakes' && (
        <div className="space-y-4">
          {cakeRequests.length === 0 ? (
            <div className="bg-cream border border-beige p-8 rounded-2xl text-center">
              <p className="text-stone-400 italic">No custom cake requests received yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cakeRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-cream border border-beige rounded-2xl p-5 space-y-3.5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-beige/65 pb-2">
                      <span className="font-serif font-extrabold text-[#1C1917] text-base">{req.name}</span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-amber-800 border border-yellow-250 rounded font-bold font-mono text-[9px] uppercase">
                        Cake Customize
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans leading-relaxed text-stone-600">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-mono font-bold">{req.phone}</span>
                      </p>
                      
                      {req.date && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="font-semibold text-stone-700">Event Date: <span className="underline decoration-dotted">{req.date}</span></span>
                        </p>
                      )}

                      <div className="bg-white/70 border border-beige p-3 rounded-xl mt-2 text-stone-700 whitespace-pre-line text-xs italic">
                        "{(req as any).details || (req as any).message || 'No additional specifications provided.'}"
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center justify-between pt-3 border-t border-beige/55 select-none">
                    <button
                      onClick={() => triggerWhatsApp(req.phone, req.name, (req as any).details || (req as any).message || '', req.date)}
                      className="flex items-center gap-1.5 p-2 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-colors shadow-sm animate-fade-in"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Customer</span>
                    </button>

                    <button
                      onClick={() => handleDelete(req.id, req.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer transition-colors flex items-center justify-center shadow-sm"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. CONTACT MESSAGES LIST */}
      {currentSubView === 'messages' && (
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <div className="bg-cream border border-beige p-8 rounded-2xl text-center">
              <p className="text-stone-400 italic">No contact submissions/messages received yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="bg-cream border border-beige rounded-2xl p-5 space-y-3.5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-beige/65 pb-2">
                      <span className="font-serif font-extrabold text-[#1C1917] text-base">{msg.name}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold font-mono text-[9px] uppercase">
                        General Message
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans leading-relaxed text-stone-600">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-mono font-bold">{msg.phone}</span>
                      </p>

                      <div className="bg-white/70 border border-beige p-3 rounded-xl mt-2 text-stone-700 whitespace-pre-line text-xs italic">
                        "{(msg as any).details || (msg as any).message || 'Empty message content.'}"
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center justify-between pt-3 border-t border-beige/55 select-none">
                    <button
                      onClick={() => triggerWhatsApp(msg.phone, msg.name, (msg as any).details || (msg as any).message || '')}
                      className="flex items-center gap-1.5 p-2 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-colors shadow-sm animate-fade-in"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Customer</span>
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer transition-colors flex items-center justify-center shadow-sm"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {inquiryToDelete && (
        <DeleteConfirmModal 
          isOpen={inquiryToDelete !== null}
          onClose={() => setInquiryToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Mailbox Inquiry?"
          message={`Are you sure you want to delete the record from "${inquiryToDelete.name}"? This action is irreversible.`}
        />
      )}
    </div>
  );
}
