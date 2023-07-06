import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type ModalProps = {
    title: string;
    content: string;
    close: () => void;
    changeSelectedValue: (value: string) => void;
  };

export const DownloadModal: React.FC<ModalProps> = ({ title, content, close, changeSelectedValue }) => {

  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    changeSelectedValue(event.target.value);
  };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4">Success!</h2>
          <p className="mb-2">Where on the PDF do you want the signature to be placed?</p>
          <div>
            <div>
              <input
                type="radio"
                name="myRadioGroup"
                value="top"
                checked={selectedValue === 'top'}
                onChange={handleRadioChange}
              />
              <label className="ml-2">Top</label>
            </div>

            <div>
              <input
                type="radio"
                name="myRadioGroup"
                value="bottom"
                checked={selectedValue === 'bottom'}
                onChange={handleRadioChange}
              />
              <label className="ml-2">Bottom</label>
            </div>
          </div>
          {/* <button
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 shadow-md"
            onClick={close}
          >
            Confirm & Download Signed PDF
          </button> */}
          <button
          type="button"
          onClick={close}
          disabled={selectedValue === ''}
          className="disabled:bg-gray-50 disabled:text-gray-600 disabled:hover:bg-gray-200 disabled:hover:cursor-not-allowed mt-6 inline-flex items-center gap-x-1.5 rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100"
          >
            <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Confirm & Download Signed PDF
          </button>
          </div>
      </div>
    );
  };  