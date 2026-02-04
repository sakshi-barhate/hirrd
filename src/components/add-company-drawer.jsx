import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only Images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) fetchCompanies();
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <DrawerHeader>
          <DrawerTitle className="text-lg sm:text-xl lg:text-2xl font-bold">
            Add a new company
          </DrawerTitle>
        </DrawerHeader>

        {/* Form */}
        <form
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 pb-0 w-full"
        >
          <Input
            placeholder="Company name"
            {...register("name")}
            className="flex-1"
          />
          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500 flex-1"
            {...register("logo")}
          />

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-full sm:w-40"
          >
            Add
          </Button>
        </form>

        {/* Error Messages */}
        {errors.name && (
          <p className="text-red-500 text-sm sm:text-base mt-2">
            {errors.name.message}
          </p>
        )}
        {errors.logo && (
          <p className="text-red-500 text-sm sm:text-base mt-2">
            {errors.logo.message}
          </p>
        )}
        {errorAddCompany?.message && (
          <p className="text-red-500 text-sm sm:text-base mt-2">
            {errorAddCompany?.message}
          </p>
        )}

        {/* Loader */}
        {loadingAddCompany && (
          <BarLoader width={"100%"} color="#36d7b7" className="mt-2" />
        )}

        {/* Footer */}
        <DrawerFooter className="mt-4 flex justify-end">
          <DrawerClose asChild>
            <Button variant="secondary" type="button" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;