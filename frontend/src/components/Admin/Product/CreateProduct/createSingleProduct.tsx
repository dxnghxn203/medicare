"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import { useToast } from "@/providers/toastProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { BasicInfoForm } from "./basicInfoForm";
import { CategoryForm } from "./categoryForm";
import { ProductDetailsForm } from "./productDetailsForm";
import { PriceForm } from "./priceForm";
import { IngredientsForm } from "./ingredientsForm";
import { ManufacturerForm } from "./manufacturerForm";
import { ProductImagesForm } from "./productImagesForm";
import { ProductFormProps, ProductFormData } from "./types";

const CreateSingleProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const detailId = searchParams.get("chi-tiet");
  const isViewOnly = !!detailId;
  const productId = editId || detailId;

  const {
    addProduct,
    fetchUpdateProduct,
    getAllProductsAdmin,
    allProductAdmin,
    fetchUpdateCertificateFileProduct,
    fetchUpdateImagesPrimaryProduct,
    fetchUpdateImagesProduct,
  } = useProduct();
  const { categoryAdmin, fetchGetAllCategoryForAdmin } = useCategory();
  const toast = useToast();

  // Main form state
  const [formData, setFormData] = useState<ProductFormData>({
    product_id: "",
    product_name: "",
    slug: "",
    name_primary: "",
    origin: "",
    description: "",
    brand: "",
    uses: "",
    dosage_form: "",
    registration_number: "",
    dosage: "",
    side_effects: "",
    precautions: "",
    storage: "",
    full_descriptions: "",
    prescription_required: false,
    rejected_note: "",
    prices: [
      {
        price_id: "",
        original_price: 0,
        discount: 0,
        unit: "",
        amount: 0,
        weight: 0,
        inventory: 0,
        expired_date: "",
      },
    ],
    ingredients: [
      {
        ingredient_name: "",
        ingredient_amount: "",
      },
    ],
    manufacturer: {
      manufacture_name: "",
      manufacture_address: "",
      manufacture_contact: "",
    },
    category: {
      main_category_name: "",
      main_category_slug: "",
      child_category_name: "",
      child_category_slug: "",
      sub_category_name: "",
      sub_category_slug: "",
      main_category_id: "",
      child_category_id: "",
      sub_category_id: "",
    },
    selectedCategories: {
      main: "",
      sub: "",
      child: "",
    },
  });

  // Files state
  const [images, setImages] = useState<File[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>("");
  const [certificate_file, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string>("");

  // Change tracking state
  const [hasCertificateChanged, setHasCertificateChanged] = useState(false);
  const [hasPrimaryImageChanged, setHasPrimaryImageChanged] = useState(false);
  const [hasImagesChanged, setHasImagesChanged] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Category related state
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>(
    []
  );
  const [availableChildCategories, setAvailableChildCategories] = useState<
    any[]
  >([]);

  // verify_by
  const [verified_by, setVerify_by] = useState<string>("");
  const [is_approved, setIs_approved] = useState<boolean>(false);
  const [expired_date, setExpired_date] = useState<string>("");

  // Load categories on mount
  useEffect(() => {
    fetchGetAllCategoryForAdmin();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (!productId) return;
    getAllProductsAdmin(
      () => {},
      () => {}
    );
  }, [productId]);

  useEffect(() => {
    if (
      !productId ||
      !allProductAdmin ||
      allProductAdmin.length === 0 ||
      !categoryAdmin
    )
      return;

    const product = allProductAdmin.find(
      (item: any) => item.product_id === productId
    );
    if (!product) {
      toast.showToast("Không tìm thấy sản phẩm", "error");
      return;
    }
    console.log("product", product.category.child_category_name);

    setFormData({
      product_id: product.product_id,
      product_name: product.product_name,
      slug: product.slug,
      name_primary: product.name_primary,
      origin: product.origin,
      description: product.description,
      brand: product.brand,
      uses: product.uses,
      dosage_form: product.dosage_form,
      registration_number: product.registration_number,
      dosage: product.dosage,
      side_effects: product.side_effects,
      precautions: product.precautions,
      storage: product.storage,
      full_descriptions: product.full_descriptions,
      prescription_required: product.prescription_required,
      rejected_note: product.rejected_note,
      prices: product.prices.map((p: any) => ({
        price_id: p.price_id,
        original_price: p.original_price,
        discount: p.discount,
        unit: p.unit,
        amount: p.amount,
        weight: p.weight,
        inventory: p.inventory,
        expired_date: p.expired_date,
      })),
      ingredients: product.ingredients.map((i: any) => ({
        ingredient_name: i.ingredient_name,
        ingredient_amount: i.ingredient_amount,
      })),
      manufacturer: {
        manufacture_name: product.manufacturer.manufacture_name,
        manufacture_address: product.manufacturer.manufacture_address,
        manufacture_contact: product.manufacturer.manufacture_contact,
      },
      category: {
        main_category_name: product.category.main_category_name,
        main_category_slug: product.category.main_category_slug,
        main_category_id: product.category.main_category_id,

        sub_category_name: product.category.sub_category_name,
        sub_category_slug: product.category.sub_category_slug,
        sub_category_id: product.category.sub_category_id,

        child_category_name: product.category.child_category_name,
        child_category_slug: product.category.child_category_slug,
        child_category_id: product.category.child_category_id,
      },
      selectedCategories: {
        main: product.category.main_category_id,
        sub: product.category.sub_category_id,
        child: product.category.child_category_id,
      },
    });
    console.log("setFormData", formData);
    setFormData((prev) => ({
      ...prev,
      selectedCategories: {
        main: product.category.main_category_id,
        sub: product.category.sub_category_id,
        child: product.category.child_category_id,
      },
    }));

    if (product.images && product.images.length > 0) {
      const imageUrls = product.images.map((img: any) => img.images_url);
      setImagePreviewUrls(imageUrls);
      setImages(product.images.map((img: any) => img.images_url));
    }
    setPrimaryImagePreview(product.images_primary);
    setPrimaryImage(product.images_primary);
    setCertificateFile(product.certificate_file);
    setIs_approved(product.is_approved);
    setVerify_by(product.verified_by);
  }, [allProductAdmin, productId, categoryAdmin]);

  console.log("formDataMainnnnn", formData);
  useEffect(() => {
    if (formData.selectedCategories.main && categoryAdmin) {
      const mainCat = categoryAdmin.find(
        (cat: any) => cat.main_category_id === formData.selectedCategories.main
      );
      if (mainCat) {
        setAvailableSubCategories(mainCat.sub_category || []);
        setFormData((prev) => ({
          ...prev,
          category: {
            ...prev.category,
            main_category_id: mainCat.main_category_id,
            main_category_name: mainCat.main_category_name,
            main_category_slug: mainCat.main_category_slug,
          },
          selectedCategories: {
            ...prev.selectedCategories,
            sub: "",
            child: "",
          },
        }));
        setAvailableChildCategories([]);
      }
    }
  }, [formData.selectedCategories.main, categoryAdmin]);

  useEffect(() => {
    if (formData.selectedCategories.sub && availableSubCategories.length > 0) {
      const subCat = availableSubCategories.find(
        (cat: any) => cat.sub_category_id === formData.selectedCategories.sub
      );
      if (subCat) {
        setAvailableChildCategories(subCat.child_category || []);
        setFormData((prev) => ({
          ...prev,
          category: {
            ...prev.category,
            sub_category_id: subCat.sub_category_id,
            sub_category_name: subCat.sub_category_name,
            sub_category_slug: subCat.sub_category_slug,
            // child_category_id: "",
            // child_category_name: "",
            // child_category_slug: "",
          },
          selectedCategories: {
            ...prev.selectedCategories,
            // child: "",
          },
        }));
      }
    }
  }, [formData.selectedCategories.sub, availableSubCategories]);

  useEffect(() => {
    if (
      formData.selectedCategories.child &&
      availableChildCategories.length > 0
    ) {
      const childCat = availableChildCategories.find(
        (cat: any) =>
          cat.child_category_id === formData.selectedCategories.child
      );
      if (childCat) {
        setFormData((prev) => ({
          ...prev,
          category: {
            ...prev.category,
            child_category_id: childCat.child_category_id,
            child_category_name: childCat.child_category_name,
            child_category_slug: childCat.child_category_slug,
          },
        }));
      }
    }
  }, [formData.selectedCategories.child, availableChildCategories]);

  // Generate slug from product name
  useEffect(() => {
    if (formData.product_name) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.product_name),
      }));
    }
  }, [formData.product_name]);

  // Function to generate a slug from product name with Vietnamese character support
  const generateSlug = (title: string): string => {
    let slug = title.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    slug = slug.replace(/đ/gi, "d");
    //Xóa các ký tự đặt biệt
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ""
    );
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-/gi, "-");
    slug = slug.replace(/\-\-/gi, "-");
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = "@" + slug + "@";
    slug = slug.replace(/\@\-|\-\@|\@/gi, "");
    return slug;
  };

  // Validate form fields
  const validateForm = (): boolean => {
    if (typeof window === "undefined") return false;

    const newErrors: Record<string, string> = {};

    // Validate basic information
    if (!formData.product_name)
      newErrors.product_name = "Vui lòng điền tên sản phẩm";
    if (!formData.slug) newErrors.slug = "Vui lòng điền Slug";

    // Validate category selection
    if (!formData.category.main_category_id)
      newErrors.main_category = "Vui lòng chọn một danh mục chính";

    // Validate prices
    if (formData.prices.length === 0) {
      newErrors.prices = "Cần có ít nhất một tùy chọn giá";
    } else {
      const priceErrors: string[] = [];
      const today = new Date().toISOString().split("T")[0];
      formData.prices.forEach((price, index) => {
        if (!price.unit)
          priceErrors.push(`Tùy chọn ${index + 1}: Vui lòng điền đơn vị`);
        if (price.original_price <= 0)
          priceErrors.push(`Tùy chọn ${index + 1}: Giá gốc phải lớn hơn 0`);
        if (price.inventory <= 0)
          priceErrors.push(`Tùy chọn ${index + 1}: Số lượng phải lớn hơn 0`);
        if (price.expired_date) {
          const inputDate = price.expired_date.split("T")[0];
          if (inputDate < today) {
            priceErrors.push(
              `Tùy chọn ${
                index + 1
              }: Ngày hết hạn phải là hôm nay hoặc sau hôm nay`
            );
          }
        }
      });
      if (priceErrors.length > 0) {
        newErrors.prices = priceErrors.join(";");
      }
    }

    // Validate ingredients
    const ingredientErrors: string[] = [];
    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.ingredient_name)
        ingredientErrors.push(
          `Thành phần ${index + 1}: Vui lòng điền tên thành phần`
        );
    });
    if (ingredientErrors.length > 0) {
      newErrors.ingredients = ingredientErrors.join("; ");
    }

    // Validate manufacturer
    if (!formData.manufacturer.manufacture_name)
      newErrors.manufacture_name = "Vui lòng điền tên nhà sản xuất";

    // Validate product details
    if (!formData.description || formData.description.trim() === "")
      newErrors.description = "Vui lòng điền mô tả ngắn";

    if (
      !formData.uses ||
      formData.uses.trim() === "" ||
      formData.uses === "<p><br></p>"
    ) {
      newErrors.uses = "Vui lòng điền thông tin công dụng";
    }

    if (!formData.brand) newErrors.brand = "Vui lòng điền thương hiệu sản phẩm";

    // Validate images
    if (images.length === 0)
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm";
    if (!primaryImage)
      newErrors.images_primary = "Vui lòng tải lên hình ảnh sản phẩm chính";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    const isValid = validateForm();

    if (!isValid) {
      if (typeof window !== "undefined") {
        const firstErrorElement = document.querySelector('[data-error="true"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return;
    }

    const dataToSend = {
      product_id: editId,
      product_name: formData.product_name,
      slug: formData.slug,
      name_primary: formData.name_primary,
      origin: formData.origin,
      description: formData.description,
      brand: formData.brand,
      uses: formData.uses,
      dosage_form: formData.dosage_form,
      registration_number: formData.registration_number,
      dosage: formData.dosage,
      side_effects: formData.side_effects,
      precautions: formData.precautions,
      storage: formData.storage,
      full_descriptions: formData.full_descriptions,
      prescription_required: formData.prescription_required,
      prices: formData.prices.map((p) => ({
        price_id: p.price_id,
        original_price: p.original_price,
        discount: p.discount,
        unit: p.unit,
        amount: p.amount,
        weight: p.weight,
        inventory: p.inventory,
      })),

      ingredients: {
        ingredients: formData.ingredients.map((i) => ({
          ingredient_name: i.ingredient_name,
          ingredient_amount: i.ingredient_amount,
        })),
      },
      manufacturer: formData.manufacturer,
      category: {
        main_category_id: formData.selectedCategories.main,
        sub_category_id: formData.selectedCategories.sub,
        child_category_id: formData.selectedCategories.child,
      },
      images: imagePreviewUrls,
      images_primary: primaryImagePreview,
    };
    console.log("dataToSend", dataToSend);

    const urlToFile = async (
      url: string,
      filename: string,
      mimeType: string
    ): Promise<File> => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: mimeType });
    };

    const prepareImages = async () => {
      const formData_Images = new FormData();

      for (const image of images) {
        if (typeof image === "string") {
          const file = await urlToFile(image, "old_image.jpg", "image/jpeg");
          formData_Images.append("files", file);
        } else {
          formData_Images.append("files", image);
        }
      }

      return formData_Images;
    };

    if (editId) {
      try {
        if (hasCertificateChanged) {
          const formData_Certificate = new FormData(e.currentTarget);
          if (certificate_file) {
            formData_Certificate.append("file", certificate_file);
          }
          await fetchUpdateCertificateFileProduct(
            { product_id: editId, file: formData_Certificate },
            (msg) => toast.showToast(msg, "success"),
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (hasPrimaryImageChanged) {
          const formData_PrimaryImage = new FormData();
          if (primaryImage) {
            formData_PrimaryImage.append("file", primaryImage);
          }
          await fetchUpdateImagesPrimaryProduct(
            { product_id: editId, file: formData_PrimaryImage },
            (msg) => {
              // toast.showToast(msg, "success");
              router.push("/san-pham/quan-ly-san-pham");
            },
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (hasImagesChanged) {
          const formData_Images = await prepareImages();
          await fetchUpdateImagesProduct(
            { product_id: editId, files: formData_Images },
            (msg) => {
              // toast.showToast(msg, "success"),
              router.push("/san-pham/quan-ly-san-pham");
            },
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (Object.keys(dataToSend).length > 0) {
          await fetchUpdateProduct(
            dataToSend,
            (msg: string) => toast.showToast(msg, "success"),
            () => router.push("/san-pham/them-san-pham-don?chi-tiet=" + editId)
          );
        }
      } catch (error: any) {
        toast.showToast("Lỗi khi cập nhật: " + error.message, "error");
      }
    } else {
      const formDataObj = new FormData(e.currentTarget);
      formDataObj.delete("images");
      formDataObj.delete("images_primary");

      images.forEach((image) => {
        formDataObj.append("images", image);
      });

      if (primaryImage) {
        formDataObj.append("images_primary", primaryImage);
      }

      if (certificate_file) {
        formDataObj.append("certificate_file", certificate_file);
      }

      formDataObj.set(
        "ingredients",
        JSON.stringify({ ingredients: formData.ingredients })
      );
      const today = new Date().toISOString().split("T")[0];

      const sanitizedPrices = formData.prices.map((item: any) => ({
        ...item,
        expired_date: item.expired_date === "" ? today : item.expired_date,
      }));

      formDataObj.set("prices", JSON.stringify({ prices: sanitizedPrices }));
      formDataObj.set("manufacturer", JSON.stringify(formData.manufacturer));
      formDataObj.set("category", JSON.stringify(formData.category));
      formDataObj.set("uses", formData.uses);
      formDataObj.set("dosage_form", formData.dosage_form);
      formDataObj.set("registration_number", formData.registration_number);
      formDataObj.set("dosage", formData.dosage);
      formDataObj.set("side_effects", formData.side_effects);
      formDataObj.set("precautions", formData.precautions);
      formDataObj.set("storage", formData.storage);
      formDataObj.set("full_descriptions", formData.full_descriptions);
      formDataObj.set(
        "prescription_required",
        JSON.stringify(formData.prescription_required)
      );

      setLoading(true);
      await addProduct(
        formDataObj,
        (message: any) => {
          toast.showToast(message, "success");
          resetForm();
        },
        (message: any) => {
          toast.showToast(message, "error");
        }
      );
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      product_name: "",
      slug: "",
      name_primary: "",
      origin: "",
      description: "",
      brand: "",
      uses: "",
      dosage_form: "",
      registration_number: "",
      dosage: "",
      side_effects: "",
      precautions: "",
      storage: "",
      full_descriptions: "",
      prescription_required: false,
      rejected_note: "",
      prices: [
        {
          price_id: "",
          original_price: 0,
          discount: 0,
          unit: "",
          amount: 0,
          weight: 0,
          inventory: 0,
          expired_date: "",
        },
      ],
      ingredients: [{ ingredient_name: "", ingredient_amount: "" }],
      manufacturer: {
        manufacture_name: "",
        manufacture_address: "",
        manufacture_contact: "",
      },
      category: {
        main_category_name: "",
        main_category_slug: "",
        child_category_name: "",
        child_category_slug: "",
        sub_category_name: "",
        sub_category_slug: "",
        main_category_id: "",
        child_category_id: "",
        sub_category_id: "",
      },
      selectedCategories: {
        main: "",
        sub: "",
        child: "",
      },
    });

    setImages([]);
    setPrimaryImage(null);
    setImagePreviewUrls([]);
    setPrimaryImagePreview("");
    setCertificateFile(null);
    setCertificatePreview("");
    setErrors({});
    setFormSubmitted(false);
  };

  // Update form data handlers
  const updateBasicInfo = (updates: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updatePrices = (newPrices: any[]) => {
    setFormData((prev) => ({ ...prev, prices: newPrices }));
  };

  const updateIngredients = (newIngredients: any[]) => {
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const updateManufacturer = (newManufacturer: any) => {
    setFormData((prev) => ({ ...prev, manufacturer: newManufacturer }));
  };

  const updateCategory = (categoryType: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: {
        ...prev.selectedCategories,
        [categoryType]: value,
      },
    }));
  };

  // Image handlers
  const handleImagesChange = (files: File[], previews: string[]) => {
    setImages(files);
    setImagePreviewUrls(previews);
    setHasImagesChanged(true);
  };

  const handlePrimaryImageChange = (file: File | null, preview: string) => {
    setPrimaryImage(file);
    setPrimaryImagePreview(preview);
    setHasPrimaryImageChanged(true);
  };

  const handleCertificateChange = (file: File | null, preview: string) => {
    setCertificateFile(file);
    setCertificatePreview(preview);
    setHasCertificateChanged(true);
  };

  const hasError = (fieldName: string): boolean => {
    return formSubmitted && !!errors[fieldName];
  };

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black">
        <h1>
          {editId
            ? "Cập nhật sản phẩm"
            : detailId
            ? "Xem chi tiết sản phẩm"
            : "Thêm sản phẩm"}
        </h1>
      </h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/san-pham" className="text-gray-800">
          Sản phẩm
        </Link>
        <span> / </span>
        <Link href="/san-pham/them-san-pham-don" className="text-gray-800">
          {editId
            ? "Cập nhật sản phẩm"
            : detailId
            ? "Xem chi tiết sản phẩm"
            : "Thêm sản phẩm"}
        </Link>
      </div>
      <form onSubmit={submitProduct}>
        <div className="flex gap-4 h-full">
          <div className="w-2/3 flex flex-col space-y-5">
            <div className="bg-white shadow-sm rounded-2xl p-5 flex flex-col h-full">
              <BasicInfoForm
                formData={formData}
                updateFormData={updateBasicInfo}
                errors={errors}
                hasError={hasError}
                isViewOnly={isViewOnly}
                productId={productId || ""}
                verified_by={verified_by}
                is_approved={is_approved}
              />

              <CategoryForm
                formData={formData}
                updateCategory={updateCategory}
                categoryAdmin={categoryAdmin}
                availableSubCategories={availableSubCategories}
                availableChildCategories={availableChildCategories}
                errors={errors}
                hasError={hasError}
                isViewOnly={isViewOnly}
                productId={productId || ""}
                verified_by={verified_by}
                is_approved={is_approved}
              />
            </div>

            <ProductDetailsForm
              formData={formData}
              updateFormData={updateBasicInfo}
              errors={errors}
              hasError={hasError}
              isViewOnly={isViewOnly}
              productId={productId || ""}
              verified_by={verified_by}
              is_approved={is_approved}
            />

            <IngredientsForm
              ingredients={formData.ingredients}
              updateIngredients={updateIngredients}
              errors={errors}
              hasError={hasError}
              isViewOnly={isViewOnly}
            />

            <ManufacturerForm
              manufacturer={formData.manufacturer}
              updateManufacturer={updateManufacturer}
              brand={formData.brand}
              updateBrand={(brand) =>
                setFormData((prev) => ({ ...prev, brand }))
              }
              errors={errors}
              hasError={hasError}
              isViewOnly={isViewOnly}
            />
          </div>

          <div className="w-1/3 flex flex-col space-y-5">
            <PriceForm
              prices={formData.prices}
              updatePrices={updatePrices}
              errors={errors}
              hasError={hasError}
              isViewOnly={isViewOnly}
            />

            <ProductImagesForm
              images={images}
              primaryImage={primaryImage}
              imagePreviewUrls={imagePreviewUrls}
              primaryImagePreview={primaryImagePreview}
              certificateFile={certificate_file}
              certificatePreview={certificatePreview}
              onImagesChange={handleImagesChange}
              onPrimaryImageChange={handlePrimaryImageChange}
              onCertificateChange={handleCertificateChange}
              errors={errors}
              hasError={hasError}
              isViewOnly={isViewOnly}
            />
          </div>
        </div>

        {!detailId && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
            >
              {editId ? "Cập nhật" : "Tạo sản phẩm"}
            </button>
            <button
              type="button"
              className="text-sm text-red-500 font-semibold py-2 px-6 rounded-lg border border-red-500 hover:bg-red-500 hover:text-white"
              onClick={resetForm}
            >
              Hủy
            </button>
          </div>
        )}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Đang xử lý...
              </span>
            </div>
          </div>
        )}

        {formSubmitted && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium text-sm">
              Vui lòng sửa các lỗi sau:
            </p>
            <ul className="list-disc pl-5 mt-1 text-xs text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {detailId && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
            onClick={() => {
              router.push(`/san-pham/them-san-pham-don?edit=${detailId}`);
            }}
          >
            Cập nhật sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateSingleProduct;
