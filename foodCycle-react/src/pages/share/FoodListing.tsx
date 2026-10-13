import { CalendarDays, MoreHorizontal, Search } from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";
import type { FoodItem } from "@/types/workspace";

export function FoodListings({
                                 food,
                                 onComplete,
                             }: {
    food: FoodItem[];
    onComplete: (id: number) => void;
}) {
    return (
        <>
            <div className="tabs-row">
                <button className="tab tab-active">
                    All listings <span>{food.length}</span>
                </button>
                <button className="tab">
                    Available{" "}
                    <span>
            {food.filter((item) => item.status === "Available").length}
          </span>
                </button>
                <button className="tab">
                    Claimed{" "}
                    <span>{food.filter((item) => item.status === "Claimed").length}</span>
                </button>
            </div>
            <Card className="table-card">
                <div className="table-tools">
                    <div className="filter-search">
                        <Search size={16} />
                        <Input
                            placeholder="Search your listings..."
                            aria-label="Search listings"
                        />
                    </div>
                    <Button variant="outline">
                        <CalendarDays size={15} /> Date range
                    </Button>
                </div>
                <div className="table-scroll">
                    <table>
                        <thead>
                        <tr>
                            <th>FOOD ITEM</th>
                            <th>QUANTITY</th>
                            <th>BEST BEFORE</th>
                            <th>STATUS</th>
                            <th> </th>
                        </tr>
                        </thead>
                        <tbody>
                        {food.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="table-food">
                      <span className={`table-emoji ${item.tint}`}>
                        {item.icon}
                      </span>
                                        <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.category} · {item.provider}
                        </small>
                      </span>
                                    </div>
                                </td>
                                <td>
                                    {item.quantity} {item.unit}
                                </td>
                                <td>{item.expires}</td>
                                <td>
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
                                </td>
                                <td>
                                    <button
                                        className="icon-button"
                                        aria-label="Listing actions"
                                        onClick={() =>
                                            item.status === "Claimed"
                                                ? onComplete(item.id)
                                                : undefined
                                        }
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
}