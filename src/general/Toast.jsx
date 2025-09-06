import React from 'react';

const actions = [
  { key: 'edit', label: 'ویرایش',  },
  { key: 'delete', label: 'حذف',  },
  { key: 'view', label: 'نمایش',  },
];

export const Toast = React.memo(({ isOpen, onClose, onAction, contactData, contactIndex, position }) => {
  if (!isOpen || !contactData) return null;

  return (
    <>
      {/* NEW: پس‌زمینه تیره (اختیاری، با انیمیشن محو شدن) */}
      <div
        className="fixed inset-0  z-40"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }} // NEW: انیمیشن برای پس‌زمینه
      />
      
      {/* NEW: استایل و انیمیشن برای پاپ‌آپ */}
      <div
        className="absolute bg-white rounded-lg p-4 shadow-2xl z-50 w-48"
        style={{
          top: `${position.top}px`,
          left: `${Math.min(position.left, window.innerWidth - 192)}px`, // NEW: تنظیم عرض جدید (w-48 ≈ 192px)
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(10px)', // NEW: انیمیشن حرکت عمودی
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out', // NEW: انیمیشن نرم
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          {actions.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onAction(key, contactIndex)}
              className="flex items-center w-full justify-start space-x-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
            >
              {/* <span>{icon}</span> */}
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-2 py-1 bg-gray-200 rounded text-sm text-gray-700 hover:bg-gray-300"
        >
          بستن
        </button>
      </div>
    </>
  );
});