import React, { useReducer, useState } from 'react';
import contactsData from '../data/items.json';

// Types for better code organization
const ACTIONS = {
  SET_CONTACTS: 'SET_CONTACTS',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  DELETE_CONTACT: 'DELETE_CONTACT'
};

const TOAST_ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete', 
  VIEW: 'view',
  CALL: 'call'
};

// Reducer for contacts management
const contactsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONTACTS:
      return action.payload;
    case ACTIONS.UPDATE_CONTACT:
      return state.map((contact, index) => 
        index === action.index ? { ...contact, ...action.payload } : contact
      );
    case ACTIONS.DELETE_CONTACT:
      return state.filter((_, index) => index !== action.index);
    default:
      return state;
  }
};

// Form validation utility
const validateForm = (formData) => {
  const errors = {};
  if (!formData.company.trim()) errors.company = 'نام برند الزامی است';
  if (!formData.manager.trim()) errors.manager = 'نام مدیر الزامی است';
  if (!formData.phone.trim()) errors.phone = 'شماره تماس الزامی است';
  if (!formData.logo.trim()) errors.logo = 'آدرس لوگو الزامی است';
  return errors;
};

// Reusable Form Input Component
const FormInput = ({ label, name, value, onChange, error, type = "text", placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Button Component
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '' 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Icon Components
const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Toast Component
const Toast = ({ isOpen, onClose, onAction, contactData, contactIndex }) => {
  const actions = [
    { key: TOAST_ACTIONS.EDIT, label: 'ویرایش', icon: '✏️', variant: 'primary' },
    { key: TOAST_ACTIONS.DELETE, label: 'حذف', icon: '🗑️', variant: 'danger' },
    { key: TOAST_ACTIONS.VIEW, label: 'نمایش', icon: '👁️', variant: 'secondary' },
    { key: TOAST_ACTIONS.CALL, label: 'تماس', icon: '📞', variant: 'success' }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50 min-w-80">
        <div className="text-center mb-6">
          <img 
            src={contactData?.logo} 
            alt={`${contactData?.company} logo`} 
            className="w-16 h-16 rounded-xl object-cover mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-800">{contactData?.company}</h3>
          <p className="text-sm text-gray-600">{contactData?.manager}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => (
            <Button
              key={action.key}
              onClick={() => onAction(action.key, contactIndex)}
              variant={action.variant}
              className="flex items-center justify-center space-x-2"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
        
        <Button
          onClick={onClose}
          variant="secondary"
          className="w-full mt-4"
        >
          بستن
        </Button>
      </div>
    </>
  );
};

// Edit Form Component
const EditForm = ({ isOpen, onClose, contactData, onSave, contactIndex }) => {
  const [formData, setFormData] = useState({
    company: '',
    manager: '',
    phone: '',
    logo: ''
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen && contactData) {
      setFormData({
        company: contactData.company || '',
        manager: contactData.manager || '',
        phone: contactData.phone || '',
        logo: contactData.logo || ''
      });
      setErrors({});
    }
  }, [isOpen, contactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData, contactIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          ویرایش اطلاعات تماس
        </h2>
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="نام برند"
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            placeholder="نام شرکت را وارد کنید"
          />
          
          <FormInput
            label="نام و نام خانوادگی مدیر"
            name="manager" 
            value={formData.manager}
            onChange={handleChange}
            error={errors.manager}
            placeholder="نام مدیر را وارد کنید"
          />
          
          <FormInput
            label="شماره تماس"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="شماره تماس را وارد کنید"
          />
          
          <FormInput
            label="آدرس تصویر لوگو"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            error={errors.logo}
            placeholder="آدرس URL لوگو را وارد کنید"
          />

          <div className="flex space-x-3 mt-6">
            <Button type="submit" variant="primary" className="flex-1">
              ذخیره تغییرات
            </Button>
            <Button 
              type="button" 
              onClick={onClose} 
              variant="secondary" 
              className="flex-1"
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

// Contact Card Component
const ContactCard = ({ item, index, onInfoClick }) => (
  <div className="glass-effect bg-white/30 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between shadow">
    {/* Right side */}
    <div className="flex items-center space-x-4">
      <img 
        src={item.logo} 
        alt={`${item.company} logo`} 
        className="w-16 h-16 rounded-xl object-cover" 
      />
      <div className="text-right">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.company}
        </h3>
        <p className="text-sm text-gray-600">{item.manager}</p>
      </div>
    </div>

    {/* Left side */}
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onInfoClick(item, index)}
          className="text-gray-400 hover:text-blue-600 p-2 transition-colors"
          title="اطلاعات بیشتر"
        >
          <InfoIcon />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {item.phone}
        </span>
        <PhoneIcon />
      </div>
    </div>
  </div>
);

// Main Component
const ContactCardList = () => {
  const [contacts, dispatch] = useReducer(contactsReducer, contactsData);
  const [toast, setToast] = useState({ isOpen: false, contactData: null, contactIndex: null });
  const [editForm, setEditForm] = useState({ isOpen: false, contactData: null, contactIndex: null });

  const handleInfoClick = (contactData, contactIndex) => {
    setToast({ isOpen: true, contactData, contactIndex });
  };

  const closeToast = () => {
    setToast({ isOpen: false, contactData: null, contactIndex: null });
  };

  const handleToastAction = (action, contactIndex) => {
    const contactData = contacts[contactIndex];
    
    switch (action) {
      case TOAST_ACTIONS.EDIT:
        setEditForm({ isOpen: true, contactData, contactIndex });
        closeToast();
        break;
        
      case TOAST_ACTIONS.DELETE:
        if (window.confirm('آیا از حذف این مخاطب اطمینان دارید؟')) {
          dispatch({ type: ACTIONS.DELETE_CONTACT, index: contactIndex });
          closeToast();
        }
        break;
        
      case TOAST_ACTIONS.VIEW:
        alert(`اطلاعات ${contactData.company}:\nمدیر: ${contactData.manager}\nتلفن: ${contactData.phone}`);
        break;
        
      case TOAST_ACTIONS.CALL:
        window.open(`tel:${contactData.phone}`, '_self');
        break;
        
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleSaveEdit = (formData, contactIndex) => {
    dispatch({ 
      type: ACTIONS.UPDATE_CONTACT, 
      index: contactIndex, 
      payload: formData 
    });
    
    // Here you would normally save to JSON file via API
    // For now we'll just log the updated data
    console.log('Updated contacts data:', contacts);
  };

  const closeEditForm = () => {
    setEditForm({ isOpen: false, contactData: null, contactIndex: null });
  };

  return (
    <>
      <div className="space-y-4 p-4">
        {contacts.map((item, idx) => (
          <ContactCard
            key={`${item.company}-${idx}`}
            item={item}
            index={idx}
            onInfoClick={handleInfoClick}
          />
        ))}
      </div>

      <Toast
        isOpen={toast.isOpen}
        onClose={closeToast}
        onAction={handleToastAction}
        contactData={toast.contactData}
        contactIndex={toast.contactIndex}
      />

      <EditForm
        isOpen={editForm.isOpen}
        onClose={closeEditForm}
        contactData={editForm.contactData}
        contactIndex={editForm.contactIndex}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default ContactCardList;