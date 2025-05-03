import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryBtn } from "../ui/PrimaryBtn";

export default function CreateServer() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a Server</DialogTitle>
        <DialogDescription>
          Give your new server a name. You can change it later if you want.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="server-name" className="text-right">
            Name
          </Label>
          <Input
            id="server-name"
            placeholder="My Server"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <PrimaryBtn type="submit">Create Server</PrimaryBtn>
      </DialogFooter>
    </DialogContent>
  );
}
