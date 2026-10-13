import { useState } from "react";
import {
    ArrowRight,
    Bike,
    Box,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    MapPin,
    PackageCheck,
    Plus,
    SlidersHorizontal,
} from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";
import type { FoodItem, Role } from "@/types/workspace";

export function OperationalPage({
                                    page,
                                    role,
                                    food,
                                    onNavigate,
                                    onClaim,
                                    onAssign,
                                    onComplete,
                                    onNotify,
                                }: {
    page: string;
    role: Role;
    food: FoodItem[];
    onNavigate: (page: string) => void;
    onClaim: (id: number) => void;
    onAssign: (id: number) => void;
    onComplete: (id: number) => void;
    onNotify: (message: string) => void;
}) {
    const missions = food
        .filter((item) => item.status !== "Picked Up")
        .slice(0, 3);
    const actionable =
        page.includes("history") || page.includes("tracking") ? food : missions;
    const isAdminPage = role === "Admin";
    const [checkedItems, setCheckedItems] = useState([
        false,
        false,
        false,
        false,
    ]);
    return (
        <>
            <div className="operation-summary">
                <Card className="summary-card">
                    <div className="metric-icon icon-green">
                        <PackageCheck size={18} />
                    </div>
                    <div>
                        <strong>{page.includes("request") ? "3" : "8"}</strong>
                        <span>
              {page.includes("request") ? "Waiting for review" : "Active today"}
            </span>
                    </div>
                </Card>
                <Card className="summary-card">
                    <div className="metric-icon icon-orange">
                        <Clock3 size={18} />
                    </div>
                    <div>
                        <strong>2 hrs</strong>
                        <span>Next pickup in</span>
                    </div>
                </Card>
                <Card className="summary-card">
                    <div className="metric-icon icon-blue">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <strong>24</strong>
                        <span>Completed this month</span>
                    </div>
                </Card>
            </div>
            <div className="operation-layout">
                <Card className="operation-card">
                    <SectionHeading
                        title={isAdminPage ? "Needs your attention" : page}
                        detail={
                            isAdminPage
                                ? "A few things are waiting for a helping hand."
                                : "Here are the latest updates from your community."
                        }
                        action={
                            <Button variant="outline">
                                <SlidersHorizontal size={15} /> Filter
                            </Button>
                        }
                    />
                    {page === "Food safety form" || page === "Food safety monitoring" ? (
                        <div className="safety-checklist">
                            {[
                                "Food is within its safe consumption period",
                                "Food has been stored at a safe temperature",
                                "Allergens and ingredients are clearly noted",
                                "Packaging is clean and suitable for transport",
                            ].map((item, index) => (
                                <label className="check-row" key={item}>
                                    <input
                                        type="checkbox"
                                        checked={checkedItems[index]}
                                        onChange={() =>
                                            setCheckedItems((current) =>
                                                current.map((checked, itemIndex) =>
                                                    itemIndex === index ? !checked : checked,
                                                ),
                                            )
                                        }
                                    />
                                    <span className="check-custom">
                    <Check size={13} />
                  </span>
                                    <span>{item}</span>
                                    {index === 0 && <Badge tone="green">Required</Badge>}
                                </label>
                            ))}
                            <Button
                                className="safety-submit"
                                onClick={() =>
                                    onNotify(
                                        checkedItems.every(Boolean)
                                            ? "Safety checklist saved successfully."
                                            : "Please review and confirm each safety item.",
                                    )
                                }
                            >
                                Confirm food safety <ArrowRight size={15} />
                            </Button>
                        </div>
                    ) : page === "Pickup confirmation" ||
                    page === "Delivery confirmation" ? (
                        <div className="confirmation-card">
                            <div className="confirmation-icon">
                                <PackageCheck size={28} />
                            </div>
                            <span className="card-kicker">MISSION #FC-0248</span>
                            <h3>
                                {page === "Pickup confirmation"
                                    ? "Fresh market vegetables"
                                    : "Handoff complete?"}
                            </h3>
                            <p>
                                {page === "Pickup confirmation"
                                    ? "18 kg · Green Basket Market"
                                    : "Confirm the food has reached Hope Community Center."}
                            </p>
                            <div className="confirmation-meta">
                <span>
                  <MapPin size={15} /> Sanchaung, Yangon
                </span>
                                <span>
                  <Clock3 size={15} /> Today, 4:30 PM
                </span>
                            </div>
                            <Button
                                onClick={() => {
                                    onComplete(1);
                                    onNavigate("Delivery history");
                                }}
                            >
                                Confirm {page === "Pickup confirmation" ? "pickup" : "delivery"}{" "}
                                <Check size={15} />
                            </Button>
                        </div>
                    ) : page === "Delivery assignment" ? (
                        <div className="operation-list">
                            {food
                                .filter((item) => item.status === "Claimed")
                                .map((item) => (
                                    <div className="operation-row" key={item.id}>
                                        <div className={`food-emoji ${item.tint}`}>{item.icon}</div>
                                        <div className="operation-copy">
                                            <strong>{item.name}</strong>
                                            <span>
                        {item.provider} · {item.quantity} {item.unit}
                      </span>
                                            <small>
                                                <MapPin size={12} /> {item.location} <span>·</span>{" "}
                                                <Clock3 size={12} /> {item.expires}
                                            </small>
                                        </div>
                                        <Badge tone="amber">Awaiting volunteer</Badge>
                                        <Button
                                            variant="secondary"
                                            onClick={() => onAssign(item.id)}
                                        >
                                            Assign volunteer
                                        </Button>
                                    </div>
                                ))}
                            {food.every((item) => item.status !== "Claimed") && (
                                <div className="empty-state">
                                    <Bike size={25} />
                                    <strong>All claimed food has a delivery assignment</strong>
                                    <span>New confirmed claims will appear here.</span>
                                </div>
                            )}
                        </div>
                    ) : page === "Create listing" ? (
                        <div className="empty-state">
                            <Box size={25} />
                            <strong>Ready to share some good?</strong>
                            <span>Create your first food listing in just a few steps.</span>
                            <Button onClick={() => onNavigate("Create listing")}>
                                <Plus size={15} /> Create listing
                            </Button>
                        </div>
                    ) : (
                        <div className="operation-list">
                            {actionable.map((item) => (
                                <div className="operation-row" key={item.id}>
                                    <div className={`food-emoji ${item.tint}`}>{item.icon}</div>
                                    <div className="operation-copy">
                                        <strong>{item.name}</strong>
                                        <span>
                      {item.provider} · {item.quantity} {item.unit}
                    </span>
                                        <small>
                                            <MapPin size={12} /> {item.location} <span>·</span>{" "}
                                            <Clock3 size={12} /> {item.expires}
                                        </small>
                                    </div>
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
                                    <Button
                                        variant={
                                            item.status === "Available" ? "secondary" : "outline"
                                        }
                                        disabled={item.status === "Picked Up"}
                                        onClick={() =>
                                            item.status === "Available"
                                                ? onClaim(item.id)
                                                : item.status === "Claimed"
                                                    ? onAssign(item.id)
                                                    : onComplete(item.id)
                                        }
                                    >
                                        {item.status === "Available"
                                            ? "Review claim"
                                            : item.status === "Claimed"
                                                ? "Assign volunteer"
                                                : item.status === "Assigned"
                                                    ? "Confirm delivery"
                                                    : "Completed"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
                <Card className="next-card">
                    <div className="next-card-icon">
                        <CalendarDays size={18} />
                    </div>
                    <span className="card-kicker">UP NEXT</span>
                    <h3>Today’s pickup</h3>
                    <div className="next-time">
                        4:30 <small>PM</small>
                    </div>
                    <p>
                        Fresh market vegetables
                        <br />
                        Green Basket Market
                    </p>
                    <div className="next-location">
                        <MapPin size={14} /> 1.2 km away · Sanchaung
                    </div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onNavigate(
                                role === "Volunteer" ? "Mission details" : "Pickup schedule",
                            )
                        }
                    >
                        View details <ArrowRight size={14} />
                    </Button>
                </Card>
            </div>
        </>
    );
}
