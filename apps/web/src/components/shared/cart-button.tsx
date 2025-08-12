"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/use-cart";
import { useAuth } from "../../hooks/use-auth";
import { Badge } from "../ui/badge";

export const CartButton = () => {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (cart) {
      setItemCount(cart.totalItems);
    } else if (isAuthenticated) {
      setItemCount(0);
    } else {
      setItemCount(0);
    }
  }, [cart, isAuthenticated]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => (window.location.href = "/cart")}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {isAuthenticated && itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Button>
  );
};
