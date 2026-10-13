import {
    Bike,
    Box,
    CalendarDays,
    CheckCircle2,
    Leaf,
    MapPin,
    PackageCheck,
    Plus,
    ShieldCheck,
    Truck,
    Users,
    Utensils,
} from "lucide-react";
import type {FoodItem, Role} from "@/types/workspace.ts";

export const initialFood: FoodItem[] = [
    {
        id: 1,
        name: "Fresh market vegetables",
        category: "Produce",
        quantity: 18,
        unit: "kg",
        provider: "Green Basket Market",
        location: "Sanchaung, Yangon",
        expires: "Today, 6:30 PM",
        timeLeft: "3",
        status: "Available",
        icon: "🥬",
        tint: "sage",
    },
    {
        id: 2,
        name: "Assorted bakery bread",
        category: "Bakery",
        quantity: 32,
        unit: "pieces",
        provider: "Morning Crust Bakery",
        location: "Bahan, Yangon",
        expires: "Today, 5:00 PM",
        timeLeft: "2",
        status: "Available",
        icon: "🥖",
        tint: "peach",
    },
    {
        id: 3,
        name: "Cooked rice & curry",
        category: "Prepared meals",
        quantity: 12,
        unit: "portions",
        provider: "Golden Spoon Kitchen",
        location: "Kamayut, Yangon",
        expires: "Today, 7:15 PM",
        timeLeft: "4",
        status: "Available",
        icon: "🍱",
        tint: "butter",
    },
    {
        id: 4,
        name: "Seasonal fruit box",
        category: "Produce",
        quantity: 9,
        unit: "kg",
        provider: "Green Basket Market",
        location: "Sanchaung, Yangon",
        expires: "Tomorrow, 11:00 AM",
        timeLeft: "18",
        status: "Claimed",
        icon: "🍊",
        tint: "peach",
    },
    {
        id: 5,
        name: "Fresh milk cartons",
        category: "Dairy",
        quantity: 15,
        unit: "litres",
        provider: "City Dairy Co.",
        location: "Hledan, Yangon",
        expires: "Tomorrow, 8:00 AM",
        timeLeft: "15",
        status: "Available",
        icon: "🥛",
        tint: "blue",
    },
];

type NavigationItem = {
    label: string;
    icon: typeof Leaf;
};

type NavigationGroup = {
    group: string;
    items: NavigationItem[];
};

export const roleNav: Record<Role, NavigationGroup[]> = {
    NGO: [
        {
            group: "WORKSPACE",
            items: [
                { label: "Overview", icon: Box },
                { label: "Available food", icon: Utensils },
                { label: "My claims", icon: PackageCheck },
                { label: "Beneficiary requests", icon: Users },
            ],
        },
        {
            group: "DELIVERY",
            items: [
                { label: "Delivery assignment", icon: Bike },
                { label: "Delivery tracking", icon: Truck },
                { label: "Claim history", icon: CalendarDays },
            ],
        },
    ],
    Provider: [
        {
            group: "WORKSPACE",
            items: [
                { label: "Overview", icon: Box },
                { label: "My food listings", icon: Utensils },
                { label: "Create listing", icon: Plus },
                { label: "Claim requests", icon: PackageCheck },
            ],
        },
        {
            group: "DELIVERY",
            items: [
                { label: "Pickup schedule", icon: CalendarDays },
                { label: "Food safety form", icon: ShieldCheck },
            ],
        },
    ],
    Volunteer: [
        {
            group: "WORKSPACE",
            items: [
                { label: "Overview", icon: Box },
                { label: "Available missions", icon: Bike },
                { label: "Mission details", icon: MapPin },
            ],
        },
        {
            group: "DELIVERY",
            items: [
                { label: "Pickup confirmation", icon: PackageCheck },
                { label: "Delivery confirmation", icon: Truck },
                { label: "Delivery history", icon: CalendarDays },
            ],
        },
    ],
    Admin: [
        {
            group: "OVERVIEW",
            items: [
                { label: "Overview", icon: Box },
                { label: "Impact dashboard", icon: Leaf },
            ],
        },
        {
            group: "MANAGEMENT",
            items: [
                { label: "Provider verification", icon: ShieldCheck },
                { label: "NGO verification", icon: Users },
                { label: "Food safety monitoring", icon: CheckCircle2 },
                { label: "Dispute management", icon: PackageCheck },
            ],
        },
    ],
};

export const roleCopy: Record<
    Role,
    { name: string; org: string; initials: string }
> = {
    NGO: {
        name: "Thiri Aung",
        org: "Hope Community Center",
        initials: "HA",
    },
    Provider: {
        name: "May Thazin",
        org: "Green Basket Market",
        initials: "GB",
    },
    Volunteer: {
        name: "Ko Min Htet",
        org: "FoodCycle Volunteer",
        initials: "KM",
    },
    Admin: {
        name: "Aye Chan",
        org: "FoodCycle Admin",
        initials: "AC",
    },
};

export const headlineByPage: Record<string, [string, string]> = {
    Overview: [
        "Good afternoon, Thiri",
        "Here’s the good your community is doing today.",
    ],
    "Impact dashboard": [
        "Impact dashboard",
        "A little surplus can make a really big difference.",
    ],
    "Available food": [
        "Available food",
        "Fresh surplus from your neighborhood, ready to be rescued.",
    ],
    "My food listings": [
        "My food listings",
        "Keep track of every meal you’ve made available.",
    ],
    "Create listing": [
        "Create a food listing",
        "Share surplus food with the community in just a few steps.",
    ],
    "My claims": ["My claims", "Food you’ve reserved for your community."],
    "Claim requests": [
        "Claim requests",
        "Review organizations requesting your surplus food.",
    ],
    "Pickup schedule": [
        "Pickup schedule",
        "Your upcoming handoffs, all in one place.",
    ],
    "Beneficiary requests": [
        "Beneficiary requests",
        "Coordinate food support for the people who need it.",
    ],
    "Delivery tracking": [
        "Delivery tracking",
        "Follow every food rescue from pickup to delivery.",
    ],
    "Delivery assignment": [
        "Delivery assignment",
        "Match confirmed food claims with a volunteer for delivery.",
    ],
    "Claim history": [
        "Claim history",
        "A record of food rescued by your organization.",
    ],
    "Food safety form": [
        "Food safety form",
        "Help everyone handle and share food safely.",
    ],
    "Available missions": [
        "Available missions",
        "Pick up a delivery and make someone’s day.",
    ],
    "Mission details": [
        "Mission details",
        "Your next delivery, with everything you need to know.",
    ],
    "Pickup confirmation": [
        "Pickup confirmation",
        "Confirm the food is safely in your hands.",
    ],
    "Delivery confirmation": [
        "Delivery confirmation",
        "Complete the handoff and close the loop.",
    ],
    "Delivery history": [
        "Delivery history",
        "See the good you’ve helped deliver.",
    ],
    "Provider verification": [
        "Provider verification",
        "Review new providers joining the FoodCycle network.",
    ],
    "NGO verification": [
        "NGO verification",
        "Make sure every organization is ready to rescue food.",
    ],
    "Food safety monitoring": [
        "Food safety monitoring",
        "Keep quality and safety at the heart of every rescue.",
    ],
    "Dispute management": [
        "Dispute management",
        "Help resolve issues and keep food moving.",
    ],
};
