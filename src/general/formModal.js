import React, { useState, useCallback, useEffect } from "react";
import FormInput from "./inputfield";
import MapFixed from "./mapfixed";

const ContactFormModal = ({ 
  isOpen, 
  onClose, 
  onSave,   // هم برای Add و هم برای Edit
  initialData = null, 
  mode = "add" // "add" یا "edit"
}) => {
  const [form, setForm] = useState({
    company: "",
    name: "",
    contact: "",
    logo: "/default-logo.png",
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentCenterLocation, setCurrentCenterLocation] = useState(null);

  // پر کردن فرم وقتی initialData وجود داره
  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        name: initialData.manager || "",
        contact: initialData.phone || "",
        logo: initialData.logo || "/default-logo.png",
      });
      setSelectedLocation(initialData.location || null);
    }
  }, [initialData]);

  const handleCenterChange = useCallback((loc) => {
    setCurrentCenterLocation(loc);
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactData = {
      company: form.company,
      manager: form.name,
      phone: form.contact,
      logo: form.logo,
      location: selectedLocation
        ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
        : null,
    };

    onSave(contactData); // هم برای Add هم Edit
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-10 shadow-lg max-w-md w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-8">
          {mode === "add" ? "افزودن کاربر جدید" : "ویرایش مخاطب"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="company"
            name="company"
            label="نام شرکت"
            value={form.company}
            onChange={handleChange}
          />
          <FormInput
            id="name"
            name="name"
            label="نام و نام خانوادگی"
            value={form.name}
            onChange={handleChange}
          />

          {/* فیلد انتخاب موقعیت */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              موقعیت مکانی
            </label>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="w-full py-2 px-3 border rounded-lg text-gray-700 bg-gray-50"
            >
               انتخاب موقعیت روی نقشه
            </button>
          </div>

          <FormInput
            id="contact"
            name="contact"
            label="اطلاعات تماس"
            value={form.contact}
            onChange={handleChange}
          />

          <FormInput
            id="logo"
            name="logo"
            label="آدرس لوگو"
            value={form.logo}
            onChange={handleChange}
          />

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 py-3 border-2 border-gray-600 text-gray-600 font-medium rounded-lg btn-hover"
            >
              {mode === "add" ? "ثبت" : "ذخیره تغییرات"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg btn-hover"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>

      {/* مدال انتخاب موقعیت مکانی */}
      {isMapOpen &&  (
        
        
       

        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsMapOpen(false)}
        > 
       
          <div
            className="bg-white rounded-2xl shadow-lg w-[90%] h-[85%] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center py-3 border-b">
              انتخاب موقعیت مکانی
            </h3>

            {/* نقشه */}
            <div className="flex-1 relative">
              <MapFixed
                mode="select"
                selectedLocation={selectedLocation}
                onCenterChange={handleCenterChange}
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                className="flex-1 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                      setSelectedLocation(loc);
                    });
                  } else {
                    alert("GPS در دسترس نیست");
                  }
                }}
              >
                موقعیت فعلی من
              </button>
              <button
                className="flex-1 py-2 bg-gray-200 rounded-lg"
                onClick={() => setIsMapOpen(false)}
              >
                بستن
              </button>
              <button
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => {
                  setSelectedLocation(currentCenterLocation);
                  setIsMapOpen(false);
                }}
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
        .btn-hover {
          transition: all 0.3s ease;
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(55, 65, 81, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ContactFormModal;
