import {
    ArrowRight,
    ArrowUpRight,
    Bike,
    Heart,
    Leaf,
    MoreHorizontal,
    Truck,
    Users,
    Utensils,
    Sparkles,
} from "lucide-react";
import { Badge, Button, Card, SelectField } from "@/components/ui";
import type {Role} from "@/types/workspace.ts";

const metrics = [
    {
        title: "Rescued food quantity",
        value: "1,250",
        unit: "kg",
        change: "+18.4%",
        icon: Leaf,
        mood: "green",
    },
    {
        title: "Estimated meals served",
        value: "8,400",
        unit: "meals",
        change: "+12.8%",
        icon: Utensils,
        mood: "orange",
    },
    {
        title: "Total beneficiaries",
        value: "2,680",
        unit: "people",
        change: "+8.2%",
        icon: Heart,
        mood: "lavender",
    },
    {
        title: "Completed deliveries",
        value: "315",
        unit: "deliveries",
        change: "+24.5%",
        icon: Truck,
        mood: "blue",
    },
];

export function ImpactDashboard({
                                    role,
                                    onNavigate,
                                }: {
    role: Role;
    onNavigate: (page: string) => void;
}) {
    return (
        <>
            <div className="metric-grid">
                {metrics.map(({ title, value, unit, change, icon: Icon, mood }) => (
                    <Card className="metric-card" key={title}>
                        <div className="metric-top">
                            <div className={`metric-icon icon-${mood}`}>
                                <Icon size={19} />
                            </div>
                            <button className="more-button" aria-label={`${title} details`}>
                                <MoreHorizontal size={19} />
                            </button>
                        </div>
                        <div className="metric-value">
                            {value}
                            <span>{unit}</span>
                        </div>
                        <div className="metric-bottom">
                            <span>{title}</span>
                            <span className="change">
                <ArrowUpRight size={13} /> {change}
              </span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                <Card className="impact-chart-card">
                    <div className="card-heading">
                        <div>
                            <span className="card-kicker">YOUR IMPACT</span>
                            <h2>Food rescued over time</h2>
                            <p>Keep the good going — every kilo counts.</p>
                        </div>
                        <SelectField
                            label="Chart timeframe"
                            defaultValue="This month"
                            options={[
                                { value: "This month", label: "This month" },
                                { value: "Last 30 days", label: "Last 30 days" },
                                { value: "This year", label: "This year" },
                            ]}
                        />
                    </div>
                    <div className="chart-legend">
            <span>
              <i className="legend-green" /> Rescued food{" "}
                <strong>1,250 kg</strong>
            </span>
                        <span className="legend-change">
              <ArrowUpRight size={14} /> 18.4% vs last month
            </span>
                    </div>
                    <div className="chart-wrap">
                        <div className="chart-y-labels">
                            <span>400</span>
                            <span>300</span>
                            <span>200</span>
                            <span>100</span>
                            <span>0</span>
                        </div>
                        <svg
                            className="impact-chart"
                            viewBox="0 0 720 205"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label="Food rescued increased over the last six months"
                        >
                            <defs>
                                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#5d9a67" stopOpacity=".23" />
                                    <stop offset="100%" stopColor="#5d9a67" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                className="grid-line"
                                d="M0 20H720M0 60H720M0 100H720M0 140H720M0 180H720"
                            />
                            <path
                                d="M0 159 C45 153 64 155 102 143 S166 151 205 121 S267 134 307 104 S374 112 410 91 S481 111 513 75 S581 82 615 53 S681 61 720 26 V180 H0Z"
                                fill="url(#chartFill)"
                            />
                            <path
                                className="chart-line"
                                d="M0 159 C45 153 64 155 102 143 S166 151 205 121 S267 134 307 104 S374 112 410 91 S481 111 513 75 S581 82 615 53 S681 61 720 26"
                            />
                            <circle cx="720" cy="26" r="5.5" className="chart-point" />
                        </svg>
                    </div>
                    <div className="chart-months">
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                    </div>
                </Card>

                <Card className="community-card">
                    <div className="card-heading community-heading">
                        <div>
                            <span className="card-kicker">THE COMMUNITY</span>
                            <h2>Goodness, together</h2>
                        </div>
                        <button className="icon-button">
                            <MoreHorizontal size={19} />
                        </button>
                    </div>
                    <div className="community-stat">
                        <div className="community-icon community-peach">
                            <Users size={17} />
                        </div>
                        <div>
                            <strong>42</strong>
                            <span>Active providers</span>
                        </div>
                        <span className="community-trend">
              +6 <ArrowUpRight size={12} />
            </span>
                    </div>
                    <div className="community-stat">
                        <div className="community-icon community-lilac">
                            <Heart size={17} />
                        </div>
                        <div>
                            <strong>18</strong>
                            <span>Active NGOs</span>
                        </div>
                        <span className="community-trend">
              +3 <ArrowUpRight size={12} />
            </span>
                    </div>
                    <div className="community-stat">
                        <div className="community-icon community-blue">
                            <Bike size={17} />
                        </div>
                        <div>
                            <strong>27</strong>
                            <span>Volunteer heroes</span>
                        </div>
                        <span className="community-trend">
              +8 <ArrowUpRight size={12} />
            </span>
                    </div>
                    <div className="community-note">
                        <Sparkles size={15} />
                        <span>
              Your network grew by <strong>22%</strong> this month. Amazing
              work!
            </span>
                    </div>
                </Card>
            </div>

            <div className="lower-grid">
                <Card className="activity-card">
                    <div className="section-heading">
                        <div>
                            <h2>Recent activity</h2>
                            <p>Little moments making a big difference.</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-button"
                            onClick={() =>
                                onNavigate(
                                    role === "Provider" ? "My food listings" : "Claim history",
                                )
                            }
                        >
                            View all <ArrowRight size={15} />
                        </Button>
                    </div>
                    <div className="activity-list">
                        <ActivityItem
                            icon="🥬"
                            tint="sage"
                            title="Fresh market vegetables"
                            caption="Green Basket Market · 18 kg"
                            time="12 min ago"
                            status="Claimed"
                            tone="green"
                        />
                        <ActivityItem
                            icon="🥖"
                            tint="peach"
                            title="Assorted bakery bread"
                            caption="Morning Crust Bakery · 32 pieces"
                            time="48 min ago"
                            status="Picked up"
                            tone="blue"
                        />
                        <ActivityItem
                            icon="🍱"
                            tint="butter"
                            title="Cooked rice & curry"
                            caption="Golden Spoon Kitchen · 12 portions"
                            time="2 hrs ago"
                            status="Available"
                            tone="amber"
                        />
                        <ActivityItem
                            icon="🍊"
                            tint="peach"
                            title="Seasonal fruit box"
                            caption="Green Basket Market · 9 kg"
                            time="4 hrs ago"
                            status="Delivered"
                            tone="green"
                        />
                    </div>
                </Card>
                <Card className="waste-card">
                    <div className="waste-top">
                        <div className="waste-icon">
                            <Leaf size={18} />
                        </div>
                        <span className="card-kicker">A HEALTHIER PLANET</span>
                    </div>
                    <h2>
                        Less waste.
                        <br />
                        <span>More wonder.</span>
                    </h2>
                    <p>
                        By rescuing food together, our community is already making a
                        difference.
                    </p>
                    <div className="waste-stats">
                        <div>
                            <strong>
                                840<span> kg</span>
                            </strong>
                            <small>estimated food waste reduction</small>
                        </div>
                        <div>
                            <strong>
                                68<span>%</span>
                            </strong>
                            <small>expired food reduction</small>
                        </div>
                    </div>
                    <div className="waste-foot">
                        <span>Every small act adds up</span>
                        <span>↗️</span>
                    </div>
                </Card>
            </div>

            <Card className="quick-action-card">
                <div className="quick-icon">
                    <Sparkles size={20} />
                </div>
                <div>
                    <strong>There’s still good food to rescue today</strong>
                    <span>Fresh listings are waiting nearby. Can you help?</span>
                </div>
                <Button
                    variant="secondary"
                    onClick={() =>
                        onNavigate(
                            role === "Provider"
                                ? "Create listing"
                                : role === "Volunteer"
                                    ? "Available missions"
                                    : role === "Admin"
                                        ? "Impact dashboard"
                                        : "Available food",
                        )
                    }
                >
                    {role === "Provider"
                        ? "Share surplus"
                        : role === "Volunteer"
                            ? "Find a mission"
                            : role === "Admin"
                                ? "View impact"
                                : "Find food"}{" "}
                    <ArrowRight size={15} />
                </Button>
            </Card>
        </>
    );
}

function ActivityItem({
                          icon,
                          tint,
                          title,
                          caption,
                          time,
                          status,
                          tone,
                      }: {
    icon: string;
    tint: string;
    title: string;
    caption: string;
    time: string;
    status: string;
    tone: "green" | "blue" | "amber";
}) {
    return (
        <div className="activity-item">
            <div className={`food-emoji ${tint}`}>{icon}</div>
            <div className="activity-description">
                <strong>{title}</strong>
                <small>{caption}</small>
            </div>
            <span className="activity-time">{time}</span>
            <Badge tone={tone}>{status}</Badge>
        </div>
    );
}
