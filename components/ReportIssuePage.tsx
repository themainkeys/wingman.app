import React from 'react';

const InputField: React.FC<{ label: string, placeholder: string, id: string }> = ({ label, placeholder, id }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="text" id={id} placeholder={placeholder} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-amber-400 focus:border-amber-400" />
    </div>
);

const TextareaField: React.FC<{ label: string, placeholder: string, id: string, rows?: number, optional?: boolean }> = ({ label, placeholder, id, rows = 4, optional = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label} {optional && <span className="text-gray-500">(optional)</span>}</label>
        <textarea id={id} placeholder={placeholder} rows={rows} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-amber-400 focus:border-amber-400 resize-none"></textarea>
    </div>
);


export const ReportIssuePage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 animate-fade-in text-white">
      <div className="space-y-6">
        <InputField label="Issue Title" id="issue-title" placeholder="e.g., App crashes on launch" />
        <TextareaField label="Describe the issue" id="issue-description" placeholder="Please provide a detailed description of the problem you are facing." />
        <TextareaField label="Steps to reproduce" id="issue-steps" placeholder={"1. Go to '...'\n2. Click on '...'\n3. Scroll down to '...'\n4. See error"} optional />
        
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </div>
                <p className="text-gray-300 font-semibold">Add Screenshots or Videos</p>
                <p className="text-sm text-gray-500 mt-1 mb-4">Help us understand the issue better by providing visual context.</p>
                <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                    Upload
                </button>
            </div>
        </div>
      </div>
      <div className="mt-10">
        <button className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105">
            Submit Report
        </button>
      </div>
    </div>
  );
};
