/** @format */
"use client";
import Image from "next/image";
import profile from "@/public/without_background_img.png";
import { useUserContext } from "@/contexts/userContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TABS = {
  DETAILS: "DETAILS",
  ORDER_HISTORY: "ORDER_HISTORY",
};

export default function Profile() {
  const { user } = useUserContext();
  const [selectedTab, setSelectedTabs] = useState(
    localStorage.getItem("profile_tab") || TABS.DETAILS
  );
  const [orders, setOrders] = useState([]);
  if (!user?.user?.id) redirect("/login");
  // tab change handler
  const handleChangeTab = (tab) => {
    if (selectedTab !== tab && window !== "undefined") {
      setSelectedTabs((prev) => tab);
      window.localStorage.setItem("profile_tab", tab);
    }
  };
  const handleLoadOrders = () =>
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEDN_URL_PROD}/order/list/?customer_id=${user?.id}`
      )
      .then((res) => {
        if (res.status === 200) {
          setOrders((prev) => res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  useEffect(() => {
    if (orders?.length < 1) handleLoadOrders();
  }, [user?.id]);
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
                selectedTab === TABS.DETAILS ? "bg-emerald-500 text-white" : ""
              }`}
            >
              Details
            </button>
            <button
              onClick={() => handleChangeTab(TABS.ORDER_HISTORY)}
              className={`text-start hover:underline ps-3 py-3 rounded-r-full ${
                selectedTab === TABS.ORDER_HISTORY
                  ? "bg-emerald-500 text-white"
                  : ""
              }`}
            >
              Order History
            </button>
          </nav>
          <div className="grid gap-6">
            {selectedTab === TABS.DETAILS ? (
              <div className="flex items-start justify-start gap-12">
                <Image
                  className="w-36 h-36 rounded-full border-2 border-emerald-500"
                  src={profile}
                  alt="Profile"
                />
                <div className="pt-4 flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold text-emerald-500">
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
            ) : (
              <section>
                <h1 className="text-3xl font-bold py-4">Order History</h1>
                <Table className='text-center'>
                  <TableCaption>A list of your recent orders</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>Id</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                      <TableHead className='text-center'>Quantity</TableHead>
                      <TableHead className='text-center'>Total Price</TableHead>
                      <TableHead className='text-center'>Created at</TableHead>
                      <TableHead className='text-center'>Flower</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.invoice}>
                        <TableCell>{order?.id}</TableCell>
                        <TableCell>{order?.status}</TableCell>
                        <TableCell>{order?.quantity}</TableCell>
                        <TableCell>{order?.total_price}</TableCell>
                        <TableCell>{order?.created_at}</TableCell>
                        <TableCell>
                          <Link
                            className="text-emerald-600 hover:text-emerald-500 hover:underline"
                            href={`/flower/details/${order?.flower?.id}`}
                          >
                            {order?.flower?.title.slice(0, 20)}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}