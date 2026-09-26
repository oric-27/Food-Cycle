interface VolunteerProfileFormProps {
    address: string;
    isAvailable: boolean;
    onAddressChange: (address: string) => void;
    onAvailabilityChange: (isAvailable: boolean) => void;
}

export default function VolunteerProfileForm({
                                                 address,
                                                 isAvailable,
                                                 onAddressChange,
                                                 onAvailabilityChange,
                                             }: VolunteerProfileFormProps) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#172d27]">
                Where are you based?
                <input required value={address} onChange={(event) => onAddressChange(event.target.value)} placeholder="City or area" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dce8df] p-4 text-sm font-semibold text-[#172d27]">
                <input type="checkbox" checked={isAvailable} onChange={(event) => onAvailabilityChange(event.target.checked)} className="h-4 w-4 accent-[#1b8d62]" />
                I am available to help with food rescue activities
            </label>
        </div>
    );
}