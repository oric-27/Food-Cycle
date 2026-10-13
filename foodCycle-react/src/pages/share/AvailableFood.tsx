import {
    ArrowRight,
    Check,
    ChevronDown,
    Clock3,
    Heart,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { Badge, Button, Card, Input, SelectField } from "@/components/ui";
import type { FoodItem } from "@/types/workspace";

export function AvailableFood({
                                  food,
                                  search,
                                  setSearch,
                                  category,
                                  setCategory,
                                  claimFood,
                              }: {
    food: FoodItem[];
    search: string;
    setSearch: (value: string) => void;
    category: string;
    setCategory: (value: string | null) => void;
    claimFood: (id: number) => void;
}) {
    return (
        <>
            <div className="list-toolbar">
                <div className="filter-search">
                    <Search size={17} />
                    <Input
                        placeholder="Search food or provider..."
                        aria-label="Search food or provider"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <SelectField
                    label="Filter by category"
                    value={category}
                    onValueChange={setCategory}
                    options={[
                        { value: "All categories", label: "All categories" },
                        { value: "Produce", label: "Produce" },
                        { value: "Bakery", label: "Bakery" },
                        { value: "Prepared meals", label: "Prepared meals" },
                        { value: "Dairy", label: "Dairy" },
                    ]}
                />
                <Button variant="outline">
                    <SlidersHorizontal size={16} /> More filters
                </Button>
            </div>
            <div className="results-caption">
        <span>
          <strong>
            {food.filter((item) => item.status === "Available").length} fresh
            listings
          </strong>{" "}
            near your community
        </span>
                <span>
          <MapPin size={14} /> Yangon, Myanmar <ChevronDown size={14} />
        </span>
            </div>
            <div className="food-grid">
                {food.map((item) => (
                    <FoodCard key={item.id} item={item} claimFood={claimFood} />
                ))}
                {food.length === 0 && (
                    <Card className="empty-state">
                        <Search size={25} />
                        <strong>No food found just yet</strong>
                        <span>Try another search or category.</span>
                    </Card>
                )}
            </div>
        </>
    );
}

function FoodCard({
                      item,
                      claimFood,
                  }: {
    item: FoodItem;
    claimFood: (id: number) => void;
}) {
    return (
        <Card className="food-card">
            <div className={`food-art ${item.tint}`}>
                <span>{item.icon}</span>
                <Badge
                    tone={
                        item.status === "Available"
                            ? "green"
                            : item.status === "Claimed"
                                ? "amber"
                                : "blue"
                    }
                >
                    {item.status}
                </Badge>
                <button className="favorite-button" aria-label="Save food listing">
                    <Heart size={17} />
                </button>
            </div>
            <div className="food-card-body">
                <span className="category-label">{item.category}</span>
                <h3>{item.name}</h3>
                <div className="food-quantity">
                    <strong>
                        {item.quantity} {item.unit}
                    </strong>
                    <span>available</span>
                </div>
                <div className="food-provider">
                    <div className="provider-avatar">{item.provider.slice(0, 1)}</div>
                    <div>
                        <strong>{item.provider}</strong>
                        <span>
              <MapPin size={12} /> {item.location}
            </span>
                    </div>
                </div>
                <div className={`expiry ${parseInt(item.timeLeft) <= 3 ? "expiry-soon" : ""}`}>
                    <Clock3 size={14} /> Best before {item.expires}
                </div>
                <Button
                    className="food-claim-button"
                    variant={item.status === "Available" ? "primary" : "outline"}
                    disabled={item.status !== "Available"}
                    onClick={() => claimFood(item.id)}
                >
                    {item.status === "Available" ? (
                        <>
                            Claim this food <ArrowRight size={15} />
                        </>
                    ) : (
                        <>
                            {item.status} <Check size={15} />
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
