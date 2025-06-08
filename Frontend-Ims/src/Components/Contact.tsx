// import { Button } from "./ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog"

// import { Textarea } from "./ui/textarea"

// export function DialogDemo() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="bg-blue-600 border-none text-white">Contact Support</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Contact Support</DialogTitle>
//           <DialogDescription>
//             Contact to contact@primemart.gmail.com
//           </DialogDescription>
//         </DialogHeader>
//          <div>
//             <Textarea />
//          </div>
//         <DialogFooter>
//           <Button type="submit">Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { toast } from "sonner";

export function SupportDialog() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://email-service-m1hp.onrender.com/api/send-email", form);
      console.log(res)
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Error sending message");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-600 border-none text-white">
          Contact Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Submit your query and we’ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Textarea
            placeholder="Write your message..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
