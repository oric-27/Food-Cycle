import type {FoodItem} from "@/types/workspace.ts";

export type WorkspacePageProps = {
    page: string;
    food: FoodItem[];
    filteredFood: FoodItem[];
    search: string;
    setSearch: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    onNavigate: (page: string) => void;
    onClaim: (id: number) => void;
    onAssign: (id: number) => void;
    onComplete: (id: number) => void;
    onConfirm: (id: number) => void;
    onNotify: (message: string) => void;
    onCreatedListing: (item: FoodItem) => void;
};