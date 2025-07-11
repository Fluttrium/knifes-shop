"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInfoTableButton } from "@/components/admin-components/ui/userInfo-table-button";
import { useEffect, useState } from "react";

import api, { User } from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";

export function UserTableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users
      .getAllUsers()
      .then(setUsers)
      .catch((error) => {
        notify(`Пиздец что-то не так ${error}`, "error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    );
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Имя</TableHead>
          <TableHead>Почта</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users!.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              <UserInfoTableButton
                id={user.id}
                emailVerified={user.emailVerified}
                createdAt={user.createdAt}
                updatedAt={user.updatedAt!}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
