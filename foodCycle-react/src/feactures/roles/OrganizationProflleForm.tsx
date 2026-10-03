interface OrganizationProfileFormProps {
    organizationName: string;
    address: string;
    contactNumber: string;
    registrationNumber: string;
    licenseDocumentUrl: string;
    dailyCapacityServings: string;
    onOrganizationNameChange: (organizationName: string) => void;
    onAddressChange: (address: string) => void;
    onContactNumberChange: (contactNumber: string) => void;
    onRegistrationNumberChange: (registrationNumber: string) => void;
    onLicenseDocumentUrlChange: (licenseDocumentUrl: string) => void;
    onCapacityChange: (capacity: string) => void;
}

const inputClassName = "mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm outline-none placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10";

export default function OrganizationProfileForm({
    organizationName,
    address,
    contactNumber,
    registrationNumber,
    licenseDocumentUrl,
    dailyCapacityServings,
    onOrganizationNameChange,
    onAddressChange,
    onContactNumberChange,
    onRegistrationNumberChange,
    onLicenseDocumentUrlChange,
    onCapacityChange,
}: OrganizationProfileFormProps) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#172d27]">
                Organization name
                <input required value={organizationName} onChange={(event) => onOrganizationNameChange(event.target.value)} placeholder="Organization name" className={inputClassName} />
            </label>
            <label className="block text-sm font-semibold text-[#172d27]">
                Contact number
                <input required type="tel" value={contactNumber} onChange={(event) => onContactNumberChange(event.target.value)} placeholder="Organization contact number" className={inputClassName} />
            </label>
            <label className="block text-sm font-semibold text-[#172d27]">
                Registration number
                <input required value={registrationNumber} onChange={(event) => onRegistrationNumberChange(event.target.value)} placeholder="Organization registration number" className={inputClassName} />
            </label>
            <label className="block text-sm font-semibold text-[#172d27]">
                Organization address
                <input required value={address} onChange={(event) => onAddressChange(event.target.value)} placeholder="Enter your address" className={inputClassName} />
            </label>
            <label className="block text-sm font-semibold text-[#172d27]">
                License document URL
                <input required type="url" value={licenseDocumentUrl} onChange={(event) => onLicenseDocumentUrlChange(event.target.value)} placeholder="https://..." className={inputClassName} />
                <span className="mt-1 block text-xs font-normal text-[#75817a]">Upload the document to your file storage service and paste its URL here.</span>
            </label>
            <label className="block text-sm font-semibold text-[#172d27]">
                Daily capacity (servings)
                <input required min="1" step="1" type="number" value={dailyCapacityServings} onChange={(event) => onCapacityChange(event.target.value)} placeholder="e.g. 100" className={inputClassName} />
            </label>
        </div>
    );
}
