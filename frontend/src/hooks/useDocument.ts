import {useDispatch} from "react-redux";
import {fetchDocumentByRequestIdStart} from "@/store";

export function useDocument() {
    const dispatch = useDispatch();

    const getDocumentByRequestId = (
        requestId: string,
        onSuccess: (data: any) => void,
        onFailure: (error: any) => void
    ) => {
        dispatch(fetchDocumentByRequestIdStart({
            requestId: requestId,
            onSuccess: onSuccess,
            onFailure: onFailure
        }))
    }
    return {
        getDocumentByRequestId
    };
}