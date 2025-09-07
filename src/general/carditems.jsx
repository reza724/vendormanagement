import React, { useState, useRef, useMemo } from "react";
import { Toast } from "./Toast";
import ContactFormModal from "./formModal";
import { ACTIONS } from "./contactReducer";

export const ContactCardList = ({ searchQuery, contacts, dispatch, onSelectLocation }) => {
  // --- State for Toast (menu for each toast)
  const [toast, setToast] = useState({
    isOpen: false,
    contactData: null,
    contactIndex: null,
    position: { top: 0, left: 0 }
  });

  // --- State  Add
  const [addForm, setAddForm] = useState(false);

  // --- State  Edit
  const [editForm, setEditForm] = useState({
    isOpen: false,
    contactData: null,
    contactIndex: null,
  });

  const triggerRefs = useRef({});

  // close edit
  const closeEditForm = () =>
    setEditForm({ isOpen: false, contactData: null, contactIndex: null });

  // save edit
  const handleSaveEdit = (contactIndex, updatedData) => {
    dispatch({ type: ACTIONS.UPDATE_CONTACT, index: contactIndex, payload: updatedData });
    closeEditForm();
  };

  // find position of cart
  const handleInfoClick = (contactIndex) => {
    const rect = triggerRefs.current[contactIndex]?.getBoundingClientRect();
    const position = rect
      ? { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX }
      : { top: 0, left: 0 };
    setToast({
      isOpen: true,
      contactData: contacts[contactIndex],
      contactIndex,
      position,
    });
  };

  const closeToast = () =>
    setToast({ isOpen: false, contactData: null, contactIndex: null, position: { top: 0, left: 0 } });

  //  Toast actions
  const handleToastAction = (actionKey, contactIndex) => {
    switch (actionKey) {
      case "edit":
        setEditForm({
          isOpen: true,
          contactData: contacts[contactIndex],
          contactIndex,
        });
        closeToast();
        break;
      case "delete":
        dispatch({ type: ACTIONS.DELETE_CONTACT, index: contactIndex });
        closeToast();
        break;
      case "view":
        if (contacts[contactIndex].location) {
          onSelectLocation(contacts[contactIndex].location);
        }
        closeToast();
        break;
      case "call":
        window.open(`tel:${contacts[contactIndex].phone}`);
        closeToast();
        break;
      default:
        closeToast();
    }
  };

  //search filters
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter((item) =>
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  return (
    <div className="space-y-4 p-4">

      {/* card lists */}
      {filteredContacts.length === 0 ? (
        <div className="glass-effect bg-white/30 backdrop-blur-md rounded-2xl p-6 text-center text-gray-600">
          آیتمی یافت نشد.
        </div>
      ) : (
        filteredContacts.map((item, idx) => (
          <div
            key={idx}
            className="glass-effect bg-white/30 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 cursor-pointer rounded-2xl p-6 flex items-center justify-between shadow"
          >
            <div className="flex items-center space-x-4">
              <img src={item.logo} alt="لوگو" className="w-16 h-16 rounded-xl object-cover" />
              <div className="text-right pr-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.company}</h3>
                <p className="text-sm text-gray-600">{item.manager}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-end">
                <button
                  ref={(el) => (triggerRefs.current[idx] = el)}
                  onClick={() => handleInfoClick(idx)}
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg flex items-center justify-center">
                  <p className="text-sm pl-2 font-medium text-gray-900" dir="ltr">
                    {item.phone}
                  </p>
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Toast actions */}
      <Toast {...toast} onClose={closeToast} onAction={handleToastAction} />

      {/*  Add form */}
      {addForm && (
        <ContactFormModal
          isOpen={addForm}
          onClose={() => setAddForm(false)}
          mode="add"
          onSave={(newContact) =>
            dispatch({ type: ACTIONS.ADD_CONTACT, payload: newContact })
          }
        />
      )}

      {/*  Edit form */}
      {editForm.isOpen && (
        <ContactFormModal
          isOpen={editForm.isOpen}
          onClose={closeEditForm}
          onSave={(updatedContact) =>
            handleSaveEdit(editForm.contactIndex, updatedContact)
          }
          initialData={editForm.contactData}
          mode="edit"
        />
      )}
    </div>
  );
};

export default ContactCardList;
