import {Leaf} from "lucide-react";

export default function FoodCycleBrand({light = false} : {light?: boolean}) {
    return (
        <div className="flex items-center gap-2.5">
            <div className={`grid size-10 rotate-[-5deg] place-items-center rounded-xl ${light ? "bg-[#4b7650]" : "bg-[#3e744d] text-white"}`}>
                <Leaf className="rotate-[-5deg]" size={22} strokeWidth={2.5} />
            </div>
            <div className={`text-[19px] leading-none font-bold tracking-[-1px] ${light ? "text-white" : "text-[#27372c]"}`}>
                foodCycle<span className={light ? "text-[#d8e9bc]" : "text-[#76a879]"}>.</span>
                <small className={`mt-1 block text-[8px] font-semibold tracking-[1.4px] ${light ? "text-[#d1e0ce]" : "text-[#a2aaa2]"}`}>GOOD FOOD, GOING FURTHER</small>
            </div>
        </div>
    )

}