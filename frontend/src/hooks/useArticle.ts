import { all } from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { selectAllArticle, selectAllArticleUser, selectArticleById } from '@/store/article/articleSelector';
import { fetchAddArticleAdminStart, fetchDeleteArticleAdminStart, fetchGetAllArticleAdminStart, fetchGetAllArticleUserStart, fetchGetArticleByIdStart, fetchUpdateArticleAdminStart, fetchUpdateLogoArticleAdminStart } from '@/store';


export function useArticle() {
    const dispatch = useDispatch();
    const getAllArticlesAdmin = useSelector(selectAllArticle);
    const getArticleById = useSelector(selectArticleById);
    const getAllArticlesUser = useSelector(selectAllArticleUser);
    const fetchAllArticlesAdmin = (onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllArticleAdminStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
    };

    const fetchAddArticleAdmin = ( formData: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchAddArticleAdminStart(
            {
                formData: formData,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchDeleteArticleAdmin = ( article_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchDeleteArticleAdminStart(
            {
                article_id: article_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchUpdateArticleAdmin = ( data: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchUpdateArticleAdminStart(
            {
                ...data,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchUpdateLogoArticleAdmin = ( formData: any, article_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchUpdateLogoArticleAdminStart(
            {
                formData: formData,
                article_id: article_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchGetArticleById = ( article_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetArticleByIdStart(
            {
                article_id: article_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchGetAllArticleUser = ( onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllArticleUserStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    };

   
   


    
    return {
        getAllArticlesAdmin,
        fetchAllArticlesAdmin,

        fetchAddArticleAdmin,
        fetchDeleteArticleAdmin,
        fetchUpdateArticleAdmin,
        fetchUpdateLogoArticleAdmin,

        fetchGetArticleById,
        getArticleById,

        getAllArticlesUser,
        fetchGetAllArticleUser,
       
    };
}

