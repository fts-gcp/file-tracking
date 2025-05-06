"use client";

import { useRouter } from 'next/navigation';

const StatusFilter = ({ initialStatus }: { initialStatus?: string }) => {
    const router = useRouter();
    const options = [
        { value: "", label: "All" },
        { value: "NOT_RECEIVED", label: "Not Received" },
        { value: "PROCESSING", label: "Processing" },
        { value: "MORE_INFO_REQUIRED", label: "More Info Required" },
        { value: "APPROVED", label: "Approved" },
        { value: "REJECTED", label: "Rejected" },
    ];
    return (
        <select
            className="bg-azureBlue text-white p-2 px-4 rounded-lg"
            onChange={(e) => {
                const newStatus = e.currentTarget.value;
                router.push(`/office/available?page=1&limit=5&status=${newStatus}`);
            }}
            defaultValue={initialStatus}
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default StatusFilter;

export const ClearFileFilter = () => {
    const router = useRouter();
    return (
        <button
            className="bg-red-500 text-white p-2 px-4 rounded-lg"
            onClick={() => {
                router.push(`/office/available`);
            }}
        >
            Clear Filter
        </button>
    );
}