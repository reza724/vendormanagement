import React from "react";

const FormInput = ({ id, label, ...rest }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <input
      id={id}
      {...rest}
      className="w-full py-3 border-0 border-b-2 border-gray-200 bg-transparent text-base outline-none focus:border-gray-700 transition-colors"
    />
  </div>
);

export default FormInput;