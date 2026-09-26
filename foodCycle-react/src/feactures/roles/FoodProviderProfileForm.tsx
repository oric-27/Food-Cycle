import type {ProviderType} from "../auth/auth.ts";


interface FoodProviderProfileFormProps {
    address: string;
    providerType: ProviderType;
    onAddressChange: (address: string) => void;
    onProviderTypeChange: (providerType: ProviderType) => void;
}

export default function FoodProviderProfileForm({
                                                    address,
                                                    providerType,
                                                    onAddressChange,
                                                    onProviderTypeChange,
                                                }: FoodProviderProfileFormProps) {
    return (
        <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#172d27]">
            Provider type
    <select value={providerType} onChange={(event) => onProviderTypeChange(event.target.value as ProviderType)} className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10">
    <option value="RESTAURANT">Restaurant</option>
        <option value="HOTEL">Hotel</option>
        <option value="BAKERY">Bakery</option>
        <option value="SUPERMARKET">Supermarket</option>
        <option value="OTHER">Other</option>
        </select>
        </label>
        <label className="block text-sm font-semibold text-[#172d27]">
        Business address
    <input required value={address} onChange={(event) => onAddressChange(event.target.value)} placeholder="Enter your address" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
        </label>
        </div>
);
}