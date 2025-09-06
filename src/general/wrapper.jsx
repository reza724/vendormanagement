import React, { useState, useReducer, useEffect } from "react";
import MapFixed from "./mapfixed";
import contactsData from "../data/items.json";
import { SearchField } from "./searchfield";
import { ACTIONS, contactsReducer } from "./contactReducer";
import ContactFormModal from "./formModal";

const Wrapper = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addForm, setAddForm] = useState(false);
 

  const initialData = JSON.parse(localStorage.getItem("contacts")) || contactsData;
  const [contacts, dispatch] = useReducer(contactsReducer, initialData);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleSelectLocation = (location) => setSelectedLocation(location);


  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between max-w-7xl mx-auto gap-4">
          
          {/* Search Field */}
          <SearchField onSearch={handleSearch} />

          {/* Add User Button */}
        <button
  onClick={() => setAddForm(true)}
  className="mx-auto sm:mx-0 sm:ml-6 mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white 
            px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm 
            rounded-lg font-medium flex items-center gap-2 shadow-sm 
            transition-all duration-200 hover:shadow-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  <i className="fas fa-plus text-xs"></i>
  افزودن کاربر
</button>

<ContactFormModal
  isOpen={addForm}
  onClose={() => setAddForm(false)}
  mode="add"
  onSave={(newContact) => {
    dispatch({ type: ACTIONS.ADD_CONTACT, payload: newContact });
  }}
/>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
          <div className="mb-8 ">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              لیست شرکت ها
            </h1>
          </div>
          {React.cloneElement(children, {
            searchQuery,
            contacts,
            dispatch,
            onSelectLocation: handleSelectLocation,
          })}
        </div>

        <div className="w-full lg:w-1/2 p-4 lg:p-8">
          <div className="glass-effect bg-white/30 backdrop-blur-md rounded-2xl h-64 lg:h-full flex items-center justify-center">
            <MapFixed contacts={contacts} selectedLocation={selectedLocation} />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Wrapper;
