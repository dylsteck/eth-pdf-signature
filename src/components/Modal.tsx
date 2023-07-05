import React, { useState } from 'react';

type ModalProps = {
    title: string;
    content: string;
    close: () => void;
    changeSelectedValue: (value: string) => void;
  };

export const Modal: React.FC<ModalProps> = ({ title, content, close, changeSelectedValue }) => {

  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    changeSelectedValue(event.target.value);
  };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Success!</h2>
          <p>Where on the PDF do you want the signature to be placed?</p>
          <div>
            <div>
              <input
                type="radio"
                name="myRadioGroup"
                value="top"
                checked={selectedValue === 'top'}
                onChange={handleRadioChange}
              />
              <label>Top</label>
            </div>

            <div>
              <input
                type="radio"
                name="myRadioGroup"
                value="bottom"
                checked={selectedValue === 'bottom'}
                onChange={handleRadioChange}
              />
              <label>Bottom</label>
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={close}
          >
            Download
          </button>
        </div>
      </div>
    );
  };  