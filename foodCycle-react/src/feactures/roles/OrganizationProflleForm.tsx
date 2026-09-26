interface OrganizationProfileFormProps {
    address: string;
    registrationNumber: string;
    dailyCapacityServings: string;
    onAddressChange: (address: string) => void;
    onRegistrationNumberChange: (registrationNumber: string) => void;
    onCapacityChange: (capacity: string) => void;
}

export default function OrganizationProfileForm({
                                                    address,
                                                    registrationNumber,
                                                    dailyCapacityServings,
                                                    onAddressChange,
                                                    onRegistrationNumberChange,
                                                    onCapacityChange,
                                                }: OrganizationProfileFormProps) {
    return (
        <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#172d27]">
            Registration number
    <input required value={registrationNumber} onChange={(event) => onRegistrationNumberChange(event.target.value)} placeholder="Organization registration number" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
        </label>
        <label className="block text-sm font-semibold text-[#172d27]">
        Organization address
    <input required value={address} onChange={(event) => onAddressChange(event.target.value)} placeholder="Enter your address" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
        </label>
        <label className="block text-sm font-semibold text-[#172d27]">
        Daily capacity (servings)
    <input required min="1" type="number" value={dailyCapacityServings} onChange={(event) => onCapacityChange(event.target.value)} placeholder="e.g. 100" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
        </label>
        </div>
);
}