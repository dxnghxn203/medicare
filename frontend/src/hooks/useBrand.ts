import { all } from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { selectAllBrand, selectAllBrandUser, selectBrandById } from '@/store/brand/brandSelector';
import { fetchAddBrandAdminStart, fetchDeleteBrandAdminStart, fetchGetAllBrandAdminStart, fetchGetAllBrandByIdStart, fetchGetAllBrandUserStart, fetchUpdateBrandAdminStart, fetchUpdateLogoBrandAdminStart } from '@/store';


export function useBrand() {
    const dispatch = useDispatch();
    const getAllBrandsAdmin = useSelector(selectAllBrand);
    const getAllBrandsUser = useSelector(selectAllBrandUser);
    const getBrandById = useSelector(selectBrandById);

    const fetchAllBrandsAdmin = (onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllBrandAdminStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    };

    const fetchAddBrandAdmin = ( formData: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchAddBrandAdminStart(
            {
                formData: formData,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchDeleteBrandAdmin = ( brand_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchDeleteBrandAdminStart(
            {
                brand_id: brand_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchUpdateBrandAdmin = ( data: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchUpdateBrandAdminStart(
            {
                ...data,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }

    const fetchUpdateLogoBrandAdmin = ( formData: any, brand_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchUpdateLogoBrandAdminStart(
            {
                formData: formData,
                brand_id: brand_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    }
    const fetchGetAllBrandUser = (onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllBrandUserStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    };

    const fetchGetBrandById = ( brand_id: any, onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllBrandByIdStart(
            {
                brand_id: brand_id,
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    };


   
   


    
    return {
        getAllBrandsAdmin,
        fetchAllBrandsAdmin,

        fetchAddBrandAdmin,
        fetchDeleteBrandAdmin,
        fetchUpdateBrandAdmin,
        fetchUpdateLogoBrandAdmin,
        getAllBrandsUser,
        fetchGetAllBrandUser,
        getBrandById,
        fetchGetBrandById,
       
    };
}

