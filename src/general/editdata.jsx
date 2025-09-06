import React, { useState } from 'react';
export const EditData = ({ contactData, contactIndex, onSave, onCancel }) => {
  const [formData, setFormData] = useState(contactData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(contactIndex, formData);
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50 min-w-72">
      <h3 className="font-bold text-gray-800 text-center mb-4">ویرایش مخاطب</h3>
      <div className="space-y-2">
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="نام شرکت"
        />
        <input
          type="text"
          name="manager"
          value={formData.manager}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="نام مدیر"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="شماره تماس"
        />
        <input
          type="text"
          name="logo"
          value={formData.logo}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="آدرس لوگو"
        />
      </div>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          ذخیره
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2 bg-gray-200 rounded-lg"
        >
          لغو
        </button>
      </div>
    </div>
  );
};