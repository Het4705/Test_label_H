import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders } from "@/lib/firestore";
import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/Footer";

const Orders = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentUser } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", currentUser?.uid],
    queryFn: () => getUserOrders(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-10 text-center">
              Loading Orders...
            </h1>
          </div>
        </main>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-10 text-center">
            Your <span className="text-accent">Orders</span>
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-playfair mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't placed any orders yet.
              </p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl flex  justify-start gap-2 items-center  font-playfair font-semibold">
                          Order <p className="text-2xl">{index + 1}</p>
                        </h2>
                        <p className="text-muted-foreground">
                          {formatDate(
                            order.createdAt?.toDate?.() ??
                              new Date(order.createdAt?.seconds * 1000)
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {order.items.length}
                        </span>{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                      <p className="font-bold">₹{order.total.toFixed(1)}</p>
                    </div>

                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="details">
                        <AccordionTrigger>Order Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">Order ID</h3>
                              <p className="text-sm text-muted-foreground">
                                {order.id}
                              </p>
                              <h3 className="font-semibold mb-2">Items</h3>
                              <div className="space-y-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.productId}
                                    className="flex items-center space-x-4"
                                  >
                                    <div className="flex-grow">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Qty: {item.quantity}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Size: {item.size}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      ₹{item.price.toFixed(1)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Shipping Address
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                  <p>{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.addressLine1}</p>
                                  {order.shippingAddress.addressLine2 && (
                                    <p>{order.shippingAddress.addressLine2}</p>
                                  )}
                                  <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.postalCode}
                                  </p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>

                              {order.trackingNumber && (
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Tracking Information
                                  </h3>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Package className="h-4 w-4 text-accent" />
                                    <p>{order.trackingNumber}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Orders;
