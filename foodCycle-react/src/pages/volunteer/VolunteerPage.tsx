import type {WorkspacePageProps} from "@/pages/share/type.ts";
import {ImpactDashboard} from "@/pages/share/ImpactDashboard.tsx";
import {OperationalPage} from "@/pages/share/OperationalPage.tsx";

export default function VolunteerPage(props: WorkspacePageProps) {
    if (props.page === "Overview") {
        return <ImpactDashboard role="Volunteer" onNavigate={props.onNavigate}/>
    }

    return (
        <OperationalPage
            page={props.page}
            role="Volunteer"
            food={props.food}
            onNavigate={props.onNavigate}
            onClaim={props.onClaim}
            onAssign={props.onAssign}
            onComplete={props.onComplete}
            onNotify={props.onNotify}
        />
    )
}