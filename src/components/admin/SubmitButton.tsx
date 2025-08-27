'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="px-6 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Saving...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}