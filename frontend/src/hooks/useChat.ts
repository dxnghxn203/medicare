import {useDispatch, useSelector} from 'react-redux';
import {fetchAcceptConversationStart, fetchChatBoxInitStart, fetchGetAllConversationWaitingStart} from "@/store";
import {useState} from 'react';
import {selectAllConversationWaiting} from '@/store/chat/chatSelector';

export function useChat() {
    const dispatch = useDispatch();

    const initChatBox = (
        data: any,
        onSuccess: (data: any) => void,
        onFailure: () => void
    ) => {
        dispatch(
            fetchChatBoxInitStart(
                {
                    data: data,
                    onSuccess: onSuccess,
                    onFailure: onFailure
                }
            )
        )
    }

    const acceptConversation = (
        data: any,
        onSuccess: (data: any) => void,
        onFailure: () => void) => {
        dispatch(fetchAcceptConversationStart({
            data: data,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    };


    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allConversationWaiting = useSelector(selectAllConversationWaiting);
    //  const categoryAdmin: any = useSelector(selectCategoryAdmin);selectAllConversationWaiting
    const fetchGetAllConversationWaiting = (data: any,
                                            onSuccess: () => void,
                                            onFailure: () => void) => {
        dispatch(fetchGetAllConversationWaitingStart({
            data: data,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    };
    return {
        initChatBox,
        page,
        setPage,
        pageSize,
        setPageSize,
        allConversationWaiting,
        fetchGetAllConversationWaiting,
        acceptConversation

    };
}

