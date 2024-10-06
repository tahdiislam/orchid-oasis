/** @format */
"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImg from "@/public/authetication/login.svg";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/userContext";
import { useEffect, useState } from "react";
import italiana from "@/lib/italiana";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { user, fetchUser, admin } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = window.localStorage.getItem("user_id");
      if (user) router.push("/");
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const data = {
      username: form.username.value,
      password: form.password.value,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/customer/login/`,
        data
      );

      if (res.status === 200 && typeof window !== "undefined") {
        // Store user data in localStorage
        window.localStorage.setItem("token", res.data.token);
        window.localStorage.setItem("user_id", res.data.user_id);
        if (res.data.admin) {
          window.localStorage.setItem("admin", res.data.admin);
        }

        // Display success toast
        toast({
          description: "Successfully Login",
        });

        // Reset form
        form.reset();

        // Fetch user data
        await fetchUser();

        // Redirect based on user role
        if (res.data.admin) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Optionally handle specific error messages
      if (error.response && error.response.status === 400) {
        toast({
          description: "Invalid credentials",
          status: "error",
          variant: "destructive",
        });
      } else {
        toast({
          description: error.message,
          status: "error",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className={`text-3xl font-bold ${italiana.className}`}>
              Login
            </h1>
            <p className="text-balance text-muted-foreground"></p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="robinson24"
                required
                name="username"
                // defaultValue="tarak"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link> */}
              </div>
              <Input
                placeholder="********"
                name="password"
                id="password"
                type="password"
                required
                // defaultValue="Peralo2061@reebsdcom"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-lime-800 hover:bg-lime-700 transition-all duration-300 disabled:bg-lime-300"
              disabled={loading}
            >
              <Loader2
                className={`${
                  !loading ? "hidden" : "block"
                } mr-2 h-4 w-4 animate-spin`}
              />
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="registration" className="underline">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={loginImg}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
