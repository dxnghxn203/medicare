import {
    fetchAddCategoryStart,
    fetchAddChildCategoryStart,
    fetchAddSubCategoryStart,
    fetchDeleteChildCategoryStart,
    fetchDeleteMainCategoryStart,
    fetchDeleteSubCategoryStart,
    fetchGetAllCategoryForAdminStart,
    fetchGetAllCategoryForMenuStart,
    fetchGetAllCategoryStart,
    fetchGetChildCategoryStart,
    fetchGetMainCategoryStart,
    fetchGetProductByMainSlugStart,
    fetchGetSubCategoryStart,
    fetchUpdateChildCategoryStart,
    fetchUpdateImageChildCategoryStart,
    fetchUpdateImageSubCategoryStart,
    fetchUpdateMainCategoryStart,
    fetchUpdateSubCategoryStart,
    selectAllCategory,
    selectCategoryAdmin,
    selectChildCategory,
    selectMainCategory,
    selectProductByMainSlug,
    selectSubCategory
} from "@/store/category";
import {useDispatch, useSelector} from "react-redux";

export function useCategory() {
    const dispatch = useDispatch();
    const allCategory: any = useSelector(selectAllCategory);
    const mainCategory: any = useSelector(selectMainCategory);
    const subCategory: any = useSelector(selectSubCategory);
    const childCategory: any = useSelector(selectChildCategory);
    const categoryAdmin: any = useSelector(selectCategoryAdmin);

    const fetchAllCategory = () => {
        dispatch(fetchGetAllCategoryStart());
    };

    const fetchMainCategory = (mainCategory: any,
                               onSuccess: () => void,
                               onFailure: () => void) => {
        dispatch(fetchGetMainCategoryStart({
            mainCategory: mainCategory,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    };

    const fetchSubCategory = (
        mainCategory: any,
        subCategory: any,
        onSuccess: () => void,
        onFailure: () => void) => {
        dispatch(fetchGetSubCategoryStart({
                mainCategory: mainCategory,
                subCategory: subCategory,
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
    };
    const fetchChildCategory = (
        mainCategory: any,
        subCategory: any,
        childCategory: any,
        onSuccess: () => void,
        onFailure: () => void
    ) => {
        dispatch(fetchGetChildCategoryStart({
            mainCategory: mainCategory,
            subCategory: subCategory,
            childCategory: childCategory,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    }

    const fetchGetAllCategoryForAdmin = () => {
        dispatch(fetchGetAllCategoryForAdminStart());
    };

    const fetchUpdateMainCategory = (
        formData: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchUpdateMainCategoryStart({
            ...formData,
            onSuccess,
            onFailure,
        }));
    };

    const fetchUpdateSubCategory = (
        formData: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchUpdateSubCategoryStart({
            ...formData,
            onSuccess,
            onFailure,
        }));
    }

    const fetchUpdateChildCategory = (
        formData: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchUpdateChildCategoryStart({
            ...formData,
            onSuccess,
            onFailure,
        }));
    };

    const fetchAddCategory = (
        credentials: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchAddCategoryStart({
            ...credentials,
            onSuccess,
            onFailure,
        }));
    }

    const fetchAddChildCategory = (
        credentials: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchAddChildCategoryStart({
            ...credentials,
            onSuccess,
            onFailure,
        }));
    }

    const fetchAddSubCategory = (
        credentials: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchAddSubCategoryStart({
            ...credentials,
            onSuccess,
            onFailure,
        }));
    }

    const fetchUpdateImageSubCategory = (
        formData: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchUpdateImageSubCategoryStart({
            ...formData,
            onSuccess,
            onFailure,
        }));
    }

    const fetchUpdateImageChildCategory = (
        formData: any,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchUpdateImageChildCategoryStart({
            ...formData,
            onSuccess,
            onFailure,
        }));
    }

    const fetchDeleteChildCategory = (
        child_category_id: string,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchDeleteChildCategoryStart({
            child_category_id,
            onSuccess,
            onFailure,
        }));
    };

    const fetchDeleteSubCategory = (
        sub_category_id: string,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchDeleteSubCategoryStart({
            sub_category_id,
            onSuccess,
            onFailure,
        }));
    };

    const fetchDeleteMainCategory = (
        main_category_id: string,
        onSuccess: () => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchDeleteMainCategoryStart({
            main_category_id,
            onSuccess,
            onFailure,
        }));
    }


    const fetchGetCategoryForMenu = (mainCategorySlug: string,
                                     onSuccess: (data: any) => void,
                                     onFailure: (message: any) => void,
    ) => {
        dispatch(fetchGetAllCategoryForMenuStart({
            mainCategory: mainCategorySlug,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    }


    return {
        allCategory,
        fetchAllCategory,

        fetchMainCategory,
        mainCategory,

        fetchGetCategoryForMenu,

        fetchSubCategory,
        subCategory,

        fetchChildCategory,
        childCategory,

        categoryAdmin,
        fetchGetAllCategoryForAdmin,

        fetchUpdateMainCategory,
        fetchUpdateSubCategory,
        fetchUpdateChildCategory,

        fetchAddCategory,
        fetchAddChildCategory,
        fetchAddSubCategory,

        fetchUpdateImageSubCategory,
        fetchUpdateImageChildCategory,

        fetchDeleteChildCategory,
        fetchDeleteSubCategory,
        fetchDeleteMainCategory,


    };
}

