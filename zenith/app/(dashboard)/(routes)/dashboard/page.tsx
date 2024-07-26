/*
import { Button } from "@/components/ui/button";

 export default function DashboardPage() {
  return (
    <Button variant = "destructive">Click Me</Button>
  );
} */

import { UserButton } from "@clerk/nextjs"

const DashboardPage = () => {
  return (
    <div>
      <p>Dashboard Page (Protected)</p>
      <UserButton />
    </div> 
  )
}

export default DashboardPage
