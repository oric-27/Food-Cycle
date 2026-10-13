import type {WorkspacePageProps} from "@/pages/share/type.ts";
import {ImpactDashboard} from "@/pages/share/ImpactDashboard.tsx";
import {OperationalPage} from "@/pages/share/OperationalPage.tsx";

export default function AdminPage(props: WorkspacePageProps) {
    if (props.page === "Overview" || props.page === "Impact dashboard") {
        return <ImpactDashboard role="Admin" onNavigate={props.onNavigate}/>
    }

    return (
        <OperationalPage
            page={props.page}
            role={"Admin"}
            food={props.food}
            onNavigate={props.onNavigate}
            onClaim={props.onClaim}
            onAssign={props.onAssign}
            onComplete={props.onComplete}
            onNotify={props.onNotify}
        />
    )

}