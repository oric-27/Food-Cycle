import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "cn";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Card as ShadcnCard } from "@/components/ui/card";
import { Input as ShadcnInput } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export function Button({
                           variant = "primary",
                           className,
                           ...props
                       }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
    const shadcnVariant = variant === "primary" ? "default" : variant;

    return (
        <ShadcnButton
            variant={shadcnVariant}
            className={cn(
                "button h-[35px] rounded-[7px] px-[13px] py-0 text-[10px] font-semibold shadow-none",
                variant === "primary" && "bg-[#3d7249] text-white shadow-[0_2px_5px_#2f60421a] hover:bg-[#305f3b]",
                variant === "secondary" && "border border-[#e4ede1] bg-[#f0f6ee] text-[#3e6e48] hover:bg-[#e7f1e4]",
                variant === "outline" && "border border-[#e7ebe5] bg-white text-[#68736a] hover:border-[#b9d0b5] hover:bg-white hover:text-[#3e714a]",
                variant === "ghost" && "text-[#748075] hover:bg-[#f3f6f2] hover:text-[#3f704a]",
                className,
            )}
            {...props}
        />
    );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <ShadcnCard
            className={cn(
                "card flex-col gap-0 rounded-[10px] border-[#edf0eb] bg-white py-0 text-[#26342b] shadow-[0_2px_7px_rgba(33,54,35,0.025)]",
                className,
            )}
            {...props}
        />
    );
}

export function Badge({
                          children,
                          tone = "neutral",
                      }: {
    children: ReactNode;
    tone?: "neutral" | "green" | "amber" | "blue" | "red";
}) {
    const toneClass = {
        neutral: "bg-[#f1f3f0] text-[#778178]",
        green: "bg-[#edf5eb] text-[#4c8052]",
        amber: "bg-[#f9f3e7] text-[#a98147]",
        blue: "bg-[#edf3f7] text-[#5c809b]",
        red: "bg-[#fbefed] text-[#a96962]",
    }[tone];

    return (
        <ShadcnBadge
            variant="secondary"
            className={cn("badge rounded-full border-0 px-[7px] py-1 text-[8px] font-semibold", toneClass)}
        >
            {children}
        </ShadcnBadge>
    );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <ShadcnInput
            className={cn(
                "input h-[35px] rounded-[7px] border-[#e8ece6] bg-white px-[10px] text-[10px] text-[#465249] shadow-none placeholder:text-[#a4aca4] focus-visible:border-[#9dbb99] focus-visible:ring-[3px] focus-visible:ring-[#7ca77b]/10",
                className,
            )}
            {...props}
        />
    );
}

export function SelectField({
                                label,
                                options,
                                value,
                                defaultValue,
                                onValueChange,
                                className,
                            }: {
    label: string;
    options: { value: string; label: string }[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string | null) => void;
    className?: string;
}) {
    return (
        <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
            <SelectTrigger
                aria-label={label}
                className={cn(
                    "input select h-[35px] min-w-[118px] rounded-[7px] border-[#e8ece6] bg-white px-[10px] py-0 text-[10px] text-[#465249] shadow-none focus-visible:border-[#9dbb99] focus-visible:ring-[3px] focus-visible:ring-[#7ca77b]/10",
                    className,
                )}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function SectionHeading({
                                   title,
                                   detail,
                                   action,
                               }: {
    title: string;
    detail?: string;
    action?: ReactNode;
}) {
    return (
        <div className="section-heading">
            <div>
                <h2>{title}</h2>
                {detail && <p>{detail}</p>}
            </div>
            {action}
        </div>
    );
}