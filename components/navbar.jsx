/** @format */
"use client";
import Link from "next/link";
import { CircleUser, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserContext } from "@/contexts/userContext";
import axios from "axios";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const userToken =
    typeof window !== "undefined" && window.localStorage.getItem("token");
  const admin =
    typeof window !== "undefined" && window.localStorage.getItem("admin");
  // logout handler
  const handleLogout = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/customer/logout/`, {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200 && typeof window !== "undefined") {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user_id");
          window.localStorage.removeItem("admin");
          setUser(null);
          console.log("successfully logout");
          router.push("/login")
        }
      })
      .catch((err) => {
        console.log("logout error: ", err);
      })
      .finally(() => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user_id");
          window.localStorage.removeItem("admin");
        }
        setUser(null);
        // window.location.reload();
      });
  };
  return (
    <>
      <header className="top-0 flex h-20 items-center gap-4 bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/flower"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Flowers
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Image src={logo} alt="logo" width={70} height={70} />
              </Link>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/flower"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Flowers
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto">
            {userToken ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full border-2 border-lime-700"
                  >
                    <CircleUser className="h-5 w-5 text-lime-700" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    {" "}
                    <Link
                      href={`${admin ? "/admin" : "/profile"}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {admin ? "Admin" : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Button className="w-full border-2 border-lime-700 hover:border-lime-800 bg-lime-700 hover:bg-lime-800 hover:text-white transition-all duration-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full border-2 border-lime-800 hover:bg-lime-800 bg-transparent text-black hover:text-white transition-all duration-300">
                  <Link href="/registration">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
