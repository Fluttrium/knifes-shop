import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserInfoButtonProps {
  id: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function UserInfoTableButton({
                                      id,
                                      emailVerified,
                                      createdAt,
                                      updatedAt
                                    }: UserInfoButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Подробнее
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Дополнительная информация</DialogTitle>
          <DialogDescription>
            Детальная информация о пользователе
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">ID:</label>
              <p className="text-sm text-muted-foreground">{id}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email подтвержден:</label>
              <p className="text-sm text-muted-foreground">
                {emailVerified ? new Date(emailVerified).toLocaleDateString() : "Не подтвержден"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Дата регистрации:</label>
              <p className="text-sm text-muted-foreground">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Последнее обновление:</label>
              <p className="text-sm text-muted-foreground">
                {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}