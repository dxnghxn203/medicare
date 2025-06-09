import { AuthProvider } from "./authProvider";
import { ReduxProviders } from "./reduxProvider";
import { RoleProvider } from "./roleProvider";
import { ToastProvider } from "./toastProvider";

export const AppProviders = (props: React.PropsWithChildren) => {
    return (
        <ToastProvider>
            <AuthProvider>
                <ReduxProviders>
                    <RoleProvider>
                        {props.children}
                    </RoleProvider>
                </ReduxProviders>
            </AuthProvider>
        </ToastProvider>
    );
};