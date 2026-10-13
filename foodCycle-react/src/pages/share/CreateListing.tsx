import { useState } from "react";
import { CheckCircle2, Leaf, Plus, ShieldCheck } from "lucide-react";
import { Button, Card, Input, SelectField } from "@/components/ui";
import type { FoodItem } from "@/types/workspace";

export function CreateListing({
                                  onSubmit,
                              }: {
    onSubmit: (item: FoodItem) => void;
}) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("Produce");
    const [expires, setExpires] = useState("");
    return (
        <div className="form-layout">
            <Card className="form-card">
                <div className="form-section-title">
                    <div className="step-number">1</div>
                    <div>
                        <h2>Tell us about the food</h2>
                        <p>Share a few details so a nearby organization can claim it.</p>
                    </div>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (name.trim() && Number(quantity) > 0 && expires)
                            onSubmit({
                                id: Date.now(),
                                name: name.trim(),
                                category,
                                quantity: Number(quantity),
                                unit:
                                    category === "Prepared meals"
                                        ? "portions"
                                        : category === "Bakery"
                                            ? "pieces"
                                            : "kg",
                                provider: "Green Basket Market",
                                location: "Sanchaung, Yangon",
                                expires: `Today, ${expires}`,
                                timeLeft: "4",
                                status: "Available",
                                icon:
                                    category === "Bakery"
                                        ? "🥖"
                                        : category === "Prepared meals"
                                            ? "🍱"
                                            : "🥬",
                                tint: category === "Bakery" ? "peach" : "sage",
                            });
                    }}
                >
                    <label>
                        Food name{" "}
                        <Input
                            required
                            placeholder="e.g. Fresh seasonal vegetables"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label>
                    <div className="form-row">
                        <label>
                            Food category
                            <SelectField
                                label="Food category"
                                value={category}
                                onValueChange={setCategory}
                                options={[
                                    { value: "Produce", label: "Produce" },
                                    { value: "Bakery", label: "Bakery" },
                                    { value: "Prepared meals", label: "Prepared meals" },
                                    { value: "Dairy", label: "Dairy" },
                                ]}
                            />
                        </label>
                        <label>
                            Quantity available
                            <Input
                                required
                                type="number"
                                min="1"
                                placeholder="e.g. 12"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Best before
                            <Input
                                required
                                type="time"
                                value={expires}
                                onChange={(event) => setExpires(event.target.value)}
                            />
                        </label>
                        <label>
                            Pickup window
                            <SelectField
                                label="Pickup window"
                                defaultValue="Today, 3–6 PM"
                                options={[
                                    { value: "Today, 3–6 PM", label: "Today, 3–6 PM" },
                                    { value: "Today, 6–8 PM", label: "Today, 6–8 PM" },
                                    { value: "Tomorrow, 8–11 AM", label: "Tomorrow, 8–11 AM" },
                                ]}
                            />
                        </label>
                    </div>
                    <label>
                        Pickup address
                        <Input
                            placeholder="Street, township, city"
                            defaultValue="Sanchaung, Yangon"
                        />
                    </label>
                    <label>
                        Notes for the receiving organization
                        <textarea
                            className="input textarea"
                            placeholder="Storage instructions, allergens, packaging details..."
                            rows={3}
                        />
                    </label>
                    <div className="safety-notice">
                        <ShieldCheck size={18} />
                        <span>
              <strong>Food safety first</strong>
              <small>
                Only list food that has been stored and handled safely.
              </small>
            </span>
                    </div>
                    <div className="form-actions">
                        <Button type="button" variant="ghost">
                            Save draft
                        </Button>
                        <Button type="submit">
                            <Plus size={16} /> Publish listing
                        </Button>
                    </div>
                </form>
            </Card>
            <Card className="form-aside">
                <div className="aside-leaf">
                    <Leaf size={21} />
                </div>
                <span className="card-kicker">GOOD TO KNOW</span>
                <h3>A small share can make a big difference.</h3>
                <p>
                    Every listing helps local organizations plan meals and reduces good
                    food from going to waste.
                </p>
                <div className="aside-tip">
                    <CheckCircle2 size={17} />
                    <span>List food before its best-before time</span>
                </div>
                <div className="aside-tip">
                    <CheckCircle2 size={17} />
                    <span>Add clear pickup instructions</span>
                </div>
                <div className="aside-tip">
                    <CheckCircle2 size={17} />
                    <span>Mention allergens and storage needs</span>
                </div>
            </Card>
        </div>
    );
}
