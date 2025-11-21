import React, { useState } from 'react';
import { DataExportRequest } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface DataExportPageProps {
  requests: DataExportRequest[];
  onNewRequest: () => void;
}

const getStatusInfo = (status: DataExportRequest['status']): { icon: React.ReactNode, text: string, color: string } => {
    switch (status) {
        case 'pending':
            return { icon: <ClockIcon className="w-5 h-5" />, text: 'Pending', color: 'text-yellow-400' };
        case 'completed':
            return { icon: <CheckCircleIcon className="w-5 h-5" />, text: 'Completed', color: 'text-green-400' };
        case 'failed':
            return { icon: <ExclamationCircleIcon className="w-5 h-5" />, text: 'Failed', color: 'text-red-400' };
        case 'expired':
            return { icon: <ExclamationCircleIcon className="w-5 h-5" />, text: 'Expired', color: 'text-gray-500' };
        default:
            return { icon: <ClockIcon className="w-5 h-5" />, text: 'Unknown', color: 'text-gray-400' };
    }
};

export const DataExportPage: React.FC<DataExportPageProps> = ({ requests, onNewRequest }) => {
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequest = () => {
        setIsRequesting(true);
        // Simulate API call
        setTimeout(() => {
            onNewRequest();
            setIsRequesting(false);
        }, 1500);
    };

    const isRequestPending = requests.some(r => r.status === 'pending');

    return (
        <div className="p-4 md:p-8 animate-fade-in text-white">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Export Your Data</h2>
                <p className="text-gray-400 mb-6">
                    Request a copy of your personal data in a machine-readable format. This includes your profile information, booking history, and preferences. The process may take up to 24 hours. You will receive a notification when your export is ready.
                </p>
                <button
                    onClick={handleRequest}
                    disabled={isRequesting || isRequestPending}
                    className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isRequesting ? 'Requesting...' : isRequestPending ? 'Request Already Pending' : 'Request Data Export'}
                </button>
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Export History</h3>
                <div className="space-y-3">
                    {requests.length > 0 ? requests.map(req => {
                        const statusInfo = getStatusInfo(req.status);
                        return (
                            <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">Data Export Request</p>
                                    <p className="text-sm text-gray-400">Requested: {new Date(req.requestDate).toLocaleString()}</p>
                                    <div className={`flex items-center gap-2 mt-1 text-sm font-semibold ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.text}</span>
                                    </div>
                                </div>
                                {req.status === 'completed' && req.downloadUrl && (
                                    <a href={req.downloadUrl} download className="flex items-center gap-2 bg-green-500/20 text-green-400 font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-500/40">
                                        <DownloadIcon className="w-5 h-5" />
                                        Download
                                    </a>
                                )}
                            </div>
                        )
                    }) : (
                        <p className="text-center text-gray-500 py-8">You have no previous data export requests.</p>
                    )}
                </div>
            </div>
        </div>
    );
};