import type {WorkspacePageProps} from "@/pages/share/type.ts";
import {ImpactDashboard} from "@/pages/share/ImpactDashboard.tsx";
import {AvailableFood} from "@/pages/share/AvailableFood.tsx";
import {OperationalPage} from "@/pages/share/OperationalPage.tsx";

export default function OrganizationPage(props: WorkspacePageProps) {
    if (props.page === "Overview") {
        return <ImpactDashboard role={"NGO"} onNavigate={props.onNavigate}/>;
    }

    if (props.page === "Available food") {
        return <AvailableFood
            food={props.filteredFood}
            search={props.search}
            setSearch={props.setSearch}
            category={props.category}
            setCategory={props.setCategory}
            claimFood={props.onClaim}
        />
    }

    return (
        <OperationalPage
            page={props.page}
            role="NGO"
            food={props.food}
            onNavigate={props.onNavigate}
            onClaim={props.onClaim}
            onAssign={props.onAssign}
            onComplete={props.onComplete}
            onNotify={props.onNotify}
        />
    )
}