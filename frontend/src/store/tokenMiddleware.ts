import {Middleware} from 'redux';
import {getToken, getTokenAdmin, getTokenPharmacist} from "@/utils/cookie";
import {setClientToken} from "@/utils/configs/axiosClient";
import {ROLE_ACTIONS_ADMIN, ROLE_ACTIONS_PHARMACIST, SYSTEM_ACTIONS} from "@/utils/roleAction";

export const tokenMiddleware: Middleware = store => next => action => {
    if (typeof action !== 'object' || action === null || !('type' in action)) {
        return next(action);
    }
    const actionType = (action.type as string).split('/')[1] || '';

    if (SYSTEM_ACTIONS.includes(actionType) || actionType.startsWith('@@')) {
        return next(action);
    }

    let token: string | undefined = undefined;

    if (ROLE_ACTIONS_ADMIN.includes(actionType)) {
        token = getTokenAdmin();
    } else if (ROLE_ACTIONS_PHARMACIST.includes(actionType)) {
        token = getTokenPharmacist();
    } else {
        token = getToken();
    }
    // console.log(token);
    // console.log(actionType);
    if (token) {
        setClientToken(token);
    }

    return next(action);
};