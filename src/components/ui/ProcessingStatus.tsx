import React from 'react';
import { Circle as CircleNotch, CheckCircle, XCircle, FileText } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  currentFile?: string;
  message?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  progress,
  currentFile,
  message
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {status === 'processing' && (
            <CircleNotch className="w-6 h-6 text-primary-500 animate-spin" />
          )}
          {status === 'completed' && (
            <CheckCircle className="w-6 h-6 text-secondary-500" />
          )}
          {status === 'error' && (
            <XCircle className="w-6 h-6 text-error-500" />
          )}
          <span className="font-medium text-gray-900 dark:text-white capitalize">
            {status}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {currentFile && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <FileText className="w-4 h-4" />
          <span>{currentFile}</span>
        </div>
      )}

      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default ProcessingStatus;