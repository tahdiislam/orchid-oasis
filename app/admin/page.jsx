/** @format */
"use client";
import Image from "next/image";
import profile from "@/public/without_background_img.png";
import { useUserContext } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import italiana from "@/lib/italiana";

const TABS = {
  DETAILS: "DETAILS",
  ORDER_HISTORY: "ORDER_HISTORY",
  ADD_FLOWER: "ADD_FLOWER",
};

export default function Admin() {
  const { user } = useUserContext();
  const [selectedTab, setSelectedTabs] = useState(
    (typeof window !== "undefined" &&
      window.localStorage.getItem("profile_tab")) ||
      TABS.ORDER_HISTORY
  );
  const [orders, setOrders] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    available: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const imgBBAPIKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const djangoAPIEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/flower/create/`;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = window.localStorage.getItem("user_id");
      if (!userId) router.push("/login");
      const admin = window.localStorage.getItem("admin");
      if (!admin) router.push("/profile");
    }
  }, [router]);

  // tab change handler
  const handleChangeTab = (tab) => {
    if (selectedTab !== tab && typeof window !== "undefined") {
      setSelectedTabs((prev) => tab);
      window.localStorage.setItem("profile_tab", tab);
    }
  };
  const handleLoadOrders = (pg = 1) => {
    if (!user?.id) return;
    if (pg < 1 || pg > Math.ceil(parseFloat(orders?.count / 8))) return;
    setPage((prev) => pg);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/order/list/?page=${pg}`)
      .then((res) => {
        if (res.status === 200) {
          setOrders((prev) => res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!orders?.count) handleLoadOrders();
  });

  const handleChangeOrderStatus = async (id) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    setLoading((prev) => true);
    setId((prev) => id);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/order/status/${id}`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading((prev) => false);
        setId((prev) => null);
        if (res.status === 200) {
          toast({
            title: "Status has been Changed",
          });
          handleLoadOrders();
        }
      })
      .catch((err) => {
        setLoading((prev) => false);
        setId((prev) => null);
        console.log(err);
      });
  };

   // Handle form field changes
   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input for image
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    
    // Validate category (integer and required)
    if (!formData.category || isNaN(formData.category)) {
      formErrors.category = "Category ID must be a valid number.";
    }

    // Validate title (required, max length 100)
    if (!formData.title) {
      formErrors.title = "Title is required.";
    } else if (formData.title.length > 100) {
      formErrors.title = "Title cannot exceed 100 characters.";
    }

    // Validate description (required)
    if (!formData.description) {
      formErrors.description = "Description is required.";
    }

    // Validate price (required, must be a valid float number)
    if (!formData.price || isNaN(formData.price)) {
      formErrors.price = "Price must be a valid number.";
    }

    // Validate available quantity (required, integer)
    if (!formData.available || isNaN(formData.available)) {
      formErrors.available = "Available quantity must be a valid number.";
    }

    // Validate image file (required)
    if (!imageFile) {
      formErrors.image = "Please select an image file.";
    }

    setErrors(formErrors);

    // Return true if no errors
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Upload image to imgBB
    const formDataImage = new FormData();
    formDataImage.append('image', imageFile);

    try {
      const imgBBResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgBBAPIKey}`,
        formDataImage
      );

      const imageUrl = imgBBResponse.data.data.url;

      // Post the form data along with the image URL to the Django API
      const fullData = {
        ...formData,
        image_url: imageUrl, // Use the image link from imgBB
      };

      const apiResponse = await axios.post(djangoAPIEndpoint, fullData);

      if (apiResponse.status === 201) {
        alert("Flower successfully created!");
        // Reset form
        setFormData({
          category: '',
          title: '',
          description: '',
          price: '',
          available: '',
        });
        setImageFile(null);
      } else {
        alert("Error creating flower. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error uploading the image or posting data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <main className="flex min-h-[calc(70vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Profile</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <button
              onClick={() => handleChangeTab(TABS.DETAILS)}
              className={`text-start hover:underline ps-3 py-3 rounded-r-full ${
                selectedTab === TABS.DETAILS ? "bg-lime-600 text-white" : ""
              }`}
            >
              Details
            </button>
            <button
              onClick={() => handleChangeTab(TABS.ORDER_HISTORY)}
              className={`text-start hover:underline ps-3 py-3 rounded-r-full ${
                selectedTab === TABS.ORDER_HISTORY
                  ? "bg-lime-600 text-white"
                  : ""
              }`}
            >
              All Order
            </button>
            <button
              onClick={() => handleChangeTab(TABS.ADD_FLOWER)}
              className={`text-start hover:underline ps-3 py-3 rounded-r-full ${
                selectedTab === TABS.ADD_FLOWER ? "bg-lime-600 text-white" : ""
              }`}
            >
              Add Flower
            </button>
          </nav>
          <div className="grid gap-6">
            {selectedTab === TABS.DETAILS ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-12 text-center sm:text-start">
                <Image
                  className="w-36 h-36 rounded-full border-2 border-lime-800"
                  src={profile}
                  alt="Profile"
                />
                <div className="pt-4 flex flex-col gap-2">
                  <h1
                    className={`text-3xl font-semibold text-lime-800 ${italiana.className}`}
                  >
                    {user?.user?.first_name} {user?.user?.last_name}
                  </h1>
                  <p className="text-xl font-medium">
                    Username: {user?.user?.username}
                  </p>
                  <p className="text-xl font-medium">
                    Email: {user?.user?.email}
                  </p>
                </div>
              </div>
            ) : selectedTab === TABS.ORDER_HISTORY ? (
              <section>
                <h1 className={`text-3xl font-bold py-4 ${italiana.className}`}>
                  Order History
                </h1>
                <table width="1000">
                  <thead>
                    <tr className="border-2 border-lime-800">
                      <th className="py-2">Id</th>
                      <th>Status</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Created Date</th>
                      <th>Flower</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {orders?.results?.map((order) => (
                      <tr key={order?.id} className="border-2 border-lime-800">
                        <td className="py-3">{order?.id}</td>
                        <td>
                          {order?.status === "Pending" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                {loading && order?.id === id ? (
                                  <Button
                                    className="bg-lime-600"
                                    disabled
                                    size="sm"
                                  >
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                                    Please wait
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-red-600 text-white"
                                  >
                                    {order?.status}
                                  </Button>
                                )}
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleChangeOrderStatus(order?.id)
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-lime-700 hover:bg-lime-700 text-white cursor-no-drop"
                            >
                              {order?.status}
                            </Button>
                          )}
                        </td>
                        <td>{order?.quantity}</td>
                        <td>{order?.total_price}</td>
                        <td>{order?.created_at}</td>
                        <td>
                          <Link
                            className="text-lime-800 hover:text-lime-800 hover:underline"
                            href={`/flower/${order?.flower?.id}`}
                          >
                            {order?.flower?.title}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination className="my-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={"cursor-pointer"}
                        onClick={() => handleLoadOrders(page - 1)}
                      />
                    </PaginationItem>
                    {Array(Math.ceil(parseFloat(orders?.count / 8)) || 1)
                      ?.fill()
                      ?.map((_, index) => index + 1)
                      ?.map((num) => (
                        <PaginationItem key={num}>
                          <PaginationLink
                            onClick={() => handleLoadOrders(num)}
                            isActive={page === num}
                            className={"cursor-pointer"}
                          >
                            {num}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    <PaginationItem>
                      <PaginationNext
                        className={"cursor-pointer"}
                        onClick={() => handleLoadOrders(page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </section>
            ) : (
              <section>
                <h1>Add New Flower</h1>
                <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Create a New Flower
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Input */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category ID
                      </label>
                      <input
                        type="number"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Title Input */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Description Input */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Price Input */}
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.price ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Available Quantity Input */}
                    <div>
                      <label
                        htmlFor="available"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Available Quantity
                      </label>
                      <input
                        type="number"
                        id="available"
                        name="available"
                        value={formData.available}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.available
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.available && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.available}
                        </p>
                      )}
                    </div>

                    {/* Image File Input */}
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Upload Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className={`mt-1 block w-full p-2 border ${
                          errors.image ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.image && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.image}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                      {loading ? "Uploading..." : "Create Flower"}
                    </button>
                  </form>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
