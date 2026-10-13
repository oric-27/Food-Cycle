import type {WorkspacePageProps} from "@/pages/share/type.ts";
import {ImpactDashboard} from "@/pages/share/ImpactDashboard.tsx";
import {CreateListing} from "@/pages/share/CreateListing.tsx";
import {FoodListings} from "@/pages/share/FoodListing.tsx";
import {OperationalPage} from "@/pages/share/OperationalPage.tsx";

export default function ProviderPage(props: WorkspacePageProps) {
    if (props.page === "Overview") {
        return <ImpactDashboard role={"Provider"} onNavigate={props.onNavigate}/>
    }

    if (props.page === "Create Listing") {
        return <CreateListing onSubmit={props.onCreatedListing}/>
    }

    if (props.page === "My Food Listing") {
        return <FoodListings food={props.food} onComplete={props.onComplete} />
    }

    return (
        <OperationalPage
            page={props.page}
            role="Provider"
            food={props.food}
            onNavigate={props.onNavigate}
            onClaim={props.onClaim}
            onAssign={props.onAssign}
            onComplete={props.onComplete}
            onNotify={props.onNotify}
        />
    )
}